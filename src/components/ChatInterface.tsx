// src/components/ChatInterface.tsx
import React, { useState } from 'react';
import './ChatInterface.css';

interface ChatInterfaceProps {
  onChatSubmit: (message: string, imageUrl?: string) => void;
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onChatSubmit, isLoading }) => {
  const [message, setMessage] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [showImageInput, setShowImageInput] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onChatSubmit(message, imageUrl.trim() || undefined);
      setMessage('');
      setImageUrl('');
      setShowImageInput(false);
    }
  };

  return (
    <div className="chat-interface">
      <h2>Ask a Question</h2>
      <form onSubmit={handleSubmit} className="chat-form">
        <div className="chat-input-row">
          <input
            type="text"
            className="main-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about soil, weather, disease, or pests..."
            disabled={isLoading}
          />
          <button
            type="button"
            className="toggle-img-btn"
            onClick={() => setShowImageInput(!showImageInput)}
            title="Attach Image URL"
          >
            🖼️
          </button>
          <button type="submit" className="submit-btn" disabled={isLoading || !message.trim()}>
            {isLoading ? 'Processing...' : 'Send'}
          </button>
        </div>
        {showImageInput && (
          <div className="image-input-row">
            <input
              type="url"
              className="url-input"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Paste an image URL (e.g. http://localhost:8081/leaf.jpg)"
              disabled={isLoading}
            />
            {imageUrl && (
              <img src={imageUrl} alt="Preview" className="img-preview" onError={(e) => (e.currentTarget.style.display = 'none')} onLoad={(e) => (e.currentTarget.style.display = 'block')} />
            )}
          </div>
        )}
      </form>
      
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;