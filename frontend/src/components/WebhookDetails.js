import React, { useState } from 'react';
import ReactJson from 'react-json-view';
import { format } from 'date-fns';
import './WebhookDetails.css';

function WebhookDetails({ webhook, onReplay }) {
  const [replayUrl, setReplayUrl] = useState('');
  const [showReplay, setShowReplay] = useState(false);

  const handleReplay = () => {
    if (!replayUrl.trim()) {
      alert('Please enter a target URL');
      return;
    }
    onReplay(replayUrl);
    setShowReplay(false);
    setReplayUrl('');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="webhook-details">
      <div className="webhook-details-header">
        <h3>Webhook Details</h3>
        <div className="header-actions">
          <button 
            className="replay-btn"
            onClick={() => setShowReplay(!showReplay)}
          >
            Replay
          </button>
          <button 
            className="copy-btn"
            onClick={() => copyToClipboard(JSON.stringify(webhook, null, 2))}
          >
            Copy All
          </button>
        </div>
      </div>

      {showReplay && (
        <div className="replay-panel">
          <input
            type="text"
            placeholder="Enter target URL (e.g., https://example.com/webhook)"
            value={replayUrl}
            onChange={(e) => setReplayUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleReplay()}
          />
          <button onClick={handleReplay}>Send</button>
        </div>
      )}

      <div className="webhook-details-content">
        {/* Overview Section */}
        <section className="details-section">
          <h4>Overview</h4>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Timestamp</span>
              <span className="info-value">
                {format(new Date(webhook.timestamp), 'PPpp')}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Method</span>
              <span className="info-value method">{webhook.method}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Response Time</span>
              <span className="info-value">{webhook.responseTime}ms</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status Code</span>
              <span className="info-value status">{webhook.statusCode}</span>
            </div>
            <div className="info-item">
              <span className="info-label">IP Address</span>
              <span className="info-value">{webhook.ipAddress}</span>
            </div>
            {webhook.signatureVerified !== null && (
              <div className="info-item">
                <span className="info-label">Signature</span>
                <span className={`info-value ${webhook.signatureVerified ? 'verified' : 'failed'}`}>
                  {webhook.signatureVerified ? 'Verified' : 'Failed'}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Headers Section */}
        <section className="details-section">
          <h4>Headers</h4>
          <div className="headers-list">
            {Object.entries(webhook.headers).map(([key, value]) => (
              <div key={key} className="header-item">
                <span className="header-key">{key}:</span>
                <span className="header-value">{value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Payload Section */}
        <section className="details-section">
          <h4>Payload</h4>
          <div className="payload-viewer">
            {webhook.payload && typeof webhook.payload === 'object' ? (
              <ReactJson
                src={webhook.payload}
                theme="monokai"
                collapsed={false}
                displayDataTypes={false}
                displayObjectSize={true}
                enableClipboard={true}
                name={false}
                style={{
                  background: '#1a1a1a',
                  padding: '1rem',
                  borderRadius: '4px'
                }}
              />
            ) : (
              <pre className="raw-payload">{JSON.stringify(webhook.payload, null, 2)}</pre>
            )}
          </div>
        </section>

        {/* Delivery Attempts Section */}
        {webhook.deliveryAttempts && webhook.deliveryAttempts.length > 0 && (
          <section className="details-section">
            <h4>Delivery Attempts</h4>
            <div className="attempts-timeline">
              {webhook.deliveryAttempts.map((attempt) => (
                <div key={attempt.attemptNumber} className="attempt-item">
                  <div className="attempt-number">#{attempt.attemptNumber}</div>
                  <div className="attempt-details">
                    <div className="attempt-status">
                      <span className={`status-indicator ${attempt.success ? 'success' : 'failure'}`}>
                        {attempt.success ? 'OK' : 'FAIL'}
                      </span>
                      <span>Status: {attempt.statusCode}</span>
                    </div>
                    <div className="attempt-time">
                      {format(new Date(attempt.timestamp), 'PPpp')}
                    </div>
                    <div className="attempt-response-time">
                      Response: {attempt.responseTime}ms
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Query Parameters */}
        {webhook.query && Object.keys(webhook.query).length > 0 && (
          <section className="details-section">
            <h4>Query Parameters</h4>
            <div className="headers-list">
              {Object.entries(webhook.query).map(([key, value]) => (
                <div key={key} className="header-item">
                  <span className="header-key">{key}:</span>
                  <span className="header-value">{value}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default WebhookDetails;
