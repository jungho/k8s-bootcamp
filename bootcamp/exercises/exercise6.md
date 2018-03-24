# Exercise 6 #

## Pre-Requisites ##

You should have successfully set up your environment as outlined in [README](./README.md)

## Objective ##

In this exercise you will create a configmap then access the configuration from within your pod.

* Create a configmap called app-config using the application.properties in the [configmaps](../../configmaps/application.properties) directory.
* Create a Pod using the busybox image from DockerHub and get shell access HINT: use kubectl exec command.
* Prove that you can read the configuration as environment variables from within the shell

