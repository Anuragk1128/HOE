#!/bin/bash

echo "🚀 Starting build process..."

# Ensure we're using npm
echo "📦 Ensuring npm is used..."
npm --version

# Clear any existing node_modules
echo "🧹 Cleaning previous installation..."
rm -rf node_modules package-lock.json

# Install dependencies with npm
echo "📦 Installing dependencies with npm..."
npm install

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create a build completion marker
echo "Build completed at $(date)" > build-complete.txt

echo "✅ Build process completed successfully!" 