package main
import (
"fmt"
"net/http"
)
func main() {
  fs := http.FileServer(http.Dir("../www"))
  http.Handle("/", fs)
  fmt.Println("Server Started")
  if err := http.ListenAndServe("0.0.0.0:8080", nil); err != nil {
    fmt.Println("Error: ", err)
  }
}
