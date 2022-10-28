#! /bin/bash

# Set current working directory to script directory
cd "${0%/*}"

sleep 2 && open http://localhost:1313 &
hugo serve
