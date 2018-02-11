package main

//Simple API that integrates with a service external to the K8S cluster.
//Note the RANDOM_QUOTE_SERVICE environment variable value will be the
//name of the service resource deployed to K8S.
//@author Jungho Kim, jk@architech.ca
import (
	"fmt"
	"log"
	"net"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"gopkg.in/resty.v1"
)

func main() {

	log.Println("Starting up random-quote api...")
	router := mux.NewRouter()
	router.HandleFunc("/random-quote", getRandomQuote).Methods("GET")
	log.Fatal(http.ListenAndServe(":8000", router))
}

func getRandomQuote(w http.ResponseWriter, r *http.Request) {
	quoteService := os.Getenv("RANDOM_QUOTE_SERVICE")
	log.Printf("Getting random quote from %s for request from %s\n",
		quoteService, r.RemoteAddr)

	log.Printf("Looking up CNAME for %s", quoteService)
	cName, err := net.LookupCNAME(quoteService)

	if err != nil {
		log.Fatal(err)
	}

	log.Printf("CNAME for %s was %s", quoteService, cName)

	url := fmt.Sprintf("https://%s/qod", cName)

	resp, err := resty.R().Get(url)

	if err != nil {
		log.Fatal(err)
		panic(err)
	}

	w.Write(resp.Body())
}
