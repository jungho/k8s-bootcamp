# Exercise 4 #

## Pre-Requisites ##

You should have successfully set up your environment as outlined in [README](./README.md)

## Objective ##

In this exercise you are going to use Deployments to deploy multiple replicas of a Pod, expose it as a service, then do rolling deployment and rollbacks.

### Create a Deployment and perform rolling updates and rollbacks ###

* Deploy the [pod-detail-service](../../services/pod-details-service.yml)
* Pull one of the pods from the replicaset by changing its label.  Confirm that the deployment creates a another replica.
* Update the image version for the container to **architechbootcamp/pod-details:1.0.1** then immediately check the status of the deployment
* Rollback the deployment to image version **architechbootcamp/pod-details:1.0.0**