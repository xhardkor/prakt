package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
)

var PORT = 8000
func main() {
  fs := http.FileServer(http.Dir("./front/"))
  http.Handle("/", fs)

  http.HandleFunc("/cameras", getCams)

  fmt.Printf("Server Started on %d\n", PORT)
  if err := http.ListenAndServe(fmt.Sprintf("0.0.0.0:%d", PORT), nil); err != nil {
    fmt.Println("Error: ", err)
  }
}

func getCams(w http.ResponseWriter, r *http.Request) {
  file, err := os.Open("../.conf")
  if err != nil {
    http.Error(w, "Error File Open: ", http.StatusInternalServerError)
    return
  }
  defer file.Close()

  cams := make(map[string]string)
  scanner := bufio.NewScanner(file)

  for scanner.Scan() {
    fields := strings.Fields(scanner.Text())
    if len(fields) != 2 {
      return
    }
    cams[fields[0]] = fields[1]
  }
  if err := scanner.Err(); err != nil {
    http.Error(w, "Error Scanner: ", http.StatusInternalServerError)
    return
  }
  if err := json.NewEncoder(w).Encode(cams); err != nil {
    http.Error(w, "Error Encode: ", http.StatusInternalServerError)
    return
  }
}
