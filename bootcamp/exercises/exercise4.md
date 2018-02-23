# Exercise 4 #

## Pre-Requisites ##

You should have successfully set up your environment as outlined in [README](./README.md), you done [exercise1](./exercise1.md)

## Objective ##

In this exercise you are going to use the todo-app that you deployed in exercise 1 to scale out/in the pods, then do rolling deployment and rollbacks.

### Scale up then scale down the number of Todo API services ###

```sh
#scale up to 5 replicas
kubectl scale --replicas=5 deployment/todo-api -n <namespace>

#you should see 5 replicas
kubectl get deployment/todo-api -n <namespace>

#scale down to 1 replica
kubectl scale --replicas=1 deployment/todo-api -n <namespace>

#you should see 1 replica
kubectl get deployment/todo-api -n <namespace>
```

### Update the Todo API and do a rolling update ###

Open up two shells.  In the first shell run the following command to update the image for the todo-api to a new version.:

```sh
#we are setting the container image for the todo-api container to architechbootcamp/todo-api:1.0.1
#See spec.containers.image field of the deployment manifest
kubectl set image deployment/todo-ui todo-api=architechbootcamp/todo-ui:1.0.2
```

In the second shell we are going to watch the status of the rollout.

```sh
kubectl rollout status deployment/todo-ui -n <namespace>
```

Now let's rollback!

```sh
kubectl rollout undo deployment/todo-ui -n <namespace>
```

### Next... ###

[Exercise 5](./exercise5.md)
