# DaemonSets #

With DaemonSets, K8S will deploy a single instance of your pod to EACH node - note, you can control which nodes the pods are scheduled to using nodeSelectors, affinity, taints/tolerances, however, regardless of which nodes the pod is scheduled to, a single pod will be deployed to a given node. When a new node is added to the cluster, K8S will ensure that a pod is deployed to that node also. When a node is removed from the cluster, K8S will ensure the pod is properly garbage collected.  Therefore, they are similar to deployments in that they provide a controlled means to deploy and shut down your pods across your cluster, with the exception that a single pod will be scheduled per node.  As with deployments you can leverage the ```kubectl rollout status|history|undo...``` commands to manage different revisions of a deployment.

Daemonsets are useful in those scenarios you need a daemon process to run on each node.  For example, a log aggregation daemon such as fluend or logstash.

```sh
#Deploy the nginx daemonset example
kubectl create -f nginx-ds.yaml

#get the pods and see what nodes it has been deployed to
kubectl get pods -o wide

#notice a pod has been deployed to each node
NAME           READY     STATUS    RESTARTS   AGE       IP            NODE
ds-one-kts9s   1/1       Running   0          1m        10.244.0.22   aks-nodepool1-26515506-1
ds-one-l6lbk   1/1       Running   0          1m        10.244.1.16   aks-nodepool1-26515506-0

## Reference ##

* [Kubernetes.io DaemonSets](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/)