#Replace account_id with your Azure subscription ID
#You can retrieve it using the cli like so:
# 
# az account show
#
# The subscription ID is the value of the "id" field
account_id="f6de0a1c-8065-430a-92d0-2dd8fff759bf"
echo " setting the account id to $account_id"
rgname="tech-demo-acr-rg"
az account set -s $account_id
acrname="techdemoACR"

echo "Creating the $rgname Resource group ..."
az group create --name $rgname --location canadacentral
echo "Done ..."

az acr create --name $acrname  --resource-group $rgname  --sku Basic
az acr update -n $acrname --admin-enabled true
