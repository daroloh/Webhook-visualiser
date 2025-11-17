const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.raw({ type: 'application/octet-stream', limit: '10mb' }));

// In-memory storage (use a database in production)
const endpoints = new Map(); // endpoint ID -> endpoint config
const webhooks = new Map();  // webhook ID -> webhook data

// WebSocket connections for real-time updates
const wsConnections = new Set();

wss.on('connection', (ws) => {
  wsConnections.add(ws);
  console.log('WebSocket client connected');
  
  ws.on('close', () => {
    wsConnections.remove(ws);
    console.log('WebSocket client disconnected');
  });
});

// Broadcast webhook updates to all connected clients
function broadcastWebhook(webhook) {
  const message = JSON.stringify({ type: 'new_webhook', data: webhook });
  wsConnections.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  });
}

// Custom middleware to capture raw body for signature verification
app.use((req, res, next) => {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    req.rawBody = data;
    next();
  });
});

// API Routes

// Generate a new webhook endpoint
app.post('/api/endpoints', (req, res) => {
  const endpointId = uuidv4();
  const endpoint = {
    id: endpointId,
    url: `${req.protocol}://${req.get('host')}/webhook/${endpointId}`,
    createdAt: new Date().toISOString(),
    name: req.body.name || 'Unnamed Endpoint',
    signatureConfig: req.body.signatureConfig || null, // For HMAC verification
    webhookCount: 0
  };
  
  endpoints.set(endpointId, endpoint);
  res.json(endpoint);
});

// Get all endpoints
app.get('/api/endpoints', (req, res) => {
  const allEndpoints = Array.from(endpoints.values());
  res.json(allEndpoints);
});

// Get specific endpoint
app.get('/api/endpoints/:id', (req, res) => {
  const endpoint = endpoints.get(req.params.id);
  if (!endpoint) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  res.json(endpoint);
});

// Delete endpoint
app.delete('/api/endpoints/:id', (req, res) => {
  const deleted = endpoints.delete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  res.json({ success: true });
});

// Get all webhooks for an endpoint
app.get('/api/endpoints/:id/webhooks', (req, res) => {
  const endpointWebhooks = Array.from(webhooks.values())
    .filter(w => w.endpointId === req.params.id)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  res.json(endpointWebhooks);
});

// Get specific webhook
app.get('/api/webhooks/:id', (req, res) => {
  const webhook = webhooks.get(req.params.id);
  if (!webhook) {
    return res.status(404).json({ error: 'Webhook not found' });
  }
  res.json(webhook);
});

// Get all webhooks (across all endpoints)
app.get('/api/webhooks', (req, res) => {
  const allWebhooks = Array.from(webhooks.values())
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  res.json(allWebhooks);
});

// Replay a webhook
app.post('/api/webhooks/:id/replay', async (req, res) => {
  const webhook = webhooks.get(req.params.id);
  if (!webhook) {
    return res.status(404).json({ error: 'Webhook not found' });
  }

  const targetUrl = req.body.targetUrl;
  if (!targetUrl) {
    return res.status(400).json({ error: 'Target URL required' });
  }

  try {
    const startTime = Date.now();
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: webhook.headers,
      body: JSON.stringify(webhook.payload)
    });
    const responseTime = Date.now() - startTime;

    const replayResult = {
      success: response.ok,
      statusCode: response.status,
      responseTime,
      timestamp: new Date().toISOString()
    };

    res.json(replayResult);
  } catch (error) {
    res.status(500).json({ 
      error: 'Replay failed', 
      message: error.message 
    });
  }
});

// Send test webhook to an endpoint
app.post('/api/endpoints/:id/test', (req, res) => {
  const endpoint = endpoints.get(req.params.id);
  if (!endpoint) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }

  const testPayload = req.body.payload || {
    event: 'test',
    message: 'This is a test webhook',
    timestamp: new Date().toISOString(),
    data: {
      test: true,
      random: Math.random()
    }
  };

  // Simulate sending webhook to the endpoint
  const webhookId = uuidv4();
  const webhookData = {
    id: webhookId,
    endpointId: endpoint.id,
    timestamp: new Date().toISOString(),
    headers: {
      'content-type': 'application/json',
      'user-agent': 'WebhookVisualizer-TestClient/1.0',
      'x-test-webhook': 'true'
    },
    payload: testPayload,
    method: 'POST',
    responseTime: Math.floor(Math.random() * 50) + 10,
    statusCode: 200,
    ipAddress: '127.0.0.1',
    deliveryAttempts: [
      {
        attemptNumber: 1,
        timestamp: new Date().toISOString(),
        success: true,
        statusCode: 200,
        responseTime: Math.floor(Math.random() * 50) + 10
      }
    ],
    signatureVerified: null,
    isTest: true
  };

  webhooks.set(webhookId, webhookData);
  endpoint.webhookCount++;
  
  broadcastWebhook(webhookData);
  
  res.json(webhookData);
});

// Verify webhook signature
function verifySignature(payload, signature, secret, algorithm = 'sha256') {
  if (!signature || !secret) return null;
  
  try {
    const hmac = crypto.createHmac(algorithm, secret);
    hmac.update(payload);
    const expectedSignature = hmac.digest('hex');
    
    return signature === expectedSignature || signature === `sha256=${expectedSignature}`;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

// Main webhook receiver - accepts ANY HTTP method
app.all('/webhook/:endpointId', (req, res) => {
  const startTime = Date.now();
  const endpointId = req.params.endpointId;
  
  const endpoint = endpoints.get(endpointId);
  if (!endpoint) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }

  const webhookId = uuidv4();
  
  // Extract headers
  const headers = { ...req.headers };
  delete headers.host; // Remove host header for cleaner display
  
  // Determine payload
  let payload = req.body;
  if (req.rawBody && req.headers['content-type']?.includes('application/json')) {
    try {
      payload = JSON.parse(req.rawBody);
    } catch (e) {
      payload = req.rawBody;
    }
  }

  // Signature verification
  let signatureVerified = null;
  if (endpoint.signatureConfig) {
    const { headerName, secret, algorithm } = endpoint.signatureConfig;
    const signature = req.headers[headerName.toLowerCase()];
    signatureVerified = verifySignature(req.rawBody || JSON.stringify(payload), signature, secret, algorithm);
  }

  const responseTime = Date.now() - startTime;

  const webhookData = {
    id: webhookId,
    endpointId: endpointId,
    timestamp: new Date().toISOString(),
    headers: headers,
    payload: payload,
    method: req.method,
    query: req.query,
    responseTime: responseTime,
    statusCode: 200,
    ipAddress: req.ip || req.connection.remoteAddress,
    deliveryAttempts: [
      {
        attemptNumber: 1,
        timestamp: new Date().toISOString(),
        success: true,
        statusCode: 200,
        responseTime: responseTime
      }
    ],
    signatureVerified: signatureVerified,
    isTest: false
  };

  webhooks.set(webhookId, webhookData);
  endpoint.webhookCount++;
  
  // Broadcast to WebSocket clients
  broadcastWebhook(webhookData);

  res.status(200).json({ 
    success: true, 
    message: 'Webhook received',
    webhookId: webhookId
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    endpoints: endpoints.size,
    webhooks: webhooks.size
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Webhook Visualizer Backend running on port ${PORT}`);
  console.log(`WebSocket server ready for real-time updates`);
});
