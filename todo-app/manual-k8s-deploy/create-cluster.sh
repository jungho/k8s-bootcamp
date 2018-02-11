#Example script to provision a K8S cluster on Azure Container Service
#ACS supports multiple orchestrators so you need to specify --orchestrator-type Kubernetes

rg_name="todo-app-rg"
cluster_name="todo-app-K8S"
location="canadacentral"
# vm_size="Standard_A1"
vm_size="Standard_D2_v3"

echo "Creating $cluster_name Cluster in resource group $rg_name"

echo "Creating the $rg_name Resource group ..."
az group create --name $rg_name --location $location
echo "Done ..."

echo "Creating the Kubernetes Cluster $cluster_name..."
az acs create --orchestrator-type Kubernetes --resource-group $rg_name --name $cluster_name --generate-ssh-keys --master-count 1 --agent-count 2 --agent-vm-size $vm_size
echo "Done ..."

echo " Connecting to the cluster"
az acs kubernetes get-credentials --resource-group $rg_name --name $cluster_name

echo "You can now launch kubectl"
echo "Try running to verify the health of the cluster: kubectl get componentstatuses"
