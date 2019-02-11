#!/usr/bin/env bash

deployWithLinkerd=false
namespace='default'

function checkLinkerdInstalled {
    if linkerd version
    then
      echo "linkerd is installed"
    else
      echo "linkerd is not installed.  Please go to https://linkerd.io/2/getting-started/ for instructions on how to install.";
      exit 1;
    fi
}

while getopts :cn: opt; do
    case $opt in
        c)
            deployWithLinkerd=true
            checkLinkerdInstalled
            ;;
        n)
            namespace=${OPTARG:-'todo-app'}
            ;;
        \?) #invalid option
            echo "usage: ./deploy-todo-app [-c] [-n namespace] default namespace is 'default'"
            exit 1
            ;;
    esac
done

#Create the secrets need by the application to access Azure AD
kubectl create secret generic todoapp-secrets --from-file=secrets --namespace="$namespace"

#Create the configuration object for the todo and user APIs
kubectl create --namespace="$namespace" -f todo-api-config.yaml
kubectl create --namespace="$namespace" -f user-api-config.yaml
kubectl create --namespace="$namespace" -f todo-ui-config.yaml

#Now create the application

kubectl create -f mongodb-deployment.yaml --namespace="$namespace"

if [ "$deployWithLinkerd" = true ]; then
    echo "deploying todo-app to namespace: '$namespace' WITH the Conduit side proxy."

    linkerd inject user-api-deployment.yaml | kubectl create --namespace="$namespace" -f -
    linkerd inject todo-api-deployment.yaml | kubectl create --namespace="$namespace" -f -
    linkerd inject todo-ui-deployment.yaml | kubectl create --namespace="$namespace" -f -
    echo ""
    echo "access the Linkerd Dashboard by executing 'linkerd dashboard'"
else
    echo "deploying todo-app to namespace: '$namespace'"
    kubectl create -f user-api-deployment.yaml --namespace="$namespace"
    kubectl create -f todo-api-deployment.yaml --namespace="$namespace"
    kubectl create -f todo-ui-deployment.yaml --namespace="$namespace"
fi
