## Deployment script for Jenkins/Sonar build server VM ##

This script provisions a VM in Azure and sets up Jenkins/Sonar server on it with plugins installed and Azure Kubernetes cluster access configured

## Pre-requisited ##

- The following CLI tools are required:
  - `az` - Azure CLI 2.0 tool (v2.0.21 or later)
  - `ansible-playbook` - Ansible Playbook tool (v2.4.2.0 or later)
- Before executing any commands, you need to be logged in with `az login`

## Get Started ##

To deploy and provision the Jenkins/Sonar server, run the following command:

`./deploy-build-server.sh -g <resourceGroup> -s <storageAccountName> -u <azureVmUsername> -n <buildServerDnsPrefix>`

- `resourceGroup` - Resource Group in which the VM will be deployed
- `storageAccountName` - Name of the Storage account for the VM (Must be globally unique on entire Azure)
- `azureVmUsername` - Admin username for the VM
- `buildServerDnsPrefix` - Globally unique DNS name for the VM (i.e. `<buildServerDnsPrefix>.eastus.cloudapp.azure.com`)

## Explanation ##

This script performs the following steps:

1. Check if Resource Group exists in the subscription.
    1. If yes, you can choose to deploy to the existing Resource Group
    2. If no, creates a new Resource Group with the name specified in command line

2. If `-v` parameter is passed, it will only validate that the ARM template syntax is correct.
3. Check if the Storage account already exists in the subscription
    1. If yes, you can choose to deploy on the existing Storage account
    2. If no, creates a new Storage account with the name specifiec in command line

4. Check if default SSH public key () exists and asks if you wish to upload it to the VM for SSH access
    1. If yes, uploads the public SSH key
    2. If no, it checks if there is a public ssh key `keys/id_rsa.pub` in `keys` folder

5. Deploys the ARM template (this will take a while)
6. Generates Ansible hosts file based on the parameters of the ARM template
7. Installs and sets up Jenkins/Sonar on the VM using Ansible playbook and roles in `ansible` folder

## Additonal Steps for Configuring Jenkins ##

- Add git credentials `docker-hub-credentials` and `prod-docker-hub-credentials`
