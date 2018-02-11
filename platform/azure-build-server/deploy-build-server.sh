#!/bin/bash

###################################################################################################
# Script Name: deploy-build-server.sh
# Author: Igor Ljaskevic
# Description: Validates then deploys an ARM template.  It will look for an azureDeploy.json and
# azureDeploy.parameters.json then validate it and if valid, deploy it.
#
# Options:
#
# -g <resourceGroup>
# -s <storageAccount>
# -u <azureVmUsername>
# -n <buildServerDnsPrefix>
# -v if provided will only validate not deploy
#
#######################################################################################################
SECONDS=0

resourceGroup=''
storageAccount=''
## Currently, AKS is only available in 'eastus,westeurope,centralus' regions
resourceGroupLocation='eastus'
template='arm/azureDeploy.json'
parameters='arm/azureDeploy.parameters.json'
tempParameters='arm/temp.parameters.json'
azureVmUsername=''
buildServerDnsPrefix=''
justValidate=false

function log {
    echo "deploy-build-server.sh --> $*"
}

function usage {
    log "To validate and deploy:  ./deploy-build-server.sh -g <resourceGroup> -s <storageAccountName> -u <azureVmUsername> -n <buildServerDnsPrefix>"
    log "-g <resourceGroup> - Name of the Resource Group"
    log "-s <storageAccountName> - Name of the Azure storage account (Must be globally unique)"
    log "-u <azureVmUsername> - Admin username for the Azure VM"
    log "-n <buildServerDnsPrefix> - DNS prefix for build server (Must be globally unique)"
    log "To just validate: add the ARM template -v switch"
}

