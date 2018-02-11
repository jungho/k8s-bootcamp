## Deploying the TO-DO Environments and Containers ##

This document explains how to deploy the To-Do application (UI, To-Do API, and User API) into staging and productions environments (namespaces).

### 1. Deploy the Kubernetes Cluster ###

Follow [these instructions](azure-acs/README.md) to deploying a Kubernetes cluster in Azure.

### 2. Deploy the Jenkins Server ###

Follow [these instructions](azure-build-server/README.md) to deploying a Jenkins server in Azure that is configured to have access to the previously created Kubernetes cluster.

### 3. Create Namespaces and Secrets ###

Create namespaces and secrets using the following commands from `helm` folder:

  - Run `./create_secrets.sh qa-env` to create QA environment and secrets
  - Run `./create_secrets.sh prod-env` to create PROD environment and secrets

### 4. Deploy Application using Helm ###

From `helm` folder run the following commands to deploy the application to the two environments. For reference, see [helm README](../helm/README.md).

```sh
#replace <your_ip.nip.io> with your cluster loadbalancer.
#This value CANNOT be an IP address, you need to provide a valid DNS name.  Use nip.io if you
#have not defined a DNS name.
helm install --namespace qa-env --name todo-app-qa-deployment --set Global.Environtment=qa,Global.Host=<your_ip.nip.io> architech/todo-app

helm install --namespace prod-env --name todo-app-prod-deployment --set Global.Environment=production,Global.Host=<your_ip.nip.io> architech/todo-app
```

### 5. Configure Jenkins ###

The following assumes, you are using Architech k8s-bootcamp repo. If necessary, adjust file paths accordingly.

1. Create a Pipelines Job for the QA-Prod Pipeline:
    1. Name must be `QA-Prod-Pipeline`
    2. Add the correct repo and your credentials
    3. For `Additional Behaviour` add `Polling ignores commits in certain paths`
      - For Included Regions, add:
        - `todo-app/*`
      - For Excluded Regions, add:
        - `todo-app/todo-api-java/*`
        - `todo-app/todo-ui/*`
        - `todo-app/user-api/*`
    4. Set correct branch `refs/heads/master`
    5. Set `Script Path` to the `todo-app/Jenkinsfile`

2. Create a Pipelines Job for To-Do API:
    1. Set the name of the Job
    2. Add the correct repo and your credentials
    3. For `Additional Behaviour` add `Polling ignores commits in certain paths`
      - For Included Regions, add:
        - `todo-app/todo-api-java/*`
    3. Set correct branch `refs/heads/master`
    4. Set `Script Path` to the `todo-app/todo-api-java/Jenkinsfile`

3. Create a Pipelines Job for User API:
    1. Set the name of the Job
    2. Add the correct repo and your credentials
    3. For `Additional Behaviour` add `Polling ignores commits in certain paths`
      - For Included Regions, add:
        - `todo-app/user-api/*`
    3. Set correct branch `refs/heads/master`
    4. Set `Script Path` to the `todo-app/user-api/Jenkinsfile`

4. Create a Pipelines Job for To-Do UI:
    1. Set the name of the Job
    2. Add the correct repo and your credentials
    3. For `Additional Behaviour` add `Polling ignores commits in certain paths`
      - For Included Regions, add:
        - `todo-app/todo-ui/*`
    3. Set correct branch `refs/heads/master`
    4. Set `Script Path` to the `todo-app/todo-ui/Jenkinsfile`
