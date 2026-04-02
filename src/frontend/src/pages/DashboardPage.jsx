import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import {
  Video,
  Eye,
  TrendingUp,
  Trash2
} from 'lucide-react';
import Skeleton from '../components/Skeleton';

export default function DashboardPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const navigate = useNavigate();

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await api.getVideos();
      setVideos(response.data);
      setLoading(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch videos';
      setError(errorMessage);
      setLoading(false);
      console.error('Error fetching videos:', err);
      console.error('Error response:', err.response);
    }
  };

  const handleDeleteVideo = async (videoId, videoTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${videoTitle}"?`)) {
      return;
    }

    try {
      await api.deleteVideo(videoId);
      toast.success('Video deleted successfully');
      // Remove video from UI instantly
      setVideos(videos.filter(video => video._id !== videoId));
    } catch (err) {
      console.error('Error deleting video:', err);
      toast.error(err.response?.data?.message || 'Failed to delete video');
    }
  };

  const handleThumbnailClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  const handleImageLoad = (videoId) => {
    setLoadedImages(prev => ({ ...prev, [videoId]: true }));
  };

  useEffect(() => {
    fetchVideos();
    
    // Add event listener for video uploads
    const handleVideoUploaded = () => fetchVideos();
    window.addEventListener('videoUploaded', handleVideoUploaded);
    
    return () => {
      window.removeEventListener('videoUploaded', handleVideoUploaded);
    };
  }, []);

  // Calculate statistics
  const totalVideos = videos.length;
  const totalViews = videos.reduce((total, video) => total + (video.views || 0), 0);
  const trendingVideos = [...videos]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 3);

  // Prepare data for charts
  const barChartData = videos.map(video => ({
    name: video.title,
    views: video.views || 0
  }));

  const uploadsByDate = {};
  videos.forEach(video => {
    const date = new Date(video.createdAt).toISOString().split('T')[0];
    uploadsByDate[date] = (uploadsByDate[date] || 0) + 1;
  });
  const lineChartData = Object.entries(uploadsByDate)
    .map(([date, count]) => ({ date, uploads: count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  if (loading) {
    return (
      <div className="bg-slate-50">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Dashboard</h1>
        
        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-md p-8">
              <div className="flex items-center justify-between mb-4">
                <Skeleton variant="text" className="w-24" />
                <Skeleton variant="avatar" className="w-5 h-5" />
              </div>
              <Skeleton variant="title" className="w-20" />
            </div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white border border-slate-200/60 rounded-2xl shadow-md p-6">
                <Skeleton variant="title" className="w-32 mb-4" />
                <Skeleton variant="card" className="h-64" />
              </div>
            ))}
          </div>
        </div>

        {/* Trending Videos Skeleton */}
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Trending Videos</h2>
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-slate-200/60 rounded-2xl shadow-md p-6 mb-4">
              <div className="flex gap-4 items-center">
                <Skeleton variant="thumbnail" className="w-48 h-28 flex-shrink-0" />
                <div className="flex-1 min-w-0 space-y-2">
                  <Skeleton variant="title" className="w-3/4" />
                  <Skeleton variant="text" className="w-1/2" />
                  <Skeleton variant="text" className="w-1/3" />
                </div>
                <Skeleton variant="avatar" className="w-10 h-10 flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>

        {/* All Videos Skeleton */}
        <div>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">All Videos</h2>
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-slate-200/60 rounded-2xl shadow-md p-6 mb-4">
              <div className="flex gap-4 items-center">
                <Skeleton variant="thumbnail" className="w-48 h-28 flex-shrink-0" />
                <div className="flex-1 min-w-0 space-y-2">
                  <Skeleton variant="title" className="w-3/4" />
                  <Skeleton variant="text" className="w-1/2" />
                  <Skeleton variant="text" className="w-1/3" />
                </div>
                <Skeleton variant="avatar" className="w-10 h-10 flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Dashboard</h1>
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-md p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Videos</h2>
            <Video className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-5xl font-bold text-slate-900">{totalVideos}</p>
        </div>
        <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-md p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Views</h2>
            <Eye className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-5xl font-bold text-slate-900">{totalViews}</p>
        </div>
        <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-md p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Trending Videos</h2>
            <TrendingUp className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-5xl font-bold text-slate-900">{trendingVideos.length}</p>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="mb-8">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Analytics</h2>
        {videos.length === 0 ? (
          <p className="text-slate-600">No video data available for analytics.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bar Chart for Views per Video */}
            <div className="bg-white border border-slate-200/60 rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Views per Video</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      padding: '12px'
                    }}
                    itemStyle={{ color: '#1e293b', fontWeight: '500' }}
                    labelStyle={{ color: '#64748b', fontWeight: '500' }}
                  />
                  <Legend />
                  <Bar
                    dataKey="views"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Line Chart for Uploads over Time */}
            <div className="bg-white border border-slate-200/60 rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Uploads over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      padding: '12px'
                    }}
                    itemStyle={{ color: '#1e293b', fontWeight: '500' }}
                    labelStyle={{ color: '#64748b', fontWeight: '500' }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="uploads"
                    stroke="#6366f1"
                    strokeWidth={2}
                    activeDot={{ r: 6, fill: '#6366f1', stroke: '#6366f1' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Trending Videos Section */}
      <div className="mb-8">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Trending Videos</h2>
        {trendingVideos.length > 0 ? (
          <div className="space-y-4">
            {trendingVideos.map(video => (
              <div key={video._id} className="bg-white border border-slate-200/60 rounded-2xl shadow-md p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <div className="flex gap-4 items-center">
                  {/* Thumbnail */}
                  <div
                    onClick={() => handleThumbnailClick(video._id)}
                    className="flex-shrink-0 cursor-pointer relative"
                  >
                    {!loadedImages[video._id] && (
                      <Skeleton variant="thumbnail" className="w-48 h-28 absolute inset-0" />
                    )}
                    <img
                      src={video.thumbnailUrl || "https://via.placeholder.com/400x250?text=No+Thumbnail"}
                      alt={video.title}
                      onLoad={() => handleImageLoad(video._id)}
                      className={`w-48 h-28 aspect-video object-cover rounded-lg hover:scale-105 transition-all duration-300 ${
                        loadedImages[video._id] ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  </div>

                  {/* Video Info */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/video/${video._id}`}>
                      <h3 className="text-lg font-semibold text-slate-900 truncate hover:text-indigo-600 transition-colors">
                        {video.title}
                      </h3>
                    </Link>
                    <p className="text-slate-500 text-sm mt-1">Views: {video.views || 0}</p>
                    <p className="text-slate-500 text-sm">
                      Uploaded on: {new Date(video.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteVideo(video._id, video.title)}
                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 flex-shrink-0 relative group"
                    title="Delete video"
                  >
                    <Trash2 className="w-5 h-5" />
                    <div className="absolute left-14 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg z-10">
                      Remove permanently
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-600">No trending videos found</p>
        )}
      </div>

      {/* All Videos Section */}
      <div>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">All Videos</h2>
        {videos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-slate-600 mb-4">No videos found. Upload your first video to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {videos.map(video => (
              <div key={video._id} className="bg-white border border-slate-200/60 rounded-2xl shadow-md p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <div className="flex gap-4 items-center">
                  {/* Thumbnail */}
                  <div
                    onClick={() => handleThumbnailClick(video._id)}
                    className="flex-shrink-0 cursor-pointer relative"
                  >
                    {!loadedImages[video._id] && (
                      <Skeleton variant="thumbnail" className="w-48 h-28 absolute inset-0" />
                    )}
                    <img
                      src={video.thumbnailUrl || "https://via.placeholder.com/400x250?text=No+Thumbnail"}
                      alt={video.title}
                      onLoad={() => handleImageLoad(video._id)}
                      className={`w-48 h-28 aspect-video object-cover rounded-lg hover:scale-105 transition-all duration-300 ${
                        loadedImages[video._id] ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  </div>

                  {/* Video Info */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/video/${video._id}`}>
                      <h3 className="text-lg font-semibold text-slate-900 truncate hover:text-indigo-600 transition-colors">
                        {video.title}
                      </h3>
                    </Link>
                    <p className="text-slate-500 text-sm mt-1">Views: {video.views || 0}</p>
                    <p className="text-slate-500 text-sm">
                      Uploaded on: {new Date(video.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteVideo(video._id, video.title)}
                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 flex-shrink-0 relative group"
                    title="Delete video"
                  >
                    <Trash2 className="w-5 h-5" />
                    <div className="absolute left-14 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg z-10">
                      Remove permanently
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
