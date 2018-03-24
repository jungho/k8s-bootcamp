# Troubleshooting #

There absolutely will be times when you deploy an application where things do not go as expected.  Below are some troubleshooting tactics.

```sh

#get the logs for a given pod.  Add --namespace <namespace-name> as appropriate
#First get the pod-name
kubectl get pods --namespace <namespace-name>

#then get the logs for the pod you are interested in
kubectl logs <pod-name>

#If the pod has multiple containers and you want the log for a specific container
kubectl logs <pod-name> -c <container-name>

#Use kubectl describe
kubectl describe <pod-name>

#look at the event stream in another terminal window as you deploy the application
#Each of the controllers will raise events as they take their action
kubectl get events

#access the running pod and verify the process is running
#This assumes that the container has the bash shell, replace with another command as appropriate
kubectl exec -ti <pod-name> -- bash

```

## Exercise Objective ##

Deploy the todo-app helm chart in [todo-app](./todo-app).  There is a small issue with this chart.  It will deploy but the application will fail to run.  Try to find out what the issue is and correct it.

```sh
#first create a namespace to work in
kubectl create namespace troubleshooting

#then create the necessary secrets and namespace for the deployment
./create_secrets trouble-shooting

#deploy the helm chart
helm --namespace trouble-shooting install todo-app

```

## Some more good tips for Azure ##

- [Debugging K8S on Azure](https://github.com/andyzhangx/Demo/blob/master/debug/README.md)
- [K8S Explorer - Very helpful tool that is deployed as a pod to introspect your K8S environment](https://github.com/kubernetes/kubernetes/tree/release-1.5/examples/explorer)
