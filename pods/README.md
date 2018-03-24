# Pods #

Pods are the primary unit of deployment, horizontal scaling and replication in K8S.  A pod is comprised of one or more containers.  The containers share storage and network. Therefore, a container can communicate with another container (in the same pod) via ``localhost:port``.  This does mean that the containers within a pod do need to be aware of which ports are being used, however, in reality that is desired as containers within pods are together because they logically (and physically) should be - they are naturally coupled.  In general, those things that should be close together should be encapsulated within a pod.  Those things that should be loosely coupled should be in separate pods.

The pod model makes K8S very flexible.  It makes it easy for you to containerize and move your exiting n-tiered, monolith apps to K8S easily without major architectural overhaul.  Overtime, as desired (and as it makes sense) you can decompose your application to a micro-service based architecture.

Pods are isolated from other pods from the perspective of network/storage/cpu.  In this manner they achieve the same level of isolation as containers.  In order to communicate with other pods, they do so through the K8S [service](../services/README.md) abstraction - note, within the cluster IP address space, every Pod instance gets a unique IP, however, your application services should not be aware of these IPs. Pods are ephemeral, dynamically scheduled resources and hence their IP can change. [Services](../services/README.md) and a cluster DNS service solves this problem.

Pods are scheduled by K8S onto the worker nodes.  When you deploy a pod, the K8S scheduler will decide where that pod will be deployed.  The scheduler takes into account many factors when it makes this decision.  For example,

* How much CPU, memory resources does your pod need?
* How much resources are available on the existing nodes?
* Does the pod state that it must be scheduled to a node with specific characteristics?
* Does the pod have QoS requirements when it comes to scheduling? e.g. Guaranteed, BestEffort

Pods are resources within K8S.  Their declarative specification (e.g. what containers are part of the pod, what ports should be open, how much memory/cpu is required, what volumes need to be mapped, QoS, etc) is sent to the kube-apiserver and durably stored in the cluster state store (e.g. etcd).  This specification is read by controller managers, the scheduler, and the kubelet agent to deploy the pod on to a node.

Pods are specified in a pod manifest (in fact, all the K8S resources you will directly work with are specified in manifests).  These manifests are consumed by K8S to deploy and manage the lifecycle of your application.  You can view these manifests as the declarative specification of your system on K8S. If the specification changes, the K8S services deploys that change.  K8S essentially takes the "desired state" that you specify and makes it the "current state", and it does so continuously.  This is what makes K8S very, very powerful.

* [simple nginx pod](./simple-pod.yaml).
* [nginx pod that is scheduled to specific nodes](./nginx-scheduling.yaml)

## Resource Requests and Limits ##

Pods are dynamically scheduled onto nodes with other pods.  In order to play nice, you should consider the cpu/memory resources that your pods consume.  Resource requests and limits can be defined within the manifest to tell the kubelet how much cpu/memory you would like, and also the limit to set it to.  How you define resource requests/limits will influence how, when your pods will be scheduled.  For example, K8S supports Guaranteed, Burstable and BestEffort QoS classes.  Given a set of pods waiting to be scheduled they will be scheduled in this order: Guaranteed before Burstable before BestEffort.

* See [qos-guaranteed.yaml](./qos-guaranteed.yaml) and [qos-burstable.yaml](./qos-burstable.yaml)

## Container Probes ##

The kubelet agent that runs on every worker node, monitors the health and readiness of your pods if you configure [container probes](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#container-probes).  Until a pod is 'ready' no requests will be routed to your pod.  If a pod is deemed unhealthy then the kubelet can bring the pod down.

If and when you should define liveness and readiness probes depends on the containers.  If your container requires sometime to start up and you do not want any requests routed to your pod until it is ready, then you should define a readiness probe.  If your container should be restarted if it does not respond after a period of time (because it has an unidentified bug), you should define a liveness probe.  See the excellent docs [here](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/) for details.

* [Example configuring liveness and readiness probes](./http-liveness-readiness.yaml)

## Running as Non-Root ##

Part of safe and secure docker practices is running as non-root.  Far too many containers in production are running as privileged users when there is no need to, and as a result dramatically increases the security exposure of your system.   There are multiple ways to not run as a privileged user:

* When creating your images, use the Docker USER instruction to set the user/group to run as
* set the securityContext for your container in the Pod template

See [busybox-root.yaml](./busybox-root.yaml) and [busybox-non-root.yaml](./busybox-non-root.yaml) for examples.


## Note ##

It is important to note that you will rarely define pod manifests directly except in the most simple cases.  You will work with other resources such as Deployments, StatefulSets, DaemonSets that control the deployment, scaling, and lifecycle of your pods.  When you define your pod specifications you will do so as 'templates' within the manifests for those resources.

## Reference ##

* [Pods](https://kubernetes.io/docs/concepts/workloads/pods/pod/)
* [Pod API Reference](https://kubernetes.io/docs/api-reference/v1.8/#pod-v1-core)
* [Top Level API Objects](https://htmlpreview.github.io/?https://github.com/kubernetes/kubernetes/blob/HEAD/docs/api-reference/v1/definitions.html)
* [API Conventions](https://github.com/kubernetes/community/blob/master/contributors/devel/api-conventions.md)
* [Manage compute resources for containers](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/)