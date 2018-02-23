# Azure Operations Management Suite for Kubernetes #

Azure OMS is a very powerful tool to provide operational visibility into all your wordloads on Azure.  Whether it is IaaS, PaaS or your Kubernetes cluster, OMS provides a single holistic view of all your mission critical services in one place.  Azure OMS is comprised of multiple services, we will be using Log Analytics in our scenario.

1. [Setup Log Analytics service on Azure through the Azure Portal](https://docs.microsoft.com/en-us/azure/log-analytics/log-analytics-quick-collect-linux-computer)
2. Deploy the OMS agent as a daemonset on your K8S cluster.  See [OMS-Kubernetes](https://github.com/Microsoft/OMS-docker/tree/master/Kubernetes)

The OMS agent will be deployed as a Daemonset onto all nodes - both master and worker nodes.  The Daemonset pulls logs from the `/var/lib/docker/containers` directory on each node.  If your applications log to stdout/stderr (which you should!) then your log message are accessible from `kubectl logs` and also will be logged to this directory.

If you have a legacy application that logs to your own specific directory and it is difficult to change the logging output to stdout/stderr, then the recommended approach is as follows:

- deploy the OMS agent as a [side-car container](http://blog.kubernetes.io/2015/06/the-distributed-system-toolkit-patterns.html) within the your pod
- specify a volume that can be shared between your application container and the oms agent container
- specify a volumeMounts.mountPath for each container so that your application container can write to the logging volume and the OMS agent can read from the logging volume

