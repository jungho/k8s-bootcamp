if [ "$#" -ne 1 ] ; then
  echo "Usage: $0 namespace" >&2
  echo " Assuming monitoring name space "
  namespace="monitoring"
else
  echo " running Grafana on namespace $1"
  namespace=$1
fi


export POD_NAME=$(kubectl get pods --namespace $namespace -l "app=prometheus,component=server" -o jsonpath="{.items[0].metadata.name}")
kubectl --namespace $namespace port-forward $POD_NAME 9090
open http://127.0.0.1:9090

# Older istio
# export POD_NAME=$(kubectl get pods --namespace $namespace -l "component=istio-grafana" -o jsonpath="{.items[0].metadata.name}")
# kubectl port-forward $POD_NAME 3000:3000 --namespace $namespace &
# open http://127.0.0.1:3000/dashboard/db/istio-dashboard
