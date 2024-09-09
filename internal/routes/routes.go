package routes

import (
	"fmt"
	"net/http"
)

func InitRoutes() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/", indexHandler)
	return mux
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "hello noobies")
}
