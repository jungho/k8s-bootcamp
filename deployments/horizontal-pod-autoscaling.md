# Horizontal Pod Auto-Scaling #

Horizontal Pod Auto Scaling (HPA) is a capability to scale out/in the number of pods based on resource metrics e.g. CPU.

In order to use auto-scaling, you should deploy your pods using deployments. You also need to enable the heapster add-on which will be responsible for capturing the metrics.

HPA is a resource and is managed by a controller just like other resources.

There are two versions of the autoscaling apis and they differ in capability.  The stable version of the autocaling API (autoscaling/v1) supports only CPU scaling, beta (autoscaling/v2beta1) supports both CPU and Memory and custom metrics.

*Tip: To see which api versions your cluster supports run ```kubectl api-versions```*

Custom metrics can be any metric that is captured about your pods or even other objects within the same namespace.  For example, if the ingress object in your cluster reaches a certain threshold, you could scale out your pods.  To leverage custom metrics, your monitoring system needs to make the metrics available through an API that the HPA Controller would poll.

See [php-apache-hpa.yml](./php-apache-hpa.yml) for autoscaling/v1 and [hpa.v2beta1.yml](./hpa.v2beta1.yml) for autoscaling/v2beta1.

*Note: Before you leverage autoscaling, you should understand [pod disruptions and pod disruption budgets](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/) in order to ensure your application availability constraints are respected*

## References ##

* [Horizontal Pod Auto-scale docs](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)
* [Auto-scaling Algorithm](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md#autoscaling-algorithm)