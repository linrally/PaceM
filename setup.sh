echo "Installing Python dependencies..."
poetry install

echo "Installing NodeJS dependencies..."
npm install

echo "Building base Python image..."
make base

echo "✅ Setup complete! You can now run:"
echo "poetry shell      # Activate the virtual environment"
echo "yarn run backend  # Start the backend server"
echo "yarn run          # List all available scripts"
