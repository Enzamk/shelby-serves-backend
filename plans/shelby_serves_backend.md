# Shelby Serves Backend Implementation Plan

## Project Structure
```
src/
  server.js
  config/
    db.js
    cloudinary.js
  routes/
    videoRoutes.js
  controllers/
    videoController.js
  models/
    Video.js
  jobs/
    videoJobs.js
```

## Dependencies to Install
```bash
dotenv cors express mongoose cloudinary multer inngest
```

## Environment Variables (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shelby_serves
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
INNGEST_EVENT_KEY=your_inngest_event_key
```

## File Implementation Details

### 1. `src/server.js`
- Setup Express server
- Load environment variables
- Configure middleware (cors, json)
- Connect to MongoDB
- Mount routes
- Start server

### 2. `src/config/db.js`
- MongoDB connection using Mongoose
- Connection error handling

### 3. `src/config/cloudinary.js`
- Cloudinary configuration with credentials
- Export Cloudinary instance

### 4. `src/models/Video.js`
```javascript
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  public_id: { type: String, required: true },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
```

### 5. `src/routes/videoRoutes.js`
```javascript
router.post('/upload', upload.single('video'), uploadVideo);
router.get('/', getVideos);
router.post('/view/:id', incrementViews);
```

### 6. `src/controllers/videoController.js`
- `uploadVideo`: Handle Multer upload, send to Cloudinary, save to DB
- `getVideos`: Retrieve all videos from DB
- `incrementViews`: Find video by ID and increment views

### 7. `src/jobs/videoJobs.js`
- Background jobs for video processing using Inngest
- Example: Transcoding, thumbnail generation

## Deployment Configuration

We'll use Insforge for deployment. Add the following to `insforge.yml`:
```yaml
service: shelby-serves-backend
runtime: nodejs18

build:
  commands:
    - npm install

start:
  command: node src/server.js

env:
  - PORT
  - MONGODB_URI
  - CLOUDINARY_CLOUD_NAME
  - CLOUDINARY_API_KEY
  - CLOUDINARY_API_SECRET
  - INNGEST_EVENT_KEY
```

## Backend Deployment Preparation

1. **Add start script** to `package.json`:
```json
"scripts": {
  "start": "node src/server.js"
}
```

2. **Use process.env.PORT** in `src/server.js`:
```javascript
const port = process.env.PORT || 5000;
```

3. **MongoDB Atlas connection** in `src/config/db.js`:
```javascript
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
```

4. **Secure environment variables** by:
   - Adding `.env` to `.gitignore`
   - Setting variables in Insforge dashboard

## Frontend Deployment Preparation

1. **Vite build configuration** (`vite.config.js`):
```javascript
export default {
  build: {
    outDir: 'dist',
  }
};
```

2. **Set API base URL** using environment variables:
```javascript
// In frontend code
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

3. **Build script** in `package.json`:
```json
"scripts": {
  "build": "vite build"
}
```

## Deployment Steps

1. **Backend Deployment**:
   - Push code to repository
   - Connect repository to Insforge
   - Set environment variables in dashboard
   - Trigger deployment

2. **Frontend Deployment**:
   - Run `npm run build`
   - Deploy `dist` folder to static hosting
   - Set `VITE_API_BASE_URL` to production backend URL

## Environment Variables Setup

Required variables:
```env
# Backend
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/shelby_serves
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
INNGEST_EVENT_KEY=your_inngest_key

# Frontend
VITE_API_BASE_URL=https://api.shelbyserves.com
```

## Common Errors & Fixes

1. **Connection Refused**:
   - Verify MongoDB Atlas IP whitelisting
   - Check firewall settings

2. **Missing Environment Variables**:
   - Ensure all variables are set in Insforge dashboard
   - Verify variable names match code

3. **CORS Errors**:
   - Configure CORS middleware to accept frontend domain
   - Verify frontend API base URL

## Next Steps
1. Switch to Code mode to implement the files
2. Create .env file with actual credentials
3. Test endpoints with Postman
4. Build frontend with Vite
5. Deploy both backend and frontend using Insforge