
if [ "$#" -ne 1 ] ; then
  echo "Usage: $0 namespace" >&2
  echo "assuming it is todo-app"
  todoapp_namespace="todo-app"
else
  todoapp_namespace=$1
fi

#Create the secrets need by the application to access Azure AD
kubectl create secret generic todoapp-secrets --from-file=secrets --namespace=$todoapp_namespace

#Create the configuration object for the todo and user APIs
kubectl create --namespace=$todoapp_namespace -f todo-api-config.yaml
kubectl create --namespace=$todoapp_namespace -f user-api-config.yaml
kubectl create --namespace=$todoapp_namespace -f todo-ui-config.yaml

#Now create the application
kubectl create --namespace=$todoapp_namespace -f todo-app.yaml