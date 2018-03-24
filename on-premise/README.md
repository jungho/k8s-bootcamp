# Deploying Kubernetes On-premise

Although cloud in most cases is the way to go, there will be situations that Kubernetes must be deployed on-premise, and there are MANY options to deploy Kubernetes on-premises.  Here we list some different options as well as links to resources. 

**Note, this is not a definitive list! I only list distributions I have experience with.**  

Which option is best for you depends on your objectives.  In general, each solution sits on multiple axes of *flexibilty/control*, *ease of management/deployment*, *license cost*.  

- [Kubeadm](#markdown-header-kubeadm)
- [Kubespray](#markdown-header-kubespray)
- [CoreOS Tectonic](#markdown-header-coreos-tectonic)
- [Rancher](#markdown-header-rancher)
- [Redhat Openshift](#markdown-header-redhat-openshift)

## Kubeadm 

Kubeadm is an open source tool that provides a "base" installation of Kubernetes.  You install the kubelet and docker on all nodes, then kubeadm uses the kubelet to deploy the rest of the K8S components on the master and worker nodes.  Essentially, kubernetes deploys itself using its own components!  This is called "self-hosting".  

Kubeadm provides the fastest way to deploy a base cluster.  However, it is not a production cluster.  For example, if you want an HA etcd deployment with at least 3 etcd instances on their own dedicated nodes, then you need to deploy etcd separately.

See [kubeadm overview](https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm/)

## Kubespray

[Kubespray](https://github.com/kubernetes-incubator/kubespray) is currently a Kubernetes incubator project.  It is a set of Ansible playbooks to deploy Kubernetes on-premise as well as on the cloud (note, support for Azure has been deprecated in favour of [acs-engine](https://github.com/Azure/acs-engine)). It supports deployment to multiple OS platforms and supports the latest control plane components as well as third party addons such as CNI plugins from Calico, Weave and Flannel.  If you want/need the latest components on-premise, and the ultimate flexibility (but you manage everything), then Kubespray is very attractive. 
## CoreOS Tectonic 

[CoreOS Tectonic](https://coreos.com/tectonic/) is a Kubernetes distribution from one of the leading companies in the container space and contributors to the Kubernetes project.  They have recently been aquired by Redhat so whether this will change their product roadmap or not it is not clear.  Tectonic is a K8S distribution build on top of their Container Linux product.  It comes with some enterprise capabilities such as Identity, Container Registry, and in alpha are operational metrics and reporting such as Chargebacks that are useful in organizations with shared environments.  Many organizations have deployed Tectonic on-premise.  Tectonic can be deployed on Container Linux and will support RHEL.
## Rancher

[Rancher](https://rancher.com/kubernetes/) is another Kubernetes distribution that can be deployed both on-premise and in the cloud.  Note, Rancher also provides support for other orchestrators besides Kubernetes.  They have a cli tool called rke that makes it very easy to deploy Kubernetes on-premises.  They also have a managment platform that is very nice for managing the infrastructure as well as Kubernetes.  Rancher is an excellent option of on-premise deployment.  It supports deployment on Ubuntu, Centos, RHEL.  Windows support is said to be coming.

## Redhat Openshift Container Platform

[Redhat OCP](https://www.openshift.com/container-platform/index.html) is probably one of the most widely deploy Kubernetes distribution in large enterprises.  It can be deployed on-premise as well as in the cloud.  Redhat also provides a cloud managed solution on AWS called [Openshift Online](https://www.openshift.com/pricing/index.html).  Organizations like OCP because it is a PaaS platform built on top of Kubernetes, and it comes with integrated CI/CD based on Jenkins, monitoring/log aggregation using Prometheus/Fluentd/Graphana, project-based RBAC and more.  OCP is very security focused out of the box.  It will not allow you to deploy privileged containers so many of the images in DockerHub will not work.  This is actually a good thing!  Note, OCP is very much RH oriented.  This means it deploys to RHEL.  It supports other Linux OS if you are deploying the open source version of Openshift.  
