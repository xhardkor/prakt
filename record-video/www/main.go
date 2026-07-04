package main
import (
  "fmt"
  "net/http"
)

var PORT = 8000
func main() {
  fs := http.FileServer(http.Dir("./"))
  http.Handle("/", fs)
  fmt.Printf("Server Started on %d", PORT)
  if err := http.ListenAndServe(fmt.Sprintf("0.0.0.0:%d", PORT), nil); err != nil {
    fmt.Println("Error: ", err)
  }
}
