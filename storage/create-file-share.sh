#set some env variables
export AZURE_STORAGE_ACCOUNT=${OPTARG:-'architechbootcamp'}
export AZURE_RESOURCE_GROUP=k8s-cluster_acs-cluster_canadacentral

#create the storage account and file share
#the name of the storage account can only have alphnumeric characters
az storage account create -n $AZURE_STORAGE_ACCOUNT \ 
  -g k8s-cluster_acs-cluster_canadacentral \
  -l canadacentral --sku Standard_LRS

#export the access key for the storage account, used when creating the fileshare
export AZURE_STORAGE_KEY=$(az storage account keys list -g k8s-cluster_acs-cluster_canadacentral --account-name $AZURE_STORAGE_ACCOUNT --query "[0].value" -o tsv)

#create the file share, choose your own name
az storage share create -n architech-share
