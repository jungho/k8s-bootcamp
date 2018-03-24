# Statefulsets #

Statefulsets are similar to Deployments in that they enable you to define a pod template and specify the number of replicas for that pod.  They differ in that statefulsets provide capabilities that are beneficial for stateful applications that require:

* Unique Network Identities (one instance can be identified from another e.g. primary/standby)
* Ordering of deployment (one instance should be deployed before others)
* Ordering of termination (one instance should be terminated before others)
* Unique persistence stores per pod in the statefulset

For example, certain databases, you need to access a specific node in the cluster and failover to a standby only when needed, hence, network identity is required.  In Kubernetes, the master node need to be up and available before the worker nodes can join the cluster, hence, ordering of deployment is required.

When you have such requirements, then statefulsets are the way to go.  If you do not have such requirements, then Deployments with Persistent Volumes may be all you need.

*Note: prior to 1.9 statefulsets are still Beta*

The points to understand is the use of a headless service (a service with ClusterIP set to none), and the `volumeClaimTemplates` section of the manifest. Each pod in the statefulset will have a unique name based on an ordinal, likewise, each persistent volume claim will have a unique name based on an ordinal.  This ensures that each pod will have a different storage bound to the pod and this binding will remain the same even if the pod is rescheduled.

```sh
#to deploy the mongo statefulset example
#you must create the service first as the statefulset has a field called serviceName that must match
#the name of the headless service.
kubectl create -f mongo-service.yaml
kubectl create -f mongo-statefulset.yaml

#Note this example requires that you have default storageclass defined for your cluster
kubectl get storageclasses

#On my minikube this is what is displayed
#NAME                 PROVISIONER
#standard (default)   k8s.io/minikube-hostpath

#On ACS this is what is displayed
#NAME                PROVISIONER
#azurefile           kubernetes.io/azure-file
#default (default)   kubernetes.io/azure-disk
#managed-premium     kubernetes.io/azure-disk
#managed-standard    kubernetes.io/azure-disk

#also note that depending on the version of the K8S cluster, you need to specify
#different apiVersion values for StatefulSet
#See mongo-statefulset.yaml

#once you have created the statefulset run: (note it may take a few minutes)
kubectl get pods 

#Notice each pod has a unique id
NAME      READY     STATUS    RESTARTS   AGE       IP           NODE
mongo-0   1/1       Running   0          10m       10.244.0.5   aks-nodepool1-35954213-1
mongo-1   1/1       Running   0          6m        10.244.1.5   aks-nodepool1-35954213-0
mongo-2   1/1       Running   0          2m        10.244.0.6   aks-nodepool1-35954213-1

#Get the persistent volume claims that are bound to each pod
kubectl get pvc

#Notice each pvc has a unique name and is bound to its own volume
NAME           STATUS    VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
data-mongo-0   Bound     pvc-0ed0af30-2303-11e8-9d47-0a58ac1f0ee9   10Gi       RWO            default        11m
data-mongo-1   Bound     pvc-9d944eab-2303-11e8-9d47-0a58ac1f0ee9   10Gi       RWO            default        7m
data-mongo-2   Bound     pvc-2b243b4f-2304-11e8-9d47-0a58ac1f0ee9   10Gi       RWO            default        3m
```

## Headless Services ##

A headless service is a service with the ClusterIP field set to None.  This results in no stable IP being created for the service.  Instead, K8S creates SRV records to point to the pods backing the headless service. Why is this required?  Remember the key aspect of statefulsets is *identity*, the pods in the stateful are not the same, therefore, you need to know which pod you are connecting to.  For example, in mysql, there would be a single master (that read/write to) and multiple slaves (that you only read from).  To see this, run the example below.

```sh
#run a busybox pod in the same namespace then run nslookup within that pod to see what gets returned
kubectl run busybox --image busybox -- sleep 50000

#get the name of the busybox pod that is deployed...
kubectl get pods 

#get shell access and run nslookup.  Notice, you get 3 addresses returned
#and the FQDN is podname.servicename.namespace.svc.cluster.local
kubectl exec -it busybox-pod-name -- sh

$ nslookup mongo
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      mongo
Address 1: 10.244.0.5 mongo-0.mongo.default.svc.cluster.local
Address 2: 10.244.0.6 mongo-2.mongo.default.svc.cluster.local
Address 3: 10.244.1.5 mongo-1.mongo.default.svc.cluster.local
```

## References ##

- [Statefulsets](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)
- [Stateful containerized applications with Kubernetes by Josh Berkus](https://opensource.com/article/17/2/stateful-applications)