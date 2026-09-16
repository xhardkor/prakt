#!/bin/bash 
set -eux

DIRL=$(dirname "$0")
DIRF="$DIRL/docker-compose.yml"
cleanup() {
  docker compose -f $DIRF down -v
  docker image rm -f entry_list_app
  rm -rf $DIRL/node_modules
}

trap cleanup EXIT
COMPOSE_PROGRESS=plain docker compose -f $DIRF up
