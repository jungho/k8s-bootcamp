# ConfigMaps #

ConfigMaps are K8S' means to externalize configuration from your application code.  They are essentially key/value pairs that can be defined in a single file, a directory of files or just simple literal values from the command line.  Configmaps are key value/pairs.  If the datasource is a file, the key is the filename and the value is the content of the file.

To create a config map from a file run:

```sh
kubectl create configmap app-config --from-file=application.properties
```

Get the content of a configmap like so:

```sh
kubectl get configmap app-config -o=yaml
```

Of course, as ConfigMaps are just resources, you can define a ConfigMap manifest with key/value pairs.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-properties
  namespace: default
data:
  log_level: DEBUG
```

*Note: ConfigMaps are not for credentials and keys.  They are meant for environment and application specific configuration data.  Use [secrets](https://kubernetes.io/docs/concepts/configuration/secret/) for credentials and keys.*

## Accessing ConfigMap Data from Pods ##

There are two primary approaches to access your configuration data from the containers within your Pods.  As environment variables and as a file in a volume.  You specify the approach within your pod template.  See the [Use ConfigMap Data in Pods](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/) at K8S.io.

Also see:

- [configmap-from-env.yml](./configmap-from-env.yml)
- [configmap-from-envFrom.yml](./configmap-from-envFrom.yml)
- [configmap-from-volume.yml](./configmap-from-volume.yml)

## References ##

- [Configure Containers Using a ConfigMap](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/)
- [Configuration Best Practices](https://kubernetes.io/docs/concepts/configuration/overview/)