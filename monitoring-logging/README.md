# Monitoring and Log Aggregation

Monitoring and Log Aggregation, and the ability to visualize and analyze system data to reduce mean time to recover is critical to business operations.  There are many, many tools to help you with this in K8S and very likely the tools that you use today is fully supported.

For instructions on how to monitor your K8S cluster using Azure OMS, see [Monitoring and Log aggregation with OMS](./oms/installing_oms.md).

For instructions on how to use well established open-source tools that require a bit more set up, see below.

Here we will deploy two sets of tools that serves related but different purposes.

- Prometheus + Grafana for metrics capture, alerting, visualization and analysis
- Elasticsearch, Fluentd, Kibana (EFK)** for log aggregation, indexing, search, visualization and analysis

The first deals with metrics e.g. cpu, memory, storage, requests per sec, really anything that can be captured as an numerical value over a period of time.

The second deals with your application and server logs, so we are dealing with textual data that needs to be indexed, analyzed and searchable.

** Another common stack is ELK (Elasticsearch, Logstash, Kibana)

## Operators

We will be deploying the monitoring and logging stacks using [Operators](https://coreos.com/blog/introducing-operators.html).  Operators were defined by the [CoreOS](https://coreos.com/) team and they are essentially [Custom Resource Definitions](https://kubernetes.io/docs/concepts/api-extension/custom-resources/) and controllers to deploy and manage applications using K8S native approaches while encapsulating domain specific knowledge in CRDs.

Custom Resource Defintions are a means for you to define your own resources in K8S and extend the API server recognize your resources!  Your controller then would watch the CRDs and take appropriate action.  Pretty cool yes??  Operators are a excellent example of how to leverage CRDs!!

### Prometheus Operator

We will be using the helm chart published by CoreOS to deploy the operator.  CoreOS provides excellent docs [here](https://coreos.com/operators/prometheus/docs/latest/user-guides/getting-started.html).

**You must have RBAC enabled on your cluster to deploy these Operators.  I will be using Minikube with RBAC enabled.**

```sh
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

#6.  Port-forward to the Grafana dashboard
kubectl port-forward $(kubectl get  pods --selector=app=kube-prometheus-grafana -n  monitoring --output=jsonpath="{.items..metadata.name}") -n monitoring  3000

#7.  Open up a brower to http://localhost:3000 and you will see the Grafana dashboard.

```

### Elasticsearch + Kibana Operator

This is simple deployment of Elasticsearch and Kibana to K8S.  You still have to deploy either fluentd or Logstash or FileBeats onto the nodes to extract the log files and forward to Elasticsearch.  Note, as Elasticsearch is quite resource intensive, it is highly recommended that you have dedicated nodes for ES.  You can do this by applying taints and tolerations to ensure only ES pods get scheduled to these nodes.  Filebeats or Fluentd then needs to be deployed as daemonsets onto the nodes from which you want to pull the log files.

## References

- [Elasticsearch Operator](https://github.com/upmc-enterprises/elasticsearch-operator)
- [Prometheus Operator](https://github.com/coreos/prometheus-operator/)
- [kube-prometheus - Provides manifests and leverages Prometheus Operator to provide monitoring of the K8S cluster and applications](https://github.com/coreos/prometheus-operator/tree/master/contrib/kube-prometheus)
- [Awesome Kubernetes Extensions](https://github.com/coreos/awesome-kubernetes-extensions)
- [ELK on Azure Container Service](https://github.com/Microsoft/elk-acs-kubernetes)