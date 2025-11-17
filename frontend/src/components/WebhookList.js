import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import './WebhookList.css';

function WebhookList({ webhooks, selectedWebhook, onWebhookSelect }) {
  const getMethodColor = (method) => {
    const colors = {
      'GET': '#61affe',
      'POST': '#49cc90',
      'PUT': '#fca130',
      'DELETE': '#f93e3e',
      'PATCH': '#50e3c2'
    };
    return colors[method] || '#888';
  };

  const getStatusBadge = (webhook) => {
    if (webhook.isTest) {
      return <span className="badge badge-test">TEST</span>;
    }
    if (webhook.signatureVerified === true) {
      return <span className="badge badge-verified">VERIFIED</span>;
    }
    if (webhook.signatureVerified === false) {
      return <span className="badge badge-failed">FAILED</span>;
    }
    return null;
  };

  return (
    <div className="webhook-list">
      <div className="webhook-list-header">
        <h3>Received Webhooks ({webhooks.length})</h3>
      </div>
      
      {webhooks.length === 0 ? (
        <div className="empty-state">
          <p>No webhooks received yet</p>
          <p className="hint">Send a webhook to your endpoint URL to see it here</p>
        </div>
      ) : (
        <div className="webhook-items">
          {webhooks.map(webhook => (
            <div
              key={webhook.id}
              className={`webhook-item ${selectedWebhook?.id === webhook.id ? 'selected' : ''}`}
              onClick={() => onWebhookSelect(webhook)}
            >
              <div className="webhook-item-header">
                <span 
                  className="method-badge"
                  style={{ backgroundColor: getMethodColor(webhook.method) }}
                >
                  {webhook.method}
                </span>
                <span className="timestamp">
                  {formatDistanceToNow(new Date(webhook.timestamp), { addSuffix: true })}
                </span>
              </div>
              
              <div className="webhook-item-body">
                <div className="webhook-preview">
                  {webhook.payload && typeof webhook.payload === 'object' ? (
                    <span className="payload-preview">
                      {webhook.payload.event || webhook.payload.type || 'Event'}
                    </span>
                  ) : (
                    <span className="payload-preview">Webhook payload</span>
                  )}
                </div>
                
                <div className="webhook-meta">
                  <span className="response-time">{webhook.responseTime}ms</span>
                  {getStatusBadge(webhook)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WebhookList;
