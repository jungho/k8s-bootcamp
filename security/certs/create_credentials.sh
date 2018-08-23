#/usr/bin/bash
user='qa'
organization='architech'
ca_location=${HOME}'/.minikube'

if [ "$#" -lt 2 ]; then
  echo "usage: $0 user organization ca_location"
  exit 1
else
  user=$1
  organization=$2
  ca_location=${3:-$HOME/.minikube}
  echo "generating credentials for user '$user' from '$organization' using CA located in '$ca_location'"
fi

openssl genrsa -out ${user}.key 2048
openssl req -new -key ${user}.key -out ${user}.csr -subj "/CN=${user}/O=${organization}"
openssl x509 -req -in ${user}.csr -out ${user}.crt -days 500 -CA ${ca_location}/ca.crt -CAkey ${ca_location}/ca.key -CAcreateserial
