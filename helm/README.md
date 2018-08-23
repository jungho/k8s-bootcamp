# Packaging and deploying K8S applications using Helm #
## Pre-Requisites ##

You should have successfully set up your environment as outlined in [README.md](../bootcamp/exercises/README.md)
## Deploying the Todo Application ##

From within the helm directory run the following commands:

```sh
#On AKS, the necessary rolebinding for helm to be able to deploy resources to the necessary namespaces. This is required 
#to give the default service account in each namespace permissions to access the necessary resources. 
#This is not required on Minikube.
kubectl create -f default-rolebinding.yaml

#1) ensure the helm client version and the tiller version on the server are compatible.
helm init --upgrade

#2) Create a namespace to deploy your app. Replace <namespace> with whatever namespace you choose. 
kubectl create namespace <namespace>

#3) Create secrets required by the app in the same namespace
./create_secrets.sh <namespace>

#4) do a dry run install to make sure everything is ok. This command will echo out the manifests that will be deployed. Review it carefully.
helm install --dry-run --debug architech/todo-app

#5) install the todo-app
helm install architech/todo-app --namespace <namespace>

#6) check that the app has been deployed.  You should see the todo-app has been deployed.
helm ls

```
You now need to get the external IP of the Loadbalancer service that has been provisioned.
Run `kubectl get services --namespace <namespace>` to get the external IP of the nginx-ingress service.  Your output will look similar to mine.

```sh
NAME                   TYPE           CLUSTER-IP     EXTERNAL-IP    PORT(S)        AGE
default-http-backend   ClusterIP      10.0.14.155    <none>         80/TCP         15m
mongodb                ClusterIP      10.0.31.188    <none>         27017/TCP      15m
nginx-ingress          LoadBalancer   10.0.155.10    52.235.38.16   80:30043/TCP   15m
todo-api               ClusterIP      10.0.85.46     <none>         8080/TCP       15m
todo-webui-service     ClusterIP      10.0.43.113    <none>         80/TCP         15m
user-api               ClusterIP      10.0.193.165   <none>         8082/TCP       15m

```

Then update the ingress resource to reflect the external IP.

```sh
#this will load the yaml manifest in your editor.
kubectl edit ingress/todo-app-ingress --namespace <namespace>
```

Update the `host:` field with your `EXTERNAL-IP.nip.io` and save the file. kubectl will update the ingress with the new value.  Note, the host field only accepts a valid DNS name, IP addresses are not allowed.  To deal with this we will use a dynamnic DNS service called nip.io.

## Instructions for Minikube ##

You should have installed and started up minikube by following the instructions in [bootcamp/exercises/README.md](../bootcamp/exercises/README.md).

Deploy the helm chart using the instructions above.

To get the IP of your nginx-ingress service, run:

```sh
minikube service list
```

Update the ingress resource as described above.

**With minikube, the external IP for the LoadBalancer service will always display as PENDING.  This is because minikube does not provision a LoadBalancer. Therefore, to access the application via your browser, you need to use the IP and port displayed.** 

## Securing Helm/Tiller ##

It is very, very important to follow security best-practices with Helm/Tiller.  Tiller by default will be deployed without any restriction.  Although, helm can only access Tiller after being authenticated by the API Server, Tiller can do anything on the cluster!!  Hence lock down your Tiller deployment using the best-practices list in the [docs](https://github.com/kubernetes/helm/blob/master/docs/securing_installation.md).  Also see this excellent [article](https://engineering.bitnami.com/articles/helm-security.html) from Bitami.

## References ##

- [Helm Documenation](https://docs.helm.sh/using_helm/)
- [Debugging Templates](https://github.com/kubernetes/helm/blob/master/docs/chart_template_guide/debugging.md)
- [Using SSL Between Helm & Tiller](https://github.com/kubernetes/helm/blob/master/docs/tiller_ssl.md)