# Monitoring and Log Aggregation #

Monitoring and Log Aggregation, and the ability to visualize and analyze system data to respond quickly to issues is critical to system health and uptime.  There are many, many tools to help you with this in K8S. Here we will deploy two sets of tools that serves related but different purposes. 

- Prometheus + Grafana for metrics capture, alerting, visualization and analysis
- Elasticsearch, Fluentd, Kibana (EFK)** for log aggregation, indexing, search, visualization and analysis

The first deals with metrics e.g. cpu, memory, storage, requests per sec, really anything that can be captured as an numerical value over a period of time.

The second deals with your application and server logs, so we are dealing with textual data that needs to be indexed, analyzed and searchable.

** Another common stack is ELK (Elasticsearch, Logstash, Kibana)

## Operators ##

We will be deploying the monitoring and logging stacks using [Operators](https://coreos.com/blog/introducing-operators.html).  Operators were defined by the [CoreOS](https://coreos.com/) team and they are essentially [Custom Resource Definitions](https://kubernetes.io/docs/concepts/api-extension/custom-resources/) and controllers to deploy and manage applications using K8S native approaches while encapsulating domain specific knowledge in CRDs. Custom Resource Defintions are a means for you to define your own resources in K8S and extend the API server recognize your resources!  Your controller then would watch the CRDs and take appropriate action.  Pretty cool yes??  Operators are a excellent example of how to leverage CRDs!!

## References ##

- [Elasticsearch Operator](https://github.com/upmc-enterprises/elasticsearch-operator)
- [Prometheus Operator](https://github.com/coreos/prometheus-operator/)
- [Awesome Kubernetes Extensions](https://github.com/coreos/awesome-kubernetes-extensions)