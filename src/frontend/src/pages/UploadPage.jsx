import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api';
import { UploadCloud, FileVideo } from 'lucide-react';

export default function UploadPage() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !file) return;
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('video', file);
      
      const response = await api.uploadVideo(formData);
      console.log('Upload response:', response);
      toast.success('Video uploaded successfully!');
      // Trigger dashboard update
      window.dispatchEvent(new Event('videoUploaded'));
      setTitle('');
      setFile(null);
    } catch (error) {
      console.error('Upload failed:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || 'Upload failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Upload Video</h1>
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200/60 rounded-2xl shadow-md p-8 space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Video Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Enter video title..."
            required
          />
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Video File</label>
          <div className="relative">
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              required
            />
            <FileVideo className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          </div>
          {file && (
            <p className="mt-2 text-sm text-slate-600">
              Selected: <span className="font-medium">{file.name}</span>
            </p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isUploading}
          className={`w-full py-3 px-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all ${
            isUploading
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
          }`}
        >
          {isUploading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </>
          ) : (
            <>
              <UploadCloud className="w-5 h-5" />
              Upload Video
            </>
          )}
        </button>
      </form>
    </div>
  );
}