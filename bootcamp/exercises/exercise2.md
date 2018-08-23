# Exercise 2 #

## Pre-Requisites ##

You should have successfully set up your environment as outlined in [Day1/setup](./README.md)

## Objective ##

In this exercise you are going to be defining pod manifests and configuring the pod with probe, resource limits/requests, and QoS.  If you are really stuck, see [solutions](./solutions/exercise2/).

### Create and deploy pod that contains a single container ###

Use the busybox image from [DockerHub](https://hub.docker.com/_/busybox/).

* Create a pod definition and deploy the pod using kubectl.
* Get details of the pod using kubectl
* Attach to the running pod and run some shell commands
* Delete the pod using kubectl

### Create and deploy a pod with liveness probes and QoS ###

* Use the nginx image from Dropbox.
* The liveness probe path should be '/'.
* Configure the probe to wait 5 seconds prior to the first probe.
* Configure the probe to check every 10 seconds
* Configure the probe to restart the pod after 3 failures
* Configure the pod to have the Burstable QoS

### Next... ###

[Exercise 3](./exercise3.md)
