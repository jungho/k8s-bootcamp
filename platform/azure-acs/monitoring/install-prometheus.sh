if [ "$#" -ne 1 ] ; then
  echo "Usage: $0 namespace" >&2
  echo " Assuming default  namespace=\"monitoring\" "
  namespace="monitoring"

else
  namespace=$1
fi
echo "Creating Storage Class prometheusstorage"
kubectl apply -f prometheus_hdd.yaml

echo "First upgrading tiller on ACS"
helm init --upgrade --wait

echo " Installing Prometheus & Grafana namespace $namespace "

# helm install --name prometheus --namespace $namespace  stable/prometheus --set alertmanager.persistentVolume.enabled=false --set server.persistentVolume.enabled=false
helm install --name prometheus --namespace $namespace  ./helm/prometheus

echo "Installing Graffana ...."
# helm install --name grafana --namespace $namespace stable/grafana --set server.persistentVolume.enabled=false
helm install --name grafana --namespace $namespace ./helm/grafana
