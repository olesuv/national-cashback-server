package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/olesuv/national-cashback-app/internal/db"
	"github.com/olesuv/national-cashback-app/internal/routes"
)

var configs *Configs
var dbManager *db.DBManager
var router http.Handler

func init() {
	loadConfigs()
	configs = getConfigs()

	dbManager = db.DBManagerInit(configs.db_url)
	router = routes.InitRoutes()
}

func main() {
	defer dbManager.Close()

	apiLink := fmt.Sprintf("%s:%s", configs.addr, configs.port)

	log.Printf("server started on http://%s", apiLink)
	err := http.ListenAndServe(apiLink, router)
	if err != nil {
		panic(err)
	}
}
