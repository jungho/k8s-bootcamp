* Deploy the [pod-detail-service](../../services/pod-details-service.yml)

```
kubectl create -f pod-details-service.yml
```

* Pull one of the pods from the replicaset by changing its label.  Confirm that the deployment creates a another replica.

```
#First get the pods to get the generated name for the pods
kubectl get pods

#update the label for one of the pods.
kubect label pod <pod_name> app=somethingelse --overwrite=true

#Get the pods again and show labels.  You will see that the deployment created a new pod instance because one of the pods' label no longer matches app=pod-details
kubectl get pods --show-labels=true
```

* Update the image version for the container to *architechbootcamp/pod-details:1.0.1* then immediately check the status of the deployment

```
#open up two terminal windows
#in the first terminal
kubectl set image deployment/pod-details pod-details=architechbootcamp/pod-details:1.0.1

#in the second terminal
kubectl rollout status deployment/pod-details
```
* Rollback the deployment to image version *architechbootcamp/pod-details:1.0.0*

```
kubectl rollout undo deployment/pod-details
```