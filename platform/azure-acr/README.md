# Using Azure Private Registry with kubernetes

## Overview of tasks

#### 1. Create a Private Repository in Azure, push your images into it and obtain the credentials (_acr-username_ and _acr-password_) needed to pull images from it.
#### 2. Register the _acr-username_ and _acr-password_ into kubernetes as a 'secret'
#### 3. Reference that secret in our Application manifest allowing the repository to authenticate the cluster and giving it the right to pull the images we pushed into it

## Preparing your private repository
Please follow the documentation in the following links to create a repository and push your images into it.

https://docs.microsoft.com/en-us/azure/container-registry/container-registry-get-started-azure-cli

It is straight forward and now you take note of two pieces of information that we will use going forward
*  *repository-name*
*  *repository-resource-group*

Once the registry is created you need to run the following command to allow administration access for yourself

> az acr update -n _repository-name_ **--admin-enabled _true_**

Now you can get your credentials by issuing the command

> az acr credential show --name _**repository-name**_

Your output should look something like this
```json
{
  "passwords": [
    {
      "name": "password",
      "value": "9UDu338japoI=OC6oQLcVCOB8TBC3hcS"
    },
    {
      "name": "password2",
      "value": "/unxO3EJeG1sWd9oYrtoAbwP8OW6BKdi"
    }
  ],
  "username": "techdemoACR"
}
```
You want to take note of your
* *acr-username*
* *acr-passowrd*

## Adding your private repository credentials to Kubernetes

Use _kubectl_ to create a secret "_acr-secret_" if your _repository-name_ was _techdemoacr_ then your docker server  will be _https://techdemoacr.azurecr.io_ and the command will look like this!

> kubectl create secret docker-registry acr-secret --docker-server=https://techdemoacr.azurecr.io --docker-username=acr_username --docker-password=acr_password --docker-email=anymail@company.com

## Modify your deployment yaml files to include the _acr-secret_ ##
_
If your yaml file contains a reference to a container image such as

```yaml
spec:
  containers:
    - name: someimage
      image: techdemoacr.azurecr.io/somefolder/someapi:v1
      ports:
        - containerPort: 8080
```

You modify that by adding the secret to the spec of the containers

```yaml
spec:
  containers:
    - name: autocomplete
      image: techdemoacr.azurecr.io/somefolder/someapi:v1
      ports:
        - containerPort: 8080
  imagePullSecrets:
    - name: techdemosecret
```
Deploy your code
> Hint : you can always use the following command to monitor your pod as it deploys to trouble-shoot it
> * watch --interval 1 kubectl get po --namespace yournamespace podname

## Repo Helper files

All scripts here can help you achieve your previous tasks by changing the variable values in each script

| FileName        | Usage           |
| ------------- |:---------------------
|create-reg.sh    | Creates your private registry and enables admin
| cleanup.sh     | Removes the resource group containing your registry and all resources      |
| create_secret.sh | Creates your secret in the kubernetes cluster     |
|tag_push_images.sh   |   Utility to tag and push local images into your repository |
