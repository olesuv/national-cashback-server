package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/olesuv/national-cashback-app/internal/routes"
)

var configs *Configs

func init() {
	loadConfigs()
	configs = getConfigs()
}

func main() {
	router := routes.InitRoutes()

	apiLink := fmt.Sprintf("%s:%s", configs.addr, configs.port)

	log.Printf("server started on http://%s", apiLink)
	err := http.ListenAndServe(apiLink, router)
	if err != nil {
		panic(err)
	}
}
