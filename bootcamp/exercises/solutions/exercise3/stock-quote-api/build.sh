#!/usr/bin/env bash

#required to statically compile all dependencies into a single binary
CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main main.go

#build and tag the image
docker build --no-cache . -t architechbootcamp/stock-quote:1.0.0

#push to dockerhub. Note you have to be logged in first.
#docker push architechbootcamp/stock-quote:1.0.0