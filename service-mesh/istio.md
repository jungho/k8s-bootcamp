# Deploying Istio to AKS #

Istio is an open-source service-mesh that is built on top of the Envoy Proxy.  It has recently hit the 1.0 milestone and have been gaining widespread adoption.  For example, Redhat Openshift's [Service Mesh](https://docs.openshift.com/container-platform/3.10/servicemesh-install/servicemesh-install.html) is based on Istio, and Pivotal will be adding it to [Cloud Foundry](https://content.pivotal.io/blog/happy-birthday-istio-a-closer-look-at-how-pivotal-is-embedding-the-service-mesh-to-cloud-foundry-kubernetes-and-knative), and Google's [KNative](https://cloud.google.com/knative/) leverages Istio. 

There are multiple ways to install and configure Istio.  Which approach depends on whether you want to enable mutual TLS auth between the side-car proxies.  For our purposes, we will use the helm approach.  See [Installing Istio with Helm](https://istio.io/docs/setup/kubernetes/helm-install/#option-2-install-with-helm-and-tiller-via-helm-install) for instructions.

## Istio Architecture ##

![Istio Architecture](https://istio.io/docs/concepts/what-is-istio/arch.svg)

For an overview of Istio architecture, see [here](https://istio.io/docs/concepts/what-is-istio/).

## References ##

* [Istio docs](https://istio.io/)
* [Istio Quickstart for Kubernetes](https://istio.io/docs/setup/kubernetes/quick-start/)