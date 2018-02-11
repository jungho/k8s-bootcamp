#!/usr/bin/env bash

###################################################################################################
# Script Name: deploy-aks-cluster.sh
# Author: Igor Ljaskevic
# Description: Deploys Azure Managed Kubernetes Cluster (AKS)
#
# NOTE: Beware!Azure AKS is still in Preview!
#
# Options:
#
# -g <resourceGroup>
# -c <clusterName>
# -n <nodeNumber>
#
#######################################################################################################
SECONDS=0

resourceGroup=''
clusterName=''
nodeNumber=''
## Currently, AKS is only available in 'eastus,westeurope,centralus' regions
resourceGroupLocation='eastus'

function log {
    echo "deploy-cluster.sh --> $*"
}

function usage {
    log "To create cluster:  ./deploy-cluster.sh -g <resourceGroup> -c <clusterName> -n <nodeNumber>"
}

function check_resource_group {
    rgExists="$(az group list -o table | awk '{ print $1;}' | grep -x ${resourceGroup})"
    if [[ !  -z  $rgExists  ]]
    then
        log "Resource group '${resourceGroup}' already exists"
        az group show -n "${resourceGroup}"
        read -r -p "Do you wish to deploy to this resource group? [y/N] " response
        if [[ "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]
        then
            log "Deploying to '${resourceGroup}' resource group"
        else
            exit 1
        fi
    else
        log "Resource group '${resourceGroup}' not found"
        log "Creating new resource group called '${resourceGroup}' in '${resourceGroupLocation}' region (default: 'East US')"
        az group create -n "${resourceGroup}" -l "${resourceGroupLocation}" || exit 1
    fi


    log "Getting location of Resource Group - ${resourceGroup}"
    resourceGroupLocation="$(az group show -n ${resourceGroup} -o table | awk ' /'${resourceGroup}'/ {print $1} ')"
    log "Found resource group location = ${resourceGroupLocation}"
}

function create_cluster {
  az aks create -g "${resourceGroup}" -n "${clusterName}" -c "${nodeNumber}" -k "1.8.1" -l "${resourceGroupLocation}" --generate-ssh-keys
}

function get_cluster_credentials {
  az aks get-credentials --resource-group="${resourceGroup}" --name="${clusterName}"
}

while getopts g:c:n:v opt; do
    case $opt in
        g)
            resourceGroup=${OPTARG}
            log "resourceGroup --> $resourceGroup"
            ;;
        c)
            clusterName=${OPTARG}
            log "clusterName --> $clusterName"
            ;;
        n)
            nodeNumber=${OPTARG}
            log "nodeNumber --> $nodeNumber"
            ;;
        \?) #invalid option
            log "${OPTARG} is not a valid option"
            usage
            exit 1
            ;;
    esac
done

if [ -z "$resourceGroup" ] ;then echo "-g (Resource Group Name) must be provided"; exit 1; fi
if [ -z "$clusterName" ] ;then echo "-c (Cluster Name) must be provided"; exit 1; fi
if [ -z "$nodeNumber" ] ;then echo "-n (Node Number) must be provided"; exit 1; fi

read -r -p "BEWARE! Azure AKS is still in Preview and may be unstable. Do you wish to proceed? [y/N] " response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]
then
    log "Deploying Azure AKS cluster..."
else
    exit 1
fi

check_resource_group
create_cluster
get_cluster_credentials

duration=$SECONDS
echo "***** $(($duration / 60)) minutes and $(($duration % 60)) seconds elapsed."

exit 0
