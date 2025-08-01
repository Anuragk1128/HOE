#!/bin/bash

echo "🚀 Setting up GitHub repository for deployment..."

echo ""
echo "📝 Please follow these steps:"
echo ""
echo "1. Go to https://github.com and create a new repository"
echo "   - Name it something like 'house-of-evolve-backend' or 'improved-ecommerce'"
echo "   - Make it public or private (your choice)"
echo "   - Don't initialize with README, .gitignore, or license (we already have these)"
echo ""
echo "2. After creating the repository, GitHub will show you commands like:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Replace YOUR_USERNAME and YOUR_REPO_NAME with your actual values"
echo ""
echo "4. Run those commands in this terminal"
echo ""
echo "5. Once pushed to GitHub, you can deploy to Render:"
echo "   - Go to https://render.com"
echo "   - Create a new Web Service"
echo "   - Connect your GitHub repository"
echo "   - Set root directory to 'backend'"
echo "   - Add environment variables"
echo "   - Deploy!"
echo ""

read -p "Press Enter when you've created the GitHub repository and are ready to add the remote..."

echo "✅ Ready to add remote and push to GitHub!"
echo "Please run the git commands shown by GitHub after creating your repository." 