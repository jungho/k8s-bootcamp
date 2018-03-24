# Cluster Administration

Here we will cover some fundamental cluster administration considerations on Azure.  We will focus on Azure specific concerns and leave the more general overview to the [excellent docs](https://kubernetes.io/docs/tasks/) at K8S.io. 

- [Resource Quotas](#markdown-header-resource-quotas)
- [Limit Ranges](#markdown-header-limit-ranges)
- [Container Network Interface](#markdown-header-container-network-interface)
- [Upgrading the Cluster](#markdown-header-upgrading-the-cluster)
- [Backup And Disaster Recovery](#markdown-header-backup-and-disaster-recovery)

## Resource Quotas

[ResourceQuotas](https://kubernetes.io/docs/concepts/policy/resource-quotas/) are a means for the cluster admin to contrain how much resources (cpu/memory/storage) are consumed by pods, in AGGREGATE, within a given namespace.  Here is an example RC for cpu/memory:

```yaml
#Resource quota
apiVersion: v1
kind: ResourceQuota
metadata:
  name: mem-cpu-demo
spec:
  #note, there is no 'soft'
  hard:
# See https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/
# for explanation of the units used for cpu/memory.  A more detailed explanation is here:  
# https://blog.digilentinc.com/mib-vs-mb-whats-the-difference/  
    requests.cpu: "1"
    requests.memory: 1Gi
    limits.cpu: "2"
    limits.memory: 2Gi
```

Here is an example RC for storage:

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: storagequota
spec:
  hard:
   #The max number of PVC that can be created
    persistentvolumeclaims: "5"
    #The max storage that can be consumed
    limits.storage: "5Gi"
```

For storage, you can specify the following:

- How many PVCs are created
- How much storage is consumed across all PVCs
- How much storage of a given storage class is consumed
- The much ephermeral storage can be requested and consumed.  

ResourceQuotas will only measure usage for a resource that matches the scope specified by the cluster admin.  If a scope is not defined, all resources are in scope.  See [Quota Scopes](https://kubernetes.io/docs/concepts/policy/resource-quotas/)

To verify if ResourceQuotas have been enabled on your cluster, run:

```sh
kubectl get resourcequotas

#You should get a response similar to this:
No resources found.
```

## Limit Ranges

LimitRanges are resources that provide cluster admins a means to contrain how much resources are consumed by a GIVEN pod within a given namespace. They differ from ResourceQuotas which contrains the aggregate resource consumption by all pods in the given namespace.  For cpu and memory resources, you can do the following:

- Set the default cpu/memory/storage request/limits for pods.  If the pod does not specify limits/requests, and LimitRanges are defined, the LimitRange Admission Controller sets the defaults.  See [default-cpu-memory.yaml](./default-cpu-memory.yaml)
- Set the min/max range that can be consumed by a pod. See [min-max-cpu-memory.yaml](./min-max-cpu-memory.yaml)

For storage resources, you can specify:

- The min/max storage that can be requested in a PersistentVolumeClaim. See [min-max-storage.yaml](./min-max-storage.yaml)

See the following references for more details:
- [Memory](https://kubernetes.io/docs/tasks/administer-cluster/memory-default-namespace/)
- [CPU](https://kubernetes.io/docs/tasks/administer-cluster/cpu-default-namespace/) 
- [Storage](https://kubernetes.io/docs/tasks/administer-cluster/limit-storage-consumption/)

## Container Network Interface 

CNI is the network plugin model used by Kubernetes to abstract away the underlying pod network implementation.  Usually, you do not need to be aware of CNI unless you wish to enable [network policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/). 

Network policies enable you to specify how a group of pods communicate with each other.  For example, let's say you want to ensure pods can only communicate with other pods in the same namespace, you can achieve this with network policies.

To enable network policies, you need to enable CNI on the cluster.  This is done by passing the `--network-plugin=cni` option to the kubelets.  Note, this is done by default on AKS, ACS and ACS Engine.

**Note, not all CNI plugins support network policies.**

See [installing addons](https://kubernetes.io/docs/concepts/cluster-administration/addons/) for instructions for different CNI plugins. Please note, depending on your K8S deployment, not all CNI plugins will be supported. AKS supports CNI but only the azure-cni plugin for now.  For acs-engine, see [CNI support on Azure](https://github.com/Azure/acs-engine/tree/master/examples/networkpolicy).  On ACS engine, only calico supports network policies.  See the [security](../security/README.md) section for an example of network policies.

## Upgrading the Cluster

The steps to upgrade your cluster depends on how it was deployed.  If you are on AKS, then the az cli has a command that will upgrade the cluster `az aks upgrade`.  Just provide the name of your current cluster, the K8S version to upgrade to.  Note, your cluster will be unavailable during an upgrade.

If you deployed using ACS Engine, then you would upgrade using the command `acs-engine upgrade`.  See details [here](https://github.com/Azure/acs-engine/tree/master/examples/k8s-upgrade)

If you are on ACS then you will have to upgrade manually - or use a configuration management tool.  ACS uses `hyperkube` (an all-in-one binary of K8S components) to bootstrap the cluster, so you will need to upgrade the hyperkube images on all the nodes and then the manifests to reflect the new version.  The manifests are located in `/etc/kubernetes/manifests/` directory of the master nodes.

For clusters that were deployed using `kubeadm` then follow these [instructions](https://kubernetes.io/docs/tasks/administer-cluster/kubeadm-upgrade-1-8/).  

If your cluster is based on [CoreOS Tectonic](https://coreos.com/tectonic/) or [Rancher](http://rancher.com/kubernetes/), then look at the docs for those distributions.

## Backup And Disaster Recovery

At any point, you need to be able to re-create your environment to a well-known state.  There are 4 key areas of focus:
1. The infrastructure.  Whether deployed to the cloud or on-premise, you should have fully automated scripts to be able re-provision the environment including network, compute, storage resources, identity etc.
2. The K8S cluster configuration.  This also should be automated and the provisioning approach you use should take this into account.
3. The data.  The cluster configuration is stored in etcd and any persistent volumes.  This data needs to be backedup on a scheduled basis.  There should be a process and scripts to restore the etc cluster from the snapshot.  
4. The application containers that are deployed to kubernetes.  This is the easiest part as your containers will be in a container registry and the desired state is in etcd.

There are multiple means to achieve this, from custom scripting to using available products.  If you are deploying to Azure, GCP, AWS or on-premise, you can use [Heptio Ark](https://heptio.com/products/#heptio-ark) for steps 2, 3, 4.
