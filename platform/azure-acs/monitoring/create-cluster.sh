
basename=${1:-"techdemo"}
rgname=$basename"-resource-group"
storagename=$basename"storage"
clustername=$basename"-k8"
location="canadacentral"
storage_type="Standard_LRS"
# vm_size="Standard_A1"
vm_size="Standard_D2_v3"
account_id="f6de0a1c-8065-430a-92d0-2dd8fff759bf"

echo " setting the account id to $account_id"

az account set -s $account_id

echo "Creating $clustername Cluster in resource group $rgname "

echo "Creating the $rgname Resource group ..."
az group create --name $rgname --location $location
echo "Done ..."

#echo "Creating $storagename Storage account"
#az storage account create -n $storagename -g $rgname -l $location --sku $storage_type

echo "Creating the Kubernetes Cluster $clustername..."
az acs create --orchestrator-type kubernetes --resource-group $rgname --name $clustername --generate-ssh-keys --agent-count 2 --agent-vm-size $vm_size
echo "Done ..."

echo " Connecting to the cluster"
az acs kubernetes get-credentials --resource-group $rgname --name $clustername

echo "You can now launch kubectl"
kubectl get nodes





#az webapp create --resource-group $basename --plan myAppServicePlan --name <app_name> --deployment-container-image-name <docker-ID>/mydockerimage:v1.0.0
