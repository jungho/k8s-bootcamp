# Platform Provisioning #

This directory contains scripts for provisioning Platform components

- ACS - provisions Azure Container Service Kubernetes cluster
- AKS - provisions Azure Managed Kubernetes Service cluster
- Azure-Build-Server - provisions an Azure VM with Jenkins/SonarQube/etc.

## Pre-requisites ##

- The following CLI tools are required:
  - Azure CLI 2.0 (v2.0.21 or greater)
  - `kubectl` (v1.8.4 or greater)
- Before executing any commands, you need to be logged in `az login`

## Pre-requisites for AKS cluster (In Preview so it might be unstable) ##

- AKS preview service needs to be enabled on your Azure subscription with the following command:
  `az provider register -n Microsoft.ContainerService`
- Before executing any commands, you need to be logged in `az login`

## Reference ##

- [Kubernetes the Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way)
- [Kubespray - Ansible Playbooks to install and configure Kubernetes](https://github.com/kubernetes-incubator/kubespray)
