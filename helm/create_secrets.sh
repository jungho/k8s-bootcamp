
if [ "$#" -ne 1 ] ; then
  echo "Usage: $0 namespace" >&2
  echo "assuming it is todo-app"
  kubectl create secret generic todoapp-secrets --from-file=secrets --namespace=todo-app
 else
  todoapp_namespace=$1
  kubectl create secret generic todoapp-secrets --from-file=secrets --namespace=$todoapp_namespace
fi

