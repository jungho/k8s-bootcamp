# Azure Operations Management Suite for Kubernetes #

Azure OMS is a very powerful tool to provide operational visibility into all your wordloads on Azure.  Whether it is IaaS, PaaS or your Kubernetes cluster, OMS provides a single holistic view of all your mission critical services in one place.  Azure OMS is comprised of multiple services, we will be using Log Analytics in our scenario.

The OMS agent will be deployed as a Daemonset onto all nodes - both master and worker nodes.  The Daemonset pulls logs from the `/var/lib/docker/containers` directory on each node.  If your applications log to stdout/stderr (which you should!) then your log message are accessible from `kubectl logs` and also will be logged to this directory.

Prior to executing the steps below, create a Log Analytics service in Azure Portal following the instructions [here](https://docs.microsoft.com/en-us/azure/log-analytics/log-analytics-quick-collect-linux-computer).  You will need your OMS Workspace ID and Private Key.  You can get this from Log Analytics-->Advanced Settings.

```sh
#from within the oms directory execute this script below.  It will ask you for the OMS workspace ID and key.
./secret-gen.sh

#the script will generate the omsagentsecret.yaml file.  Create the secret on your cluster usin this manifest.
kubectl create -f omsagentsecret.yaml

#Now you can deploy the OMS agent.
kubectl create -f omsagent-ds-secrets.yaml

#check the status of the pods
kubectl get pods -o wide

#Notice it has been deployed to each of the nodes.
NAME             READY     STATUS    RESTARTS   AGE       IP           NODE
omsagent-smsff   1/1       Running   0          1m        10.244.0.7   aks-nodepool1-30106593-1
omsagent-zfdf4   1/1       Running   0          1m        10.244.1.3   aks-nodepool1-30106593-0
```

If you have a legacy application that logs to your own specific directory and it is difficult or not possible to change the logging output to stdout/stderr, then one potential solution is as follows:

- deploy the OMS agent as a [side-car container](http://blog.kubernetes.io/2015/06/the-distributed-system-toolkit-patterns.html) within the your pod
- specify a volume that can be shared between your application container and the oms agent container
- specify a volumeMounts.mountPath for each container so that your application container can write to the logging volume and the OMS agent can read from the logging volume

## Reference ##

- [OMS-Kubernetes](https://github.com/Microsoft/OMS-docker/tree/master/Kubernetes) 

