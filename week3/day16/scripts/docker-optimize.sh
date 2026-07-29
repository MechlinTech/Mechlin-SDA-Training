#!/bin/sh

echo "Removing unused Docker resources..."
docker system prune -f

echo "Optimization completed."
