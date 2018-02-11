#/usr/bin/bash

namespace=ingress-example

kubectl create namespace $namespace
#If you have RBAC enabled on your K8S cluster
#You MUST uncomment the first 2 lines
#kubectl create -f ingress-cluster-role.yml
#kubectl create -f ingress-role-binding.yml --namespace $namespace
kubectl create -f ingress-controller.yml --namespace $namespace
kubectl create -f pod-details-service-v1.yml --namespace $namespace
kubectl create -f pod-details-service-v2.yml --namespace $namespace
kubectl create -f ingress-rule-single-host.yml --namespace $namespace
kubectl create -f ingress-rule-multiple-host.yml --namespace $namespace