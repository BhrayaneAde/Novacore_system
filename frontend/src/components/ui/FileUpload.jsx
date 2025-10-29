import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';

const FileUpload = ({ 
  onUpload, 
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB
  multiple = false,
  className = ''
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(file => {
      if (maxSize && file.size > maxSize) {
        alert(`File ${file.name} is too large. Max size: ${maxSize / 1024 / 1024}MB`);
        return false;
      }
      return true;
    });

    if (onUpload) {
      onUpload(multiple ? validFiles : validFiles[0]);
    }
  };

  return (
    <div className={`flex items-center justify-center w-full ${className}`}>
      <label
        htmlFor="dropzone-file"
        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          isDragOver 
            ? 'border-secondary-500 bg-secondary-50' 
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        } dark:hover:bg-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {accept.includes('image') ? 'SVG, PNG, JPG or GIF' : 'Files'} (MAX. {maxSize / 1024 / 1024}MB)
          </p>
        </div>
        <input
          id="dropzone-file"
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
        />
      </label>
    </div>
  );
};

export default FileUpload;