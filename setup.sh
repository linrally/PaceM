#!/bin/bash

echo "Installing Python dependencies..."
poetry install --with dev
pipx inject poetry poetry-plugin-shell

echo "Installing NodeJS dependencies..."
yarn install

echo "Building base Python image..."
make base

echo "✅ Setup complete! You can now run:"
echo "poetry shell      # Activate the virtual environment"
echo "yarn backend  # Start the backend server"
echo "yarn test         # Run tests"
echo "yarn start        # Start app"
echo "yarn ios      # Run iOS app"
echo "yarn android  # Run Android app"
echo "yarn run          # List all available scripts"
echo "make backend      # Build the backend image (also done automatically by docker-compose on yarn backend)"
