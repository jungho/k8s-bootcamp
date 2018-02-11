package main

//Create a docker image that contains a service that integrates with the
//following stock quote API - https://api.iextrading.com/1.0/stock/aapl/quote.
//You can use any technology you wish.
//Bonus: Implement your service so that you can pass any stock symbol as query string parameter.
import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	resty "gopkg.in/resty.v1"
)

func main() {

	log.Println("Starting up stock-quote api...")
	router := mux.NewRouter()
	router.HandleFunc("/stock-quote", getStockQuote).Methods("GET")
	log.Fatal(http.ListenAndServe(":8000", router))
}

func getStockQuote(w http.ResponseWriter, r *http.Request) {
	quoteService := os.Getenv("STOCK_QUOTE_SERVICE")
	symbol := r.URL.Query().Get("symbol")

	if len(symbol) == 0 {
		symbol = "aapl"
	}

	log.Printf("Getting stock quote for %s from %s\n",
		symbol, r.RemoteAddr)

	url := fmt.Sprintf("%s/%s/quote", quoteService, symbol)

	log.Println(url)

	resp, err := resty.R().Get(url)

	if err != nil {
		log.Fatal(err)
		panic(err)
	}

	w.Write(resp.Body())
}
