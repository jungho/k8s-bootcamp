# WARNING! Azure AKS service is still in preview and does not support all the configuration options for K8S #

AKS is not yet GA and therefore, does not yet support all the configuration options available for the master node components such as kube-apiserver.  This means that you will need to accept what configuration options have been enabled and available.  In the future, AKS will provide you with a means to enable configurations supported by the components.  The best place to go to know what features are enabled is the [AKS github repository](https://github.com/Azure/AKS).

This provisioning script is here for future use/reference when Azure AKS becomes generally available and production ready.

## Pre-requisited ##

- The following CLI tools are required:
  - Azure CLI 2.0 (v2.0.21 or greater)
  - `kubectl` (v1.8.4 or greater)#
- AKS preview service needs to be enabled on your Azure subscription with the following command:
  `az provider register -n Microsoft.ContainerService`
- Before executing any commands, you need to be logged in `az login`

## References ##

- [Azure Kubernetes Service](https://docs.microsoft.com/en-ca/azure/aks/intro-kubernetes)