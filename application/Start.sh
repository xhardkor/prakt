#!/bin/bash 
set -eux

DIRL=$(dirname "$0")
DIRF="$DIRL/docker-compose.yml"
COMPOSE_PROGRESS=plain docker compose -f $DIRF up
