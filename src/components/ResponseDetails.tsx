// src/components/ResponseDetails.tsx
import React from 'react';
import './ResponseDetails.css';
import { Citation, StateSnapshot } from '../types/dashboardTypes';

interface ResponseDetailsProps {
  response: string;
  citations: Citation[];
  stateSnapshot?: StateSnapshot;
}

const ResponseDetails: React.FC<ResponseDetailsProps> = ({ response, citations, stateSnapshot }) => {
  const [showDraft, setShowDraft] = React.useState(false);
  const draft = stateSnapshot?.synthesis ?? null;
  const differs = draft !== null && draft !== response;

  return (
    <div className="response-display">
      <h2>Response Details</h2>

      {stateSnapshot && (
        <div className="verdict-chips">
          <span
            className={`verdict-chip ${
              stateSnapshot.judge_verdict?.startsWith('APPROVED') ? 'approved' : 'rejected'
            }`}
          >
            Judge: {stateSnapshot.judge_verdict ?? 'n/a'}
          </span>
          <span className="verdict-chip neutral">
            Grounding (Gate C): {stateSnapshot.grounding_verdict ?? 'n/a'}
          </span>
          {(stateSnapshot.replan_count > 0 || stateSnapshot.retry_count > 0) && (
            <span className="verdict-chip warn">
              replans: {stateSnapshot.replan_count} · retries: {stateSnapshot.retry_count}
            </span>
          )}
        </div>
      )}

      <div className="response-content">
        <p>{response}</p>
      </div>

      {differs && (
        <div className="draft-section">
          <button className="draft-toggle" onClick={() => setShowDraft(!showDraft)}>
            {showDraft ? 'Hide' : 'Show'} pre-judge draft the user never saw
          </button>
          {showDraft && <pre className="draft-content">{draft}</pre>}
        </div>
      )}

      {citations && citations.length > 0 && (
        <div className="citations">
          <h3>Citations</h3>
          {citations.map((citation, index) => (
            <div key={index} className="citation-item">
              {citation.url ? (
                <a href={citation.url} target="_blank" rel="noopener noreferrer">
                  {citation.title}
                </a>
              ) : (
                <strong>{citation.title}</strong>
              )}
              {citation.page && <p>Page: {citation.page}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResponseDetails;
