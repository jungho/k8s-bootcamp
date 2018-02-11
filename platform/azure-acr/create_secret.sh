#Create your own values for these variables
secretname="techdemosecret"
password="9UDu338japoI=OC6oQLcVCOB8TBC3hcS"
server="https://techdemoacr.azurecr.io"
username="techdemoACR"
email="akhalifa@architech.ca"

kubectl create secret docker-registry $secretname --docker-server=$server --docker-username=$username --docker-password=$password --docker-email=$email
