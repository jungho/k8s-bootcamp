# Deploying Linkderd2 #

Deploying linkerd2 to Kubernetes is very simple.  Follow the instructions [here](https://linkerd.io/2/getting-started/) to deploying linkerd2 onto the cluster.  Then to deploy the todo-app:

```sh
#In the todo-app/manual-k8s-deploy
#If you do not specify a namespace, it will deploy to the default namespace
./deploy-todo-app.sh -l -n <namespace-to-deploy-your-app>
```

The shell script verifies linkerd2 is installed on the cluster then executes the commands to "inject" the linkerd sidecar containers into your pods.

Once you have deployed the todo-app, access the linkerd dashboard by executing `linkerd dashboard`.  This will create a tunnel to the linkerd grafana dashboard.

One current issue with linkerd2 is that the injection model does not work well with helm.  Given that helm is a key toolset for Kubernetes, this is something that the Bouyant team is prioritizing high.  See the following github issue to track progress - https://github.com/linkerd/linkerd2/issues/452.

## References ##

* [Linkerd2 Documentation](https://linkerd.io/2/overview/)