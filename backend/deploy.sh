#!/bin/bash

# Deployment script for House of Evolve Backend
echo "🚀 Starting deployment preparation..."

# Check if all required files exist
echo "📋 Checking required files..."

if [ ! -f "package.json" ]; then
    echo "❌ package.json not found!"
    exit 1
fi

if [ ! -f "server.js" ]; then
    echo "❌ server.js not found!"
    exit 1
fi

echo "✅ All required files found"

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Please create one with the following variables:"
    echo "   MONGODB_URI=your_mongodb_connection_string"
    echo "   JWT_SECRET=your_jwt_secret"
    echo "   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name"
    echo "   CLOUDINARY_API_KEY=your_cloudinary_api_key"
    echo "   CLOUDINARY_API_SECRET=your_cloudinary_api_secret"
    echo "   NODE_ENV=production"
    echo "   PORT=5000"
fi

echo "✅ Deployment preparation complete!"
echo ""
echo "📝 Next steps:"
echo "1. Push your code to GitHub"
echo "2. Go to https://render.com"
echo "3. Create a new Web Service"
echo "4. Connect your GitHub repository"
echo "5. Set the root directory to 'backend'"
echo "6. Add all environment variables"
echo "7. Deploy!"
echo ""
echo "🔗 Your API will be available at: https://your-app-name.onrender.com"
echo "📚 API Documentation: https://your-app-name.onrender.com/api-docs"
echo "🏥 Health Check: https://your-app-name.onrender.com/health" 