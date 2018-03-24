#/usr/bin/bash

user='qa'
cluster='minikube'

if [ "$#" -lt 2 ]; then
  echo "usage: $0 user cluster"
  exit 1
else
  user=$1
  cluster=$2

  echo "creating kubectl context for user '$user' for cluster '$cluster' using $user.crt/.key"
  kubectl config set-credentials ${user} --client-certificate=./${user}.crt  --client-key=./${user}.key
  kubectl config set-context ${user}-context --cluster=${cluster} --user=${user}
  exit 0
fi