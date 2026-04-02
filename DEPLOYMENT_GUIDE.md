# Shelby Serves - Deployment Guide

This guide provides step-by-step instructions for deploying the Shelby Serves full-stack application to production.

---

## 📋 Prerequisites

- GitHub account
- Render account (free tier available)
- Vercel account (free tier available)
- MongoDB Atlas account (free tier available)
- Cloudinary account (free tier available)

---

## 🚀 Backend Deployment (Render)

### 1. Prepare Backend Code

The backend is already configured with:
- **PORT support**: Uses `process.env.PORT || 5000`
- **CORS enabled**: Allows requests from `process.env.CLIENT_URL` or any origin
- **MongoDB env variable**: Uses `process.env.MONGO_URI`
- **Start script**: `"start": "node src/server.js"`

### 2. Push Backend to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Prepare backend for deployment"

# Create a new repository on GitHub and add remote
git remote add origin https://github.com/YOUR_USERNAME/shelby-serves-backend.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Deploy on Render

1. Go to [render.com](https://render.com) and sign in
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `shelby-serves-backend`
   - **Region**: Choose nearest region
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click **Advanced** → **Environment Variables** and add:

| Variable | Value | Description |
|----------|-------|-------------|
| `MONGO_URI` | Your MongoDB connection string | MongoDB Atlas connection |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret | From Cloudinary dashboard |
| `CLIENT_URL` | Your frontend URL (add after frontend deploy) | e.g., `https://your-frontend.vercel.app` |

6. Click **Create Web Service**

### 4. Get Your Backend URL

After deployment completes, Render will provide a URL like:
```
https://shelby-serves-backend.onrender.com
```

**Save this URL** - you'll need it for the frontend deployment.

---

## 🎨 Frontend Deployment (Vercel)

### 1. Prepare Frontend Code

The frontend is already configured with:
- **Environment variable support**: Uses `import.meta.env.VITE_API_URL`
- **API client**: Configured in `src/frontend/src/api/index.js`

### 2. Push Frontend to GitHub

```bash
# Navigate to frontend directory
cd src/frontend

# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Prepare frontend for deployment"

# Create a new repository on GitHub and add remote
git remote add origin https://github.com/YOUR_USERNAME/shelby-serves-frontend.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (or adjust if needed)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Environment Variables** and add:

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | Your backend URL from Render | e.g., `https://shelby-serves-backend.onrender.com` |

6. Click **Deploy**

### 4. Get Your Frontend URL

After deployment completes, Vercel will provide a URL like:
```
https://your-frontend.vercel.app
```

---

## 🔗 Update Backend CORS

After your frontend is deployed, update the backend's `CLIENT_URL` environment variable:

1. Go to your Render dashboard
2. Open your `shelby-serves-backend` service
3. Go to **Environment** section
4. Update `CLIENT_URL` to your Vercel URL:
   ```
   https://your-frontend.vercel.app
   ```
5. Click **Save Changes** (this will trigger a redeploy)

---

## ✅ Verification

### Test Backend

```bash
# Test health endpoint (if available)
curl https://shelby-serves-backend.onrender.com/api/videos

# Or visit in browser:
https://shelby-serves-backend.onrender.com/api/videos
```

### Test Frontend

1. Visit your Vercel URL
2. Try uploading a video
3. Verify video playback works
4. Check browser console for any errors

---

## 📝 Environment Variables Reference

### Backend (Render)

| Variable | Required | Example |
|----------|----------|---------|
| `MONGO_URI` | Yes | `mongodb+srv://user:pass@cluster.mongodb.net/shelby` |
| `CLOUDINARY_CLOUD_NAME` | Yes | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Yes | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Yes | `your-secret-key` |
| `CLIENT_URL` | Yes | `https://your-frontend.vercel.app` |
| `PORT` | Optional | `5000` (Render sets this automatically) |

### Frontend (Vercel)

| Variable | Required | Example |
|----------|----------|---------|
| `VITE_API_URL` | Yes | `https://shelby-serves-backend.onrender.com` |

---

## 🔧 Troubleshooting

### Backend Issues

**Issue**: Server won't start
- Check Render logs for errors
- Verify all environment variables are set correctly
- Ensure MongoDB connection string is valid

**Issue**: CORS errors
- Verify `CLIENT_URL` matches your frontend URL exactly
- Check that CORS is configured correctly in `src/server.js`

### Frontend Issues

**Issue**: API calls failing
- Verify `VITE_API_URL` is set correctly
- Check browser console for CORS errors
- Ensure backend is deployed and running

**Issue**: Build fails
- Check Vercel build logs
- Verify all dependencies are in `package.json`

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

---

## 🎉 Deployment Complete!

Your Shelby Serves application is now live! Users can:
- Upload videos through the frontend
- Stream videos from Cloudinary
- View video statistics
- Manage their video library

For any issues or questions, refer to the troubleshooting section above.
