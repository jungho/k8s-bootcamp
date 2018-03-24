# Extending Kubernetes #

Kubernetes is highly extensible, and it provides well-defined extension points. Not only can you swap out the core components with your own implementations, you can build on top of the existing components to add additional capabilities to your cluster.  The community is already leveraging these capabilities to build resuable components on top of Kubernetes.  For a good example, see [Operators](https://coreos.com/operators/). All extension points are covered [here](https://kubernetes.io/docs/concepts/overview/extending/), and we will cover the following three:

- [Custom Resource Definitions](#markdown-header-custom-resource-definitions)
- [API Aggregation](#markdown-header-api-aggregation-advanced)
- [Service Catalog](#markdown-service-catalog) 

The first two extension points enable you to extend K8S with new resource types and components that act on those resources types.  This enables you to create higher levels of abstraction on top of native Kubernetes primitives.  For example, you could create a `MySQLDatabase` resource to simplify the deployment of an HA MySQL cluster on Kubernetes.  You would then create a custom controller that would watch for these resources and programmatically create/update/delete K8S Statefulsets, PersistentVolumes, etc to deploy the MySQL cluster.  The resources you can create is only limited by your imagination!  

At a high-level, how the two approaches differ is on along the axes of simplicity and flexibility.  The CRD approach is simpler but less flexible, the Aggregated API approach is more complicated but more flexible.  See the differences [here](https://www.openservicebrokerapi.org/).  

Service Catalog enables you to expose external services, including provisioning and binding to those external services via the [Open Service Broker API](https://www.openservicebrokerapi.org/).   For example, let's say you want to provision and bind to the Azure CosmosDB database service in a declarative manner?  You can do so through Service Catalog.

## Custom Resource Definitions

Custom Resource Definitions is the simpler approach to introduce new resources to K8S.  As of version 1.8, you can specify a validation schema in your CRD and have the kube-apiserver validate instances of your resource that is submitted to by clients.  

**Note, custom resource validation is alpha in v1.8 and needs to be [enabled](https://kubernetes.io/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/)** 

**Note, when you look at documentation, you may come across "Third Party Resources".  CRDs are replacement for TPRs as of version 1.7.**

To check if CRDs are supported on your cluster, run the following command.

```sh
kubectl get customresourcedefinitions

#you should see something like this
No resources found.
```

### Example 

To demonstrate the process of creating a CRD, I am going to use the simple but excellent example from the book [Kubernetes in Action](https://www.manning.com/books/kubernetes-in-action) by Manning.

**Note, this is an EXCELLENT book on Kubernetes and I highly recommend you read it!**

The scenario is as follows:

We want to create a new resource called `WebSite`.  When we create this resource, a new WebSite based on the source code located at the specified git repo will be deployed and exposed in Kubernetes.  This will require a Deployment and Service resources to be created.

1. First step is to define our Website CustomResource.  You do so by creating a CustomResourceDefinition resource. 

```sh

#We have a CRD defined in Website-crd.yaml, create it like any other resource
kubectl create -f website-crd.yaml

#Verify it has been created
kubectl get customresourcedefinitions

NAME                              AGE
websites.extensions.example.com   16s

```

2. Now that the CRD has been created, create an instance of our Website resource.

```sh
kubectl create -f website.yaml

#Verify it has been created
kubectl get ws

NAME      AGE
kubia     4s

```
3. At this point, nothing happens because there is no controller that watches for the Website resource.  So we need to deploy a custom controller.  The source code for the controller is [here](https://github.com/luksa/k8s-website-controller)

```sh
#The website-controller will need a serviceAccount with sufficient privileges to access the kube-apiserver
kubectl create serviceaccount website-controller
kubectl create clusterrolebinding website-controller --clusterrole=cluster-admin --serviceaccount=default:website-controller

#create the website-controller as a deployment
kubectl create -f website-controller.yaml

#see what pods get deployed
kubectl get pods

#Notice the kubia-website pod has been deployed
NAME                                  READY     STATUS    RESTARTS   AGE
kubia-website-5645d5dc9-np68m         2/2       Running   0          3m
website-controller-84f9785c68-lzgmn   2/2       Running   1          3m

```

Below is a diagram from the [Kubernetes in Action](https://www.manning.com/books/kubernetes-in-action) book that describes the series of events that occur when the Website custom resource is deployed.

![Website Controller](./images/website-controller.png "Website Controller")

The website-controller pod contains 2 containers.

1. The controller itself that watches for 'Website' resources and deploys the website pod (which is just an nginx container that serves a static page)
2. A kubectl-proxy container as a 'side-car' container.  

The controller needs to communicate with the kube-apiserver in an authenticated manner.  The simplest way is to start up kubectl in proxy mode.  Since containers within the same pod share the same network namespace, the controller container can access the proxy via 'localhost'.  On start up, the controller gets a list of all 'Website' resource by sending a GET request like so:

```sh
#Notice the api path is group/version/resource as defined in the CRD
http://localhost:8001/apis/extensions.example.com/v1/websites?watch=true
```

See the following diagram from the [Kubernetes in Action](https://www.manning.com/books/kubernetes-in-action) book.

![Controller Pod](./images/controller-pod.png)

## API Aggregation - ADVANCED

API Aggregation is the ability to "aggregate" multiple api-servers and expose it as a single api-server.  This capability enables you to create your own custom api-server that is aware of your custom resources, and publish it as part of the kube-apiserver -from the client's perspective, they are aware only of a single apiserver. 

To "aggregate" your api-server, you register your API with the kube-apiserver via an [APIService](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.9/#apiservice-v1beta1-apiregistration) resource.  This resource enables you to "claim" a specific URL path in the K8S API.  Any request for your custom resource is then delegated to your API server. The API server implementation itself could be deployed as a pod onto the cluster, or even can be external to the cluster.  Essentially, the kube-apiserver acts as a proxy to your custom API.  Note, you API server is responsible for the full life-cycle of your custom resource objects, it is also responsible for persistence and hence you will have to provision an etcd cluster for your custom resources.  It is possible to re-use the cluster's etcd but to do so you need to specify a CRD.

For your API server to be useful, it will need to integrate with the API server so that it can look for and update the K8S resources - e.g. you will likely be creating deployments, pods, etc programmatically based on the semantics of your custom resource.  In order to help you with this, there is the [apiserver-builder](https://github.com/kubernetes-incubator/apiserver-builder/blob/master/README.md) incubator project that provide scaffolding to create your APIs. 

Note, this approach to introducing custom resources is more complex compared to CRDs.  In addition, your API server must be authored in golang.  However, aggregated apis give you full control and flexibility of native kubernetes capabilities.  In fact, the Open Service Broker API that underlies the Service Catalog is implemented as an aggregated API.

See this [reference](https://github.com/kubernetes-incubator/apiserver-builder/blob/master/docs/concepts/aggregation.md) for an excellent overview of API Aggregation concepts.

Checking to see if support for aggregated api is enabled for you cluster is very simple.  Just execute the kubectl command below.

```sh
kubectl get apiservice

#You should see something like this
NAME                                AGE
v1.                                 4d
v1.authentication.k8s.io            4d
v1.authorization.k8s.io             4d
v1.autoscaling                      4d
v1.batch                            4d
v1.networking.k8s.io                4d
v1.rbac.authorization.k8s.io        4d
v1.storage.k8s.io                   4d
v1beta1.apiextensions.k8s.io        4d  #apiextension.k8s.io group is enabled
v1beta1.apps                        4d
v1beta1.authentication.k8s.io       4d
v1beta1.authorization.k8s.io        4d
v1beta1.batch                       4d
v1beta1.certificates.k8s.io         4d
v1beta1.extensions                  4d
v1beta1.policy                      4d
v1beta1.rbac.authorization.k8s.io   4d
v1beta1.storage.k8s.io              4d
v1beta2.apps                        4d
v2beta1.autoscaling                 4d
```
If apiextensions is not enabled, then see [configure aggregation layer](https://kubernetes.io/docs/tasks/access-kubernetes-api/configure-aggregation-layer/).

## Service Catalog

## References

- [Aggregation Layer](https://kubernetes.io/docs/concepts/api-extension/apiserver-aggregation/)
- [Custom Resources](https://kubernetes.io/docs/concepts/api-extension/custom-resources/)
- [Azure Open Service Broker](https://azure.microsoft.com/en-us/blog/connect-your-applications-to-azure-with-open-service-broker-for-azure/)
- [Example creating CRDs with code-generator](https://github.com/kubernetes/sample-controller)

