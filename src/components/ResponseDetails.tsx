// src/components/ResponseDetails.tsx
import React from 'react';
import './ResponseDetails.css';

interface Citation {
  title: string;
  url: string;
  page: string;
}

interface ResponseDetailsProps {
  response: string;
  citations: Citation[];
}

const ResponseDetails: React.FC<ResponseDetailsProps> = ({ response, citations }) => {
  return (
    <div className="response-display">
      <h2>Response Details</h2>
      <div className="response-content">
        <p>{response}</p>
      </div>
      
      {citations && citations.length > 0 && (
        <div className="citations">
          <h3>Citations</h3>
          {citations.map((citation, index) => (
            <div key={index} className="citation-item">
              <a href={citation.url} target="_blank" rel="noopener noreferrer">
                {citation.title}
              </a>
              <p>Page: {citation.page}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResponseDetails;