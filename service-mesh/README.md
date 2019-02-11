# Service-Mesh #

Read the excellent blog article ['What is a service-mesh and why do I need one?'](https://buoyant.io/2017/04/25/whats-a-service-mesh-and-why-do-i-need-one/) by Bouyant.

## Linkerd2 ##

Linker2 is a new kubernetes native servic-mesh from Buoyant.  It used to be called Conduit.  Bouyant was very early in the service-mesh space with their linkerd product that was implemented in Java - linkerd was quite heavyweight but it was orchestrator agnostic.  However, with Kubernetes pretty much winning the orchestrator war, they are have created a more lightweight, kubernetes native version that is linkerd2.  For instructions to deploy linkerd2 and the todo-app, see [here](./linkderd2.md).

## Istio ##

Another service-mesh that needs to be considered is Istio.  Istio has just reached version 1.0 and many of its core features are now stable.  Istio leverages other open-source projects such as [Envoy](https://www.envoyproxy.io/) to handle the service discovery, circuit breaking, end-to-end TLS etc.  Istio is significant because it key part of Google's [Knative](https://cloud.google.com/knative/) serverless platform that is based on Kubernetes, and Redhat has just announced that they will be integrating istio into the Openshift Container Platform product.  For instructions to deploy istio and the todo-app, see [here](./istio.md).

## References ##

- [Linkerd service-mesh](https://linkerd.io)
- [Istio service-mesh](https://istio.io/)