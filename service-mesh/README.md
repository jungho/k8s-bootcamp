# Service-Mesh #

## Deploying the Todo-App with Conduit ##

[Conduit](https://conduit.io/getting-started/) is a lightweight service-mesh that was announced at the recent Kubecon.  It is an opensource project initiated by [Bouyant](https://buoyant.io/) the company behind the [Linkerd](https://linkerd.io/) service-mesh.  Read the excellent blog article ['What is a service-mesh and why do I need one?'](https://buoyant.io/2017/04/25/whats-a-service-mesh-and-why-do-i-need-one/) by Bouyant.

To deploy the todo-app so that Conduit proxies requests to the todo-app pods:

1. Install Conduit.  See the [Getting Started Guide](https://conduit.io/getting-started/)
2. From within the [todo-app/manual-k8s-deploy](../todo-app/manual-k8s-deploy) directory, execute `./deploy-todo-app.sh [-n namespace] -c`.  

If you do not specify a namespace, the default will be todo-app.  make sure you have created the namespace first.

After you have deployed the application with conduit, execute `conduit dashboard` to access the conduit dashboard and view which pods have been instrumented by Conduit.

## References ##

- [Linkerd service-mesh](https://linkerd.io)
- [Istio service-mesh](https://istio.io/)