# Draft #

[Draft](https://github.com/Azure/draft/blob/master/docs/reference/dep-003.md) is an open-source tool lead by Microsoft that aims to make it much simpler for developers to build applications that would be deployed to Kubernetes.  

## Running the Example ##

The instructions to install draft for your system is located [here](https://github.com/Azure/draft/blob/master/docs/install.md).  We will do couple things a bit differently.

1. We will use DockerHub as the registry, so create a free account at https://hub.docker.com/
2. We will deploy to an RBAC enabled cluster, in this case minikube.
3. We will enable ingress

Once you have installed draft, [helm](https://github.com/kubernetes/helm), and kubectl, and started up [minikube with RBAC enabled](../bootcamp/exercises/README.md), enable the ingress addon.

```sh 
minikube addons enable ingress
```

Then run the script `./init-draft.sh`.  This script will initilize helm, and draft with all the necessary permissions to deploy resources to the draft namespace.

After you have initialized helm and draft, run the commands below. 

```sh
draft create todo-ui
```

