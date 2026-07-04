#!/bin/bash 
set -eux

export POSTGRES_HOST=localhost
COMPOSE_PROGRESS=plain docker compose up
