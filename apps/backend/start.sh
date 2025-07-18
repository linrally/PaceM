#!/bin/sh

docker run --rm -it \
  --name pacem-backend \
  -p 8000:8000 \
  pacem-backend