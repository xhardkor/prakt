#!/bin/bash 
set -eux

cleanup() {
  #docker compose rm -fsv
  docker compose down -v
}

trap cleanup EXIT
export POSTGRES_HOST=localhost
COMPOSE_PROGRESS=plain docker compose up
