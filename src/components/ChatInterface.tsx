// src/components/ChatInterface.tsx
import React, { useState } from 'react';
import './ChatInterface.css';

interface ChatInterfaceProps {
  onChatSubmit: (message: string) => void;
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onChatSubmit, isLoading }) => {
  const [message, setMessage] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onChatSubmit(message);
      setMessage('');
    }
  };

  return (
    <div className="chat-interface">
      <h2>Ask a Question</h2>
      <form onSubmit={handleSubmit} className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about soil, weather, or crop management..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !message.trim()}>
          {isLoading ? 'Processing...' : 'Send'}
        </button>
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