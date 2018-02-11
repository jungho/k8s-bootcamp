package main

// Simple REST api to return details of the running pod.
// In order to access information about the pod runtime as environment variables
// you need to define environment variables within your pod template.
// See https://kubernetes.io/docs/tasks/inject-data-application/environment-variable-expose-pod-information/
// @author Jungho Kim, jk@architech.ca

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
)

func main() {
	log.Println("Starting up pod-detail api...")
	router := mux.NewRouter()
	//router.PathPrefix("/pod-details").HandlerFunc(getPodDetails).Methods("GET")
	router.PathPrefix("/").HandlerFunc(catchAllHandler).Methods("GET")
	log.Fatal(http.ListenAndServe(":8000", router))
}

func catchAllHandler(w http.ResponseWriter, r *http.Request) {
	getPodDetails(w, r)
}

func getPodDetails(w http.ResponseWriter, r *http.Request) {
	log.Printf("Request URI was: %s\n", r.RequestURI)
	log.Printf("Getting pod detail for request from %s\n", r.RemoteAddr)

	now := time.Now()

	var podDetail = PodDetail{IP: os.Getenv("POD_IP"),
		Name:      os.Getenv("POD_NAME"),
		NameSpace: os.Getenv("POD_NAMESPACE"),
		Node:      os.Getenv("POD_NODE_NAME"),
		Timestamp: now.String(),
	}

	json.NewEncoder(w).Encode(podDetail)
}

type PodDetail struct {
	IP        string
	Name      string
	NameSpace string
	Node      string
	Timestamp string
}
