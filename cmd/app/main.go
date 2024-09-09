package main

import (
	"fmt"
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

	err := http.ListenAndServe(apiLink, router)
	if err != nil {
		panic(err)
	}
}
