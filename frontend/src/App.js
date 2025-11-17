import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EndpointGenerator from './components/EndpointGenerator';
import WebhookList from './components/WebhookList';
import WebhookDetails from './components/WebhookDetails';
import CodeSnippets from './components/CodeSnippets';
import './App.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function App() {
  const [endpoints, setEndpoints] = useState([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [webhooks, setWebhooks] = useState([]);
  const [selectedWebhook, setSelectedWebhook] = useState(null);
  const [view, setView] = useState('webhooks'); // 'webhooks' or 'code'
  const [ws, setWs] = useState(null);

  // Connect to WebSocket for real-time updates
  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:3001');
    
    websocket.onopen = () => {
      console.log('WebSocket connected');
    };
    
    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'new_webhook') {
        setWebhooks(prev => [message.data, ...prev]);
      }
    };
    
    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    setWs(websocket);
    
    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, []);

  // Load endpoints on mount
  useEffect(() => {
    loadEndpoints();
  }, []);

  // Load webhooks when endpoint is selected
  useEffect(() => {
    if (selectedEndpoint) {
      loadWebhooks(selectedEndpoint.id);
    }
  }, [selectedEndpoint]);

  const loadEndpoints = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/endpoints`);
      setEndpoints(response.data);
      if (response.data.length > 0 && !selectedEndpoint) {
        setSelectedEndpoint(response.data[0]);
      }
    } catch (error) {
      console.error('Error loading endpoints:', error);
    }
  };

  const loadWebhooks = async (endpointId) => {
    try {
      const response = await axios.get(`${API_BASE}/api/endpoints/${endpointId}/webhooks`);
      setWebhooks(response.data);
    } catch (error) {
      console.error('Error loading webhooks:', error);
    }
  };

  const handleEndpointCreated = (endpoint) => {
    setEndpoints([...endpoints, endpoint]);
    setSelectedEndpoint(endpoint);
  };

  const handleEndpointSelect = (endpoint) => {
    setSelectedEndpoint(endpoint);
    setSelectedWebhook(null);
  };

  const handleWebhookSelect = (webhook) => {
    setSelectedWebhook(webhook);
  };

  const handleTestWebhook = async () => {
    if (!selectedEndpoint) return;
    
    try {
      const response = await axios.post(`${API_BASE}/api/endpoints/${selectedEndpoint.id}/test`, {
        payload: {
          event: 'test',
          message: 'Test webhook from Webhook Visualizer',
          timestamp: new Date().toISOString(),
          data: {
            test: true,
            userId: '12345',
            action: 'button_clicked'
          }
        }
      });
      
      // The webhook will be added via WebSocket, but we can also manually add it
      setWebhooks(prev => [response.data, ...prev]);
      setSelectedWebhook(response.data);
    } catch (error) {
      console.error('Error sending test webhook:', error);
    }
  };

  const handleReplayWebhook = async (targetUrl) => {
    if (!selectedWebhook) return;
    
    try {
      await axios.post(`${API_BASE}/api/webhooks/${selectedWebhook.id}/replay`, {
        targetUrl
      });
      alert('Webhook replayed successfully!');
    } catch (error) {
      console.error('Error replaying webhook:', error);
      alert('Failed to replay webhook');
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Webhook Visualizer</h1>
        <p>Capture, inspect, and debug webhooks from any API</p>
      </header>

      <div className="main-container">
        <aside className="sidebar">
          <EndpointGenerator 
            onEndpointCreated={handleEndpointCreated}
          />
          
          <div className="endpoints-list">
            <h3>Your Endpoints</h3>
            {endpoints.length === 0 ? (
              <p className="empty-state">No endpoints yet. Create one above!</p>
            ) : (
              endpoints.map(endpoint => (
                <div 
                  key={endpoint.id}
                  className={`endpoint-item ${selectedEndpoint?.id === endpoint.id ? 'selected' : ''}`}
                  onClick={() => handleEndpointSelect(endpoint)}
                >
                  <div className="endpoint-name">{endpoint.name}</div>
                  <div className="endpoint-count">{endpoint.webhookCount} webhooks</div>
                </div>
              ))
            )}
          </div>
        </aside>

        <main className="main-content">
          <div className="view-tabs">
            <button 
              className={`tab ${view === 'webhooks' ? 'active' : ''}`}
              onClick={() => setView('webhooks')}
            >
              Webhooks
            </button>
            <button 
              className={`tab ${view === 'code' ? 'active' : ''}`}
              onClick={() => setView('code')}
            >
              Code Snippets
            </button>
          </div>

          {view === 'webhooks' ? (
            <div className="webhooks-view">
              {selectedEndpoint ? (
                <>
                  <div className="endpoint-header">
                    <div>
                      <h2>{selectedEndpoint.name}</h2>
                      <div className="webhook-url">
                        <input 
                          type="text" 
                          value={selectedEndpoint.url} 
                          readOnly 
                        />
                        <button 
                          onClick={() => navigator.clipboard.writeText(selectedEndpoint.url)}
                          className="copy-btn"
                        >
                          Copy
                        </button>
                        <button 
                          onClick={handleTestWebhook}
                          className="test-btn"
                        >
                          Send Test
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="webhooks-content">
                    <div className="webhooks-list-panel">
                      <WebhookList 
                        webhooks={webhooks}
                        selectedWebhook={selectedWebhook}
                        onWebhookSelect={handleWebhookSelect}
                      />
                    </div>
                    
                    {selectedWebhook && (
                      <div className="webhook-details-panel">
                        <WebhookDetails 
                          webhook={selectedWebhook}
                          onReplay={handleReplayWebhook}
                        />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="empty-state-large">
                  <h2>Create an endpoint to get started</h2>
                  <p>Generate a unique webhook URL and start capturing requests</p>
                </div>
              )}
            </div>
          ) : (
            <CodeSnippets endpoint={selectedEndpoint} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
