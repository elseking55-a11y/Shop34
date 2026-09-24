import React from 'react';
import { Image as ImageIcon, Video, X } from 'lucide-react';

interface MediaUploaderProps {
  images: string[];
  videoUrl?: string;
  onImagesChange: (images: string[]) => void;
  onVideoChange: (videoUrl: string) => void;
}

export default function MediaUploader({ 
  images, 
  videoUrl, 
  onImagesChange, 
  onVideoChange 
}: MediaUploaderProps) {
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    
    if (images.length + files.length > 5) {
      alert('You can only upload up to 5 images.');
      return;
    }

    Promise.all(files.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    })).then(base64Images => {
      onImagesChange([...images, ...base64Images]);
    });
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onVideoChange(url);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const removeVideo = () => {
    onVideoChange('');
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
      {/* Upload Image Button */}
      {images.length < 5 && (
        <label className="border-2 border-dashed border-amber-900/20 rounded-xl aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-amber-50 hover:border-orange-500 transition-colors">
          <ImageIcon className="text-amber-900/40 mb-2" />
          <span className="text-xs font-bold text-amber-950">Add Image</span>
          <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
        </label>
      )}

      {/* Upload Video Button */}
      {!videoUrl && (
        <label className="border-2 border-dashed border-amber-900/20 rounded-xl aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-amber-50 hover:border-orange-500 transition-colors">
          <Video className="text-amber-900/40 mb-2" />
          <span className="text-xs font-bold text-amber-950">Add Video</span>
          <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
        </label>
      )}

      {/* Image Previews */}
      {images.map((img, index) => (
        <div key={index} className="relative aspect-square rounded-xl overflow-hidden group border border-amber-900/10">
          <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
          <button 
            type="button" 
            onClick={() => removeImage(index)}
            className="absolute top-2 right-2 bg-white/90 text-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
          >
            <X size={14} />
          </button>
        </div>
      ))}

      {/* Video Preview */}
      {videoUrl && (
        <div className="relative aspect-square rounded-xl overflow-hidden group border border-amber-900/10 bg-black flex items-center justify-center">
          <video src={videoUrl} autoPlay muted loop playsInline className="w-full h-full object-cover opacity-80" />
          <button 
            type="button" 
            onClick={removeVideo}
            className="absolute top-2 right-2 bg-white/90 text-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 z-10"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
