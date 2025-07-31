# Backend Deployment Guide for Render

## Environment Variables Required

Set these environment variables in your Render dashboard:

### Database Configuration
- `MONGODB_URI`: Your MongoDB connection string (e.g., `mongodb+srv://username:password@cluster.mongodb.net`)

### JWT Configuration
- `JWT_SECRET`: A secure random string for JWT token signing

### Cloudinary Configuration (for image uploads)
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret

### Server Configuration
- `NODE_ENV`: Set to `production` for deployment
- `PORT`: Render will automatically set this

## Deployment Steps

1. **Connect your GitHub repository to Render**
   - Go to [render.com](https://render.com)
   - Create a new Web Service
   - Connect your GitHub repository

2. **Configure the service**
   - **Name**: `house-of-evolve-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend` (if your backend is in a subdirectory)

3. **Set Environment Variables**
   - Add all the environment variables listed above in the Render dashboard
   - Make sure to use your actual values for MongoDB, JWT, and Cloudinary

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application

## API Endpoints

Once deployed, your API will be available at:
- Base URL: `https://your-app-name.onrender.com`
- API Documentation: `https://your-app-name.onrender.com/api-docs`

### Available Endpoints:
- `GET /` - Health check
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- And more...

## Important Notes

1. **MongoDB**: Make sure your MongoDB database is accessible from external connections
2. **CORS**: The backend is configured to accept requests from any origin in development. For production, you may want to restrict this to your frontend domain
3. **Free Tier Limitations**: Render's free tier has limitations on request timeouts and cold starts
4. **Environment Variables**: Never commit sensitive environment variables to your repository

## Troubleshooting

- Check the logs in Render dashboard if deployment fails
- Ensure all environment variables are set correctly
- Verify MongoDB connection string is correct
- Make sure all dependencies are listed in `package.json` 