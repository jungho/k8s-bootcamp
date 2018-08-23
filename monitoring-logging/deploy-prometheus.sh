#!/usr/bin/env bash

#1.  Add the coreos helm repo to get the Prometheus Operator chart
helm repo add coreos https://s3-eu-west-1.amazonaws.com/coreos-charts/stable/

#2. We will deploy everything to the monitoring namespace
kubectl create namespace monitoring

#3 Install the helm chart for the operator
helm install coreos/prometheus-operator --name prometheus-operator --namespace monitoring

#4. Install the actual Prometheus and Grafana pods.
helm install coreos/kube-prometheus --name kube-prometheus --set global.rbacEnable=true --namespace monitoring

#5.  Take a look at what was installed
kubectl get pods -n monitoring
