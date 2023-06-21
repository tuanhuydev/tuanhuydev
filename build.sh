#!/bin/bash

# Stop and remove the existing containers
docker-compose down

# Build and start the containers in detached mode
docker-compose up -d

