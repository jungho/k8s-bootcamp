## Deployment script for Azure Container Services Kubernetes cluster ##

This script provisions a Kubernetes cluster on Azure using ACS

## Pre-requisites ##

- The following CLI tools are required:
  - `az` - Azure CLI 2.0 tool (v2.0.21 or greater)
  - `kubectl` - Kubernetes cluster command tool (v1.8.4 or greater)
- Before executing any commands, you need to be logged in with `az login`

## Get Started ##

To deploy a Kubernetes cluster run the following command:

*NOTE: `-n <Number-of-Nodes>` is optional and defaults to 3 nodes.

`./deploy-acs-cluster.sh -g <Resource-Group-Name> -c <Cluster-Name> -n <Number-of-Nodes>`

This deploys a cluster with 1 master node and 3 agent nodes.

## Explanation ##

This script performs the following steps:

1. Check if Resource Group exists in the subscription.
    1. If yes, you can choose to deploy to the existing Resource Group
    2. If no, creates a new Resource Group with the name specified in command line

**NOTE: Currently, the script only deploys to `East US` location

2. Creates Service Principal with `Contributor` role in your subscription so that the ACS service can create resources on your Azure subscription (such as, VMs, Load Balancers, IP addresses, etc.)

3. Waits 1 minute due to an issue where trying to use the recently created Service Principal causes the creation of the Kubernetes cluster to fail. Likely due to some internal delay in Azure with propagation of the newly created permissions.

4. Creates a Kubernetes cluster with the specified name, number of agents, in the Resource Group's region, and uploads the local SSH public key (`~/.ssh/id_rsa.pub`) to the cluster for access to the cluster.

5. Retrieves the Kubernetes cluster credentials using the local SSH private key (`~/.ssh/id_rsa`) and:
    1. Merges the credentials to the default Kubernetes config file (`~/.kube/config`) in order for the local `kubectl` command to have access
    2. Exports the same credentials into a separate file that is later uploaded to the Jenkins server for cluster access
