# Ingress and Ingress Controllers #

In order to expose your service externally we know that we can use NodePort and LoadBalancer service types.  There is also another means, using a proxy that enable you to specify routing rules to your services.  The Ingress Controller serves as this proxy, and the Ingress are K8S resources that represent the routing rules.  The Ingress Controller queries the API Server for ingress resources and applies the routing rules define in the ingress.  You can view Ingress as the K8S native way of load-balancing and it is the recommended approach to provide load-balanced access to your services.

Why should you use Ingress when there already is the NodePort and Loadbalancer service types?  

1. The loadbalancer type is only supported if the cloud provider supports it.
2. If you create multiple loadbalancer service types, a loadbalancer is provisioned for EACH service.  This can be wasteful.  In contrast, with a single ingress controller, you can route to many services.  
3. You can implement your own ingress controller to implement advanced routing rules.  For example, let's say you wish to implement A/B testing and you want 75% of the traffic to be routed to version A and the remainder to version B, you can do this via Ingress. 

## Example ##

We will deploy two versions of our pod-details api and deploy two different ingress objects - one that routes based on host, and the other by path.  See [./create-ingress-example.sh](create-ingress-example.sh) for how to deploy the example.  Note, depending on whether RBAC is enabled, you will need to update the [./create-ingress-example.sh](create-ingress-example.sh).  See the file for instructions.

You will need to up the following files and update the host field to reflect the IP or hostname of your cluster.

- ingress-rule-multiple-host.yml
- ingress-rule-single-host.yml

```yaml
  #update the IP or replace the entire value to the hostname of your cluster
  - host: v1.192.168.99.100.nip.io
```

*Note:  The nginx ingress controller accesses the API Server to read resources.  Hence, it must be authorized to access the API Server.  

## Reference ##

* [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/)
* [Simplifying advanced networking with Ingress](http://blog.kubernetes.io/2016/03/Kubernetes-1.2-and-simplifying-advanced-networking-with-Ingress.html)
* [nginx Ingress Controller](https://github.com/kubernetes/ingress-nginx)
* [nginx ingress controller examples](https://github.com/kubernetes/ingress-nginx/tree/master/docs/examples)
* [nginx complete example](https://github.com/nginxinc/kubernetes-ingress/tree/master/examples/complete-example)
* [Traefix Ingress Controller](https://docs.traefik.io/user-guide/kubernetes/)
