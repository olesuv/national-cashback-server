package main

import (
	"log"
	"os"

	"github.com/lpernett/godotenv"
)

func loadConfigs() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("error loading .env file")
	}
}

type Configs struct {
	addr   string
	port   string
	db_url string
}

func getConfigs() *Configs {
	return &Configs{
		addr:   os.Getenv("ADDR"),
		port:   os.Getenv("PORT"),
		db_url: os.Getenv("DB_URL"),
	}
}
