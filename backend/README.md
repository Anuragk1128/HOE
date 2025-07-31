# House of Evolve Backend API

A Node.js/Express backend for the House of Evolve e-commerce platform.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd improved-ecommerce/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net
   JWT_SECRET=your_jwt_secret_key_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   NODE_ENV=development
   PORT=5000
   ```

4. **Start the development server**
   ```bash
   npm run server
   ```

## 📚 API Documentation

Once the server is running, you can access the API documentation at:
- **Local**: http://localhost:5000/api-docs
- **Production**: https://your-app-name.onrender.com/api-docs

## 🔗 API Endpoints

### Public Endpoints
- `GET /` - Health check
- `GET /health` - Detailed health check
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/search/:query` - Search products

### User Endpoints
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `GET /api/user/profile` - Get user profile (protected)
- `PUT /api/user/profile` - Update user profile (protected)

### Admin Endpoints
- `POST /api/admin/login` - Admin login
- `GET /api/admin/products` - Get all products (admin)
- `POST /api/admin/products` - Create product (admin)
- `PUT /api/admin/products/:id` - Update product (admin)
- `DELETE /api/admin/products/:id` - Delete product (admin)

## 🛠️ Development

### Scripts
- `npm start` - Start production server
- `npm run server` - Start development server with nodemon

### Project Structure
```
backend/
├── config/
│   ├── mongodb.js      # Database connection
│   └── cloudinary.js   # Cloudinary configuration
├── controllers/
│   ├── productController.js
│   ├── userController.js
│   └── adminController.js
├── middleware/
│   ├── auth.js         # JWT authentication
│   └── adminAuth.js    # Admin authentication
├── model/
│   ├── productModel.js
│   └── userModel.js
├── routes/
│   ├── productRoute.js
│   ├── userRoute.js
│   └── adminRoute.js
├── server.js           # Main server file
└── swagger.js          # API documentation
```

## 🚀 Deployment

### Render Deployment

1. **Prepare for deployment**
   ```bash
   ./deploy.sh
   ```

2. **Deploy to Render**
   - Go to [render.com](https://render.com)
   - Create a new Web Service
   - Connect your GitHub repository
   - Set root directory to `backend`
   - Add environment variables
   - Deploy!

### Environment Variables for Production

Set these in your Render dashboard:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A secure random string
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Your Cloudinary API key
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret
- `NODE_ENV` - Set to `production`

## 🔧 Configuration

### MongoDB
The application connects to MongoDB using the connection string in `MONGODB_URI`. Make sure your database is accessible from external connections.

### Cloudinary
For image uploads, configure your Cloudinary credentials in the environment variables.

### CORS
The application is configured to accept requests from any origin. For production, consider restricting this to your frontend domain.

## 📊 Monitoring

- **Health Check**: `GET /health` - Returns server status and timestamp
- **API Documentation**: Available at `/api-docs` with Swagger UI

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your `MONGODB_URI` is correct
   - Ensure your MongoDB cluster allows external connections

2. **JWT Errors**
   - Verify `JWT_SECRET` is set and consistent

3. **Image Upload Issues**
   - Check Cloudinary credentials are correct
   - Verify Cloudinary account is active

4. **CORS Errors**
   - The backend is configured to accept all origins
   - For production, consider restricting to specific domains

### Logs
Check the application logs in Render dashboard for detailed error information.

## 📝 License

This project is licensed under the ISC License. 