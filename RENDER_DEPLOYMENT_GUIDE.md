# 🚀 Render Deployment Guide

Your backend is now ready for deployment! Follow these steps to deploy to Render:

## Step 1: Go to Render
1. Visit [render.com](https://render.com)
2. Sign up/Login with your GitHub account
3. Click "New +" → "Web Service"

## Step 2: Connect Your Repository
1. Click "Connect a repository"
2. Select your repository: `Anuragk1128/HOE`
3. Click "Connect"

## Step 3: Configure the Service
Fill in these details:

- **Name**: `house-of-evolve-backend`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `dev` (or `main` if you prefer)
- **Root Directory**: `backend` ⚠️ **IMPORTANT**
- **Build Command**: `npm install`
- **Start Command**: `npm start`

## Step 4: Set Environment Variables
Click "Advanced" → "Add Environment Variable" and add these:

### Required Variables:
```
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net
JWT_SECRET=your_secure_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=production
```

### How to get these values:

#### MongoDB URI:
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create/Select your cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password

#### JWT Secret:
Generate a secure random string:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Cloudinary Credentials:
1. Go to [Cloudinary](https://cloudinary.com)
2. Sign up/Login
3. Go to Dashboard
4. Copy your Cloud Name, API Key, and API Secret

## Step 5: Deploy
1. Click "Create Web Service"
2. Wait for the build to complete (usually 2-5 minutes)
3. Your API will be live at: `https://your-app-name.onrender.com`

## Step 6: Test Your Deployment
Once deployed, test these endpoints:

- **Health Check**: `https://your-app-name.onrender.com/health`
- **API Docs**: `https://your-app-name.onrender.com/api-docs`
- **Products**: `https://your-app-name.onrender.com/api/products`

## Step 7: Update Frontend (After Deployment)
Once your backend is deployed, update your frontend to use the new URL:

1. Go to `lib/products-service.ts`
2. Replace `http://localhost:5000` with your Render URL
3. Deploy your frontend

## Troubleshooting

### Common Issues:
1. **Build fails**: Check that all dependencies are in `package.json`
2. **Environment variables**: Make sure all required variables are set
3. **MongoDB connection**: Ensure your MongoDB cluster allows external connections
4. **CORS errors**: The backend is configured to accept all origins

### Check Logs:
- Go to your Render dashboard
- Click on your service
- Go to "Logs" tab to see any errors

## Your Repository Info:
- **GitHub**: https://github.com/Anuragk1128/HOE
- **Branch**: `dev`
- **Root Directory**: `backend`

## Next Steps After Deployment:
1. Test all API endpoints
2. Update frontend to use new backend URL
3. Deploy frontend to Vercel/Netlify
4. Set up custom domain (optional)

Good luck with your deployment! 🎉 