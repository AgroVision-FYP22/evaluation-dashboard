// src/components/ChatInterface.tsx
import React, { useRef, useState } from 'react';
import { ApiError, apiClient } from '../services/apiClient';
import './ChatInterface.css';

interface ChatInterfaceProps {
  onChatSubmit: (message: string, imageUrl?: string) => void;
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onChatSubmit, isLoading }) => {
  const [message, setMessage] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    setSelectedFile(file);
    setUploadError(null);
    // Generate a local object URL for the thumbnail preview.
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    // Reset the input so the same file can be re-selected after removal.
    e.target.value = '';
  };

  const handleRemoveImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    let imageUrl: string | undefined;

    if (selectedFile) {
      setIsUploading(true);
      setUploadError(null);
      try {
        imageUrl = await apiClient.uploadImage(selectedFile);
      } catch (err) {
        setUploadError(err instanceof ApiError ? err.message : 'Image upload failed.');
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    onChatSubmit(message, imageUrl);
    setMessage('');
    handleRemoveImage();
  };

  const isBusy = isLoading || isUploading;

  return (
    <div className="chat-interface">
      <h2>Ask a Question</h2>
      <form onSubmit={handleSubmit} className="chat-form">

        {/* Image preview strip — shown only when a file is selected */}
        {selectedFile && previewUrl && (
          <div className="image-preview-strip">
            <img src={previewUrl} alt="Selected" className="img-thumbnail" />
            <div className="img-meta">
              <span className="img-name">{selectedFile.name}</span>
              <span className="img-size">
                ({(selectedFile.size / 1024).toFixed(0)} KB)
              </span>
            </div>
            <button
              type="button"
              className="remove-img-btn"
              onClick={handleRemoveImage}
              title="Remove image"
              disabled={isBusy}
            >
              ✕
            </button>
          </div>
        )}

        {uploadError && (
          <div className="upload-error">{uploadError}</div>
        )}

        <div className="chat-input-row">
          <input
            type="text"
            className="main-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about soil, weather, disease, or pests…"
            disabled={isBusy}
          />

          {/* Hidden native file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: 'none' }}
            onChange={handleFileChange}
            disabled={isBusy}
          />

          <button
            type="button"
            className={`toggle-img-btn${selectedFile ? ' has-image' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            title={selectedFile ? 'Replace image' : 'Attach an image'}
            disabled={isBusy}
          >
            🖼️
          </button>

          <button
            type="submit"
            className="submit-btn"
            disabled={isBusy || !message.trim()}
          >
            {isUploading ? 'Uploading…' : isLoading ? 'Processing…' : 'Send'}
          </button>
        </div>
      </form>

      {isBusy && (
        <div className="loading-overlay">
          <div className="loading-spinner" />
        </div>
      )}
    </div>
  );
};

export default ChatInterface;