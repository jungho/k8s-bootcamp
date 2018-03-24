#!/usr/bin/env bash

#create a serviceaccount for tiller
kubectl create serviceaccount tiller --namespace kube-system

#provide the necessary role/role-bindings for tiller
kubectl create -f role-tiller.yaml
kubectl create -f rolebinding-tiller.yaml

#initialize helm in the draft namespace
helm init --upgrade --service-account tiller --wait

#initialize draft in the same namespace
draft init --ingress-enabled 

echo "helm and draft has been initialized"
kubectl get pods -n kube-system
