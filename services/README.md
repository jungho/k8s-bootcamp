# Services #

Pods are ephemeral entities that will be dynamically scheduled by the scheduler.  Although they are assigned an IP, it cannot be relied upon to be stable.  Furthermore, you will often want multiple replicas of a given pod depending on your scaling needs.  So how are consumers of your pods to access them?  This is the problem that services are designed to solve.

Services abstracts away access to your pod(s).  A service receives a stable virtual IP, and routes requests to pods that it cares about.  It cares about those **pods that have labels that match the label selector defined in the service specification** - labels and label selectors play a big role in K8S and contributes to its highly dynamic nature.

See an excellent overview of how service discovery is implemented as well as the role kube-proxy plays [here](https://kubernetes.io/docs/concepts/services-networking/service/#the-gory-details-of-virtual-ips). Kubernetes supports userspace, iptables and ipvs (alpha) strategies to enable request routing to the pod endpoints.

* See [pod-details-service](./pod-details-service.yaml) that shows a service that routes to 5 instances of a pod.

When you use services, you need to decide if they need to be exposed only internal to your K8S cluster or externally to clients outside your cluster (e.g. mobile apps).  In general, you should only publish services that need to be published to reduce coupling and security exposure.  How you define the way your services are exposed is through the service type.

* ClusterIP - exposed only internally.  This is the default.
* LoadBalancer - exposed externally using a load balancer provisioned by the cloud provider
* NodePort - exposed externally.  All requests to a specific port on one of your worker nodes will be routed to the service.  You would use this type when you want to provision your own load balancer.
* ExternalName - See below.
* Headless Services - See below.

## Services without label selectors ##

Services are also helpful to serve as an abstraction to external services. Say a pod in your cluster need to access a database service that is external to your cluster.  For example, you have an existing production database on-premises.  Instead of codifying the endpoint details in code, you can create a service that exposes that external service to the pods within your cluster.  Your pods then look up the service just like any other service.  This is accomplished using services that do not have label selectors. This is very helpful because you can have a separate database for production and QA but within your application code, you would still use the same service name.

* See [external-name-service](./external-name-service.yaml) that provides access to an external REST API as service within K8S.

## Headless Services ##

Headless services are those that do not receive a stable virtual IP.  You want this in scenarios where you want the underlying pod IPs directly because you don't want load-balancing.  For example, you want to know the IP of the master vs the slave nodes in a MySQL cluster.

* See [headless-service](./headless-service.yaml) for an example.

## Reference ##

* [Services docs at k8s.io](https://kubernetes.io/docs/concepts/services-networking/service/)
* [Service Tutorial at k8s.io](https://kubernetes.io/docs/tasks/access-application-cluster/service-access-application-cluster/)
* [Understanding Kubernetes Networking - Excellent articles by Mark Betz](https://medium.com/google-cloud/understanding-kubernetes-networking-pods-7117dd28727)