# Exercise 1 #

## Pre-Requisites ##

You should have successfully set up your environment as outlined in [README](./README.md)

## Objective ##

*Note: We are going to cover some advanced topics right away.  We know we have not yet covered these topics but we want you to experience the workflow first then we will dive into the details*

Deploy the Todo Application using helm. We will then do the following:

* list all deployments, services, pods
* Get details of the todo-api pod
* Get shell access to the todo-ui pod
* scale up then scale down the number of todo-api services
* deploy a different version of the todo-api service and do a rolling update

See the [helm/README.md](../../helm/README.md) for instructions on how to deploy the app using helm.

### List all deployments, services, pods ###

Note, when you deployed the todo-app using helm, you did so to a namespace.  You need to run each of the commands below within the context of that namespace.  You do so by passing the `-n <namespace>` option to the commands below.  Another way is to update context to use a default namespace like so:

```sh
#Assume the name of the context is aks-cluster
kubectl config set-context aks-cluster --namespace=todo-app

#Now you can execute the commands without -n <namespace>

```

To list deployments:

```sh
kubectl get deployments
```

To list services:

```sh
kubectl get services
```

To list pods:

```sh
kubectl get pods

#How many pods are running?
```

### Get details of the todo-api pod ###

```sh
#replace <pod_name> with the name of your pod
kubectl describe pod/<pod_name>
```

### Get shell access to the todo-ui pod ###

```sh
#replace <todo-ui-pod-name> with the name of your pod
kubectl exec -it <todo-ui-pod-name> -- /bin/bash
```

### Scale up then scale down the number of Todo API services ###

```sh
#replace <todo-api-deployment> with the name of your deployment obtained from the 'kubectl get deployments'

#scale up to 5 replicas
kubectl scale --replicas=5 deployment/<todo-api-deployment>

#you should see 5 replicas
kubectl get deployment/<todo-api-deployment>

#scale down to 1 replica
kubectl scale --replicas=1 deployment/<todo-api-deployment>

#you should see 1 replica
kubectl get deployment/<todo-api-deployment>
```

### Update the Todo API and do a rolling update ###

Open up two shells.  In the first shell run the following command to update the image for the todo-api to a new version.:

```sh
#replace <todo-api-deployment> with the name of your deployment obtained from the 'kubectl get deployments'

#we are setting the container image for the todo-api container to architechbootcamp/todo-api:1.0.1
#See spec.containers.image field of the deployment manifest
kubectl set image deployment/<todo-api-deployment> todo-api=architechbootcamp/todo-api:1.0.1
```

In the second shell we are going to watch the status of the rollout.

```sh
kubectl rollout status deployment/<todo-api-deployment>
```

Now let's rollback!

```sh
kubectl rollout undo deployment/<todo-api-deployment>
```

### Instructions for Minikube ###

You would need to add ``` --namespace <namespace> ``` to all the kubectl commands to get the expected results

### Next ... ###

[Exercise 2](./exercise2.md)