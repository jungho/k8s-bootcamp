# Exercise 1 #

## Pre-Requisites ##

You should have successfully set up your environment as outlined in [Day1/setup](./setup.md)

## Objective ##

*Note: We are going to cover some advanced topics right away.  We know we have not yet covered these topics but we want you to experience the workflow first then we will dive into the details*

Deploy the Todo Application. We will then do the following:

* list all deployments, services, pods
* Get details of the todo-api pod
* Get shell access to the todo-ui pod

See the instructions in [todo-app/manual-k8s-deploy/README](../../todo-app/manual-k8s-deploy/README.md) to deploy the todo-app.  After you have deployed the application, do the steps below.

### List all deployments, services, pods ###

Replace <namespace> with your namespace.

To list deployments:

```sh
kubectl get deployments -n <namespace>
```

To list services:

```sh
kubectl get services -n <namespace>
```

To list pods:

```sh
kubectl get pods -n <namespace>

#How many pods are running?
```

### Get details of the todo-api pod ###

```sh
#replace <pod_name> with the name of your pod
kubectl describe pod/<pod_name> -n <namespace>
```

### Get shell access to the todo-ui pod ###

```sh
#replace <todo-ui-pod-name> with the name of your pod
kubectl exec -it <todo-ui-pod-name> -n <namespace> -- /bin/bash
```
### Next ... ###

[Exercise 2](./exercise2.md)
