# Setting up your environment

There are multiple options for provisioning a K8S cluster.  For our purposes, we will use ACS as it supports RBAC.  For local development, you can set up Minikube, which provides you a single node K8S cluster.  An alternative is [bootkube](https://github.com/kubernetes-incubator/bootkube/tree/master/hack/multi-node) which provides you a local, multi-node cluster to test multi-node scenarios.  I provide you instructions below to provision an ACS cluster and also setting up Minikube.

You will need the following tools installed:

* [Azure CLI](#markdown-header-installing-azure-cli)
* [docker (only required if you will be building the docker images)](#markdown-header-install-docker)
* [Helm (a package management tool for Kubernetes applications)](#markdown-header-install-helm)
* [kubectl (The kubernetes CLI)](#markdown-header-create-a-k8s-cluster-on-azure-and-install-kubectl)
* [Visual Studio Code](#markdown-header-install-visual-studio-code)
* [Minikube (optional, only if you want to run all the exercises)](#markdown-header-setting-up-minikube)

## Installing Azure CLI

Install the latest version of azure cli for your operating system from [here](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest).

## Install Docker

Install docker for your operating system.

* For [Windows](https://docs.docker.com/docker-for-windows/install/)
* For [macOS](https://docs.docker.com/docker-for-mac/install/)
* For [Ubuntu](https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/#docker-ee-customers)

After you have installed docker and the azure cli, run the following commands to ensure they have been installed.

```sh
az --version
docker version
```
## Install Visual Studio Code

Download and install VS Code for your OS.  [https://code.visualstudio.com/](https://code.visualstudio.com/)

Optionally, install the following extensions (search in the extensions tab):

* Kubernetes (from Microsoft)
* Kubernetes Support (provides snippets for authoring manifests)
* vscode-helm
* Docker

## Verify your Azure subscription ##

Make sure all the required resource providers are registered in your Azure subscription.  As you will be creating network, compute and storage resources on Azure, and you will be using Azure Container Service, you need to ensure you have the following providers registered in your Azure subscription:

* Microsoft.Network
* Microsoft.Storage
* Microsoft.Compute
* Microsoft.ContainerService
* Microsoft.ContainerRegistry (If you will be using Azure Container Registry)

To determine which providers are registered run this command:

```sh
#login to your Azure subscription
az login

#list your registered providers
az provider list -o table | less
```

The registration state of each of the providers above should be 'Registered'.  If not, you need to register the provider using the following command:

```sh
az provider register -n <provider-name>
```

For example,

```sh
az provider register -n Microsoft.ContainerService
```

## Create a K8S cluster on Azure and install kubectl ##

After you have verified your subscription has the necessary providers registered, create a test K8S cluster on Azure. To do so, run the following commands (you already have to be logged into Azure via the CLI). Note, I use the resource group name ``k8s-example`` and cluster name ``test-cluster`` but you can name them what you want.

* Create a resource group for your cluster. Note you have to be logged in via az cli.

```sh
#For region use canadacentral, replace <rg-name> with your desired resource group name
#You will need to use this resource group in later steps
az group create -n <rg-name> -l canadacentral
```

* Create the Kubernetes cluster.  

```sh
#this will create a cluster with 1 master node, 2 worker nodes with Kubernetes version 1.8.1
#replace <cluster-name> with the desired name for your cluster, replace <rg-group> with you resource group name
az acs create -n <cluster-name> -g <rg-name> -t Kubernetes --orchestrator-version 1.8.1 --master-count 1 --agent-count 2 --generate-ssh-keys


#list your AKS cluster
az acs list -o table

#The result will be a table with your ACS cluster name, location, ResourceGroup...
Location       Name         ProvisioningState    ResourceGroup
-------------  -----------  -------------------  --------------
canadacentral  cluster-name  Succeeded            rg-name
```

* Install the kubectl cli, if on linux, or macOS, you may have to run as sudo

```sh
az acs kubernetes install-cli

#Get credentials for your cluster so you can authenticate using kubectl
az acs kubernetes get-credentials -n cluster-name -g rg-name
```

* Verify you can access the cluster

```sh

kubectl get nodes

#you should see something like this
NAME                        STATUS    ROLES     AGE       VERSION
k8s-agentpool0-12035791-0   Ready     agent     1h        v1.8.1
k8s-agentpool0-12035791-1   Ready     agent     1h        v1.8.1
k8s-master-12035791-0       Ready     master    1h        v1.8.1
```

* Start up proxy to tunnel to the Kubernetes Dashboard

```sh
kubectl proxy
```

Open a brower and navigate to ```http://127.0.0.1:8001/ui``` and you will see the dashboard.

## Install Helm

To install helm follow the instruction [here](https://github.com/kubernetes/helm/blob/master/docs/install.md).  Note that to install the server side of Helm (tiller), you need the K8S cluster running.

```sh
helm init --upgrade
```

## Bringing down your cluster

In order to not incur Azure costs, you should tear down your cluster when not in use.  At the end of each day just delete the resource group.

```sh
az group delete -n <rg-name>
```
## Setting up Minikube

This part is only for those of you who want to work on a local cluster with the latest version of Kubernetes.

See the installation instructions for your OS [here](https://github.com/kubernetes/minikube/releases)

*Use v0.25.0 as it supports K8S 1.9*

*Note for Windows, you need to make a decision if you are going to use Hyper-V or Virtualbox for virtualization.  If you have installed Docker with Hyper-V then you have to choose Hyper-V for Minikube also to support both.*

*Note for Linux, if you have enabled Secure Boot in your BIOS, then you need to sign the virtualbox kernel modules. See this [article](https://askubuntu.com/questions/760671/could-not-load-vboxdrv-after-upgrade-to-ubuntu-16-04-and-i-want-to-keep-secur) The easiest is to just disable Secure Boot.*

Once installed, run the following command to start up Minikube.  This will download the latest release of K8S and start a single node cluster locally.

### Enabling RBAC on Minikube

- Start up minikube with the options to enable RBAC on the api-server.

```sh
minikube start --extra-config=apiserver.Authorization.Mode=RBAC

# required to get the kube-dns and dashboard pods to run
# See https://github.com/kubernetes/minikube/issues/1734
kubectl create -f minikube-rbac-privileges.yml
```

To stop minikube and bring down the cluster:

```sh
minikube stop
```

Some useful minikube commands:

```sh
#to get the IP to your minikube master
minikube ip

#to get the URL of a service deployed to minikube
minikube service <service-name>

#to ssh into a pod
minikube ssh <pod-name>

#to delete the local K8S VM
minikube delete
```

## What is AKS, ACS, and ACS Engine?

AKS is a new fully managed service that frees you from worrying about managing the underlying VM, storage, and network resources.  With ACS, you are responsible for patching the OS etc, while with AKS you do not need to worry about these operational tasks.  Eventually, AKS will be replacing ACS.

ACS Engine is an open source project that allows you to customize your K8S deployment on Azure.  It generates the ARM (Azure Resource Manager) templates to provision the virtual machines, the storage, network, and then the K8S cluster.  It is much more flexible in terms of K8S features you can enable.  For example, if you need to enable features such as AdvancedAuditing, then you need to use ACS Engine.  However, you are responsible for maintaining ALL the resources and hence you will need to have the processes and skillset to do so.  In a nutshell, you can think of ACS Engine as *IaaS* and AKS as *PaaS* versions of Kubernetes on Azure.

## Next...

Go to [Exercise 1](./exercise1.md)

## References

* [Kubectl Cheatsheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
* [Kubectl Command Reference](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#-strong-getting-started-strong-)
* [Kubernetes on Azure](https://docs.microsoft.com/en-us/azure/container-service/kubernetes/container-service-intro-kubernetes)
* [Azure Kubernetes Service](https://docs.microsoft.com/en-ca/azure/aks/intro-kubernetes)
* [ACS Engine](https://github.com/Azure/acs-engine)
* [Kubernetes The Hard Way on Azure](https://github.com/ivanfioravanti/kubernetes-the-hard-way-on-azure)