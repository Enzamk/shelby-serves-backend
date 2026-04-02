import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String },
  views: { type: Number, default: 0 },
  category: { type: String },
}, { timestamps: true });

const Video = mongoose.model('Video', videoSchema);
export default Video;
