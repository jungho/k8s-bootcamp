# Exercise 3 #

## Pre-Requisites ##

You should have successfully set up your environment as outlined in [README](./README.md)

## Objective ##

In this exercise you are going to be deploy a pod and expose it as a service.

### Deploy a Pod and expose it as a LoadBalanced Service in ACS ###

* Create a docker image with contains simple HTTP service that returns a random number and today's date.  You can use any technology you wish.
* Tag the image and push it to DockerHub or Azure Container Service
* Deploy to K8S and test through a browser or curl

### Deploy a Pod that access an external service ###

* Create a docker image that contains a service that integrates with the following stock quote API - https://api.iextrading.com/1.0/stock/aapl/quote.  You can use any technology you wish.
* Tag the image and push it to DockerHub or Azure Container Service
* Deploy to K8S and test through a browser or curl
* Bonus: Implement your service so that you can pass any stock symbol as query string parameter.