function check_resource_group {
    rgExists="$(az group list | grep ${resourceGroup})"
    if [[ !  -z  $rgExists  ]]
    then
        log "Resource group '${resourceGroup}' already exists"
        az group show -g "${resourceGroup}"
        read -r -p "Do you wish to deploy to this resource group? [y/N] " response
        if [[ "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]
        then
            log "Deploying to '${resourceGroup}' resource group"
            resourceGroupLocation="$(az group show -g ${resourceGroup} -o tsv | awk '{print $2}')"
        else
            exit 1
        fi
    else
        log "Resource group '${resourceGroup}' not found"
        log "Creating new resource group called '${resourceGroup}' in 'East US' region"
        az group create -n "${resourceGroup}" -l "${resourceGroupLocation}"
    fi
}

function create_storage_account {
    log "Getting location of Resource Group - ${resourceGroup}"
    resourceGroupLocation="$(az group show -g ${resourceGroup} -o tsv | awk '{print $2}')"
    log "Found resource group location = ${resourceGroupLocation}"

    log "Checking if storage account already (${storageAccount}) exists..."
    az storage account list | grep 'Storage' | awk '{ print $2;}' | grep -q "^${storageAccount}$";
    grepReturn=$? # Needs to be called right after the command whose return code we want to capture
    log "...done!"

    if [[ $grepReturn -eq 0 ]]
    then
        log "Storage account '${storageAccount}' already exists!"
        az storage account show -n "${storageAccount}" -g "${resourceGroup}"
        read -r -p "Do you wish to deploy to this storage account? [y/N] " response
        if [[ "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]
        then
            log "Deploying to '${storageAccount}' storage account"
        else
            exit 1
        fi
    else
        log "No existing storage account called ${storageAccount}"
        log "Creating storage account and getting storage connectionString and accessKey"
        az storage account create --sku "Standard_LRS" -l "${resourceGroupLocation}" -g "${resourceGroup}" -n "${storageAccount}" || exit 1
    fi

    log "Replacing placeholders in .parameters.json file with new storage account info"
    cp "${parameters}" "${tempParameters}"
    if [ "$(uname)" == "Darwin" ]; then # Mac
        log "User is on a Mac - Installing GNU tools for Mac"
        brew install gnu-sed --with-default-names
    elif [ "$(uname)" == "Linux" ]; then # Linux
        log "User is on a Linux - do nothing"
    fi

    log "Replacing placeholders in ARM template parameters file"
    sed -i "s~STORAGE_ACCOUNT_NAME~${storageAccount}~g" "${tempParameters}" || exit 1
    sed -i "s~AZURE_VM_USERNAME~${azureVmUsername}~g" "${tempParameters}" || exit 1
    sed -i "s~BUILD_SERVER_UNIQUE_DNS_PREFIX~${buildServerDnsPrefix}~g" "${tempParameters}" || exit 1

    localPubKey='keys/id_rsa.pub'
    if [ -e ~/.ssh/id_rsa.pub ]; then
        log "Found local public SSH key -> ~/.ssh/id_rsa.pub"
        read -r -p "Do you wish to use local '~/.ssh/id_rsa.pub' for Build server access? [y/N] " response
        if [[ "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]
        then
            log "Using local public SSH key for Build server access"
            publicSshKey="$(cat ~/.ssh/id_rsa.pub)"
        else
            log "Using default public SSH keys in 'keys' folder for Build server access"
            publicSshKey="$(cat $localPubKey)"
        fi
    fi
    log "Public SSH Key --> $publicSshKey"

    sed -i "s~PUBLIC_SSH_KEY~${publicSshKey}~g" "${tempParameters}" || exit 1
}

function validate_template {
    log "start validating template..."

    check_resource_group

    az group deployment validate -g "${resourceGroup}" --template-file "${template}" --parameters "${parameters}"

    if [ $? -ne 0 ]; then
        log "Template validation failed.  See error."
        exit 1
    else
        log "template is valid."
    fi
}

function deploy_template {
    if ! $justValidate
    then
        log "Starting to deploying template..."
        az group deployment create -g "${resourceGroup}" --template-file "${template}" --parameters "${tempParameters}"
        log "Finished deploying template"
    fi
}

function generate_ansible_hosts_file {
    log "Generating hosts.ini file for ansible..."
    echo "${buildServerDnsPrefix}.${resourceGroupLocation}.cloudapp.azure.com ansible_connection=ssh ansible_user=${azureVmUsername}" > ansible/hosts.ini || exit 1
    log "Finished generating hosts.ini file with the following entry:"
    log "${buildServerDnsPrefix}.${resourceGroupLocation}.cloudapp.azure.com ansible_connection=ssh ansible_user=${azureVmUsername}"
}

function cleaup_parameters_file {
    log "Cleaning up temporary files"
    rm "${tempParameters}"

    if [ -f "${tempParameters}.original" ]
    then
        rm "${tempParameters}.original"
    fi
}

function provision_build_server {
    log "Sleeping for 60 seconds before provisioning"
    sleep 60
    log "Provisioning build server using Ansible..."
    cd ansible/
    ansible-playbook -vv -i hosts.ini build-server.yml --diff
    cd ..
    log "Finished provisioning build server"
}

while getopts g:s:u:n:v opt; do
    case $opt in
        g)
            resourceGroup=${OPTARG}
            log "resourceGroup --> $resourceGroup"
            ;;
        s)
            storageAccount=${OPTARG}
            log "storageAccount --> $storageAccount"
            ;;
        u)
            azureVmUsername=${OPTARG}
            log "azureVmUsername --> $azureVmUsername"
            ;;
        n)
            buildServerDnsPrefix=${OPTARG}
            log "buildServerDnsPrefix --> $buildServerDnsPrefix"
            ;;
        v) #if true just validate and don't deploy'
            justValidate=true;
            log "validation only set to ${justValidate}"
            ;;
        \?) #invalid option
            log "${OPTARG} is not a valid option"
            usage
            exit 1
            ;;
    esac
done

validate_template
if $justValidate
then
    exit 0
fi
if [ -z "$resourceGroup" ] ;then echo "-g must be provided"; exit 1; fi
if [ -z "$storageAccount" ] ;then echo "-s must be provided"; exit 1; fi
if [ -z "$azureVmUsername" ] ;then echo "-u must be provided"; exit 1; fi
if [ -z "$buildServerDnsPrefix" ] ;then echo "-n must be provided"; exit 1; fi

create_storage_account
deploy_template
generate_ansible_hosts_file
cleaup_parameters_file
provision_build_server
duration=$SECONDS
echo "***** $(($duration / 60)) minutes and $(($duration % 60)) seconds elapsed."

exit 0
