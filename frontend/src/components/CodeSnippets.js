import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './CodeSnippets.css';

function CodeSnippets({ endpoint }) {
  const [selectedLanguage, setSelectedLanguage] = useState('express');
  const [selectedAction, setSelectedAction] = useState('send'); // 'send' or 'verify'

  if (!endpoint) {
    return (
      <div className="code-snippets">
        <div className="empty-state-large">
          <h2>Select an endpoint to view code snippets</h2>
        </div>
      </div>
    );
  }

  const snippets = {
    express: {
      send: `// Express.js - Send Webhook
const axios = require('axios');

async function sendWebhook() {
  try {
    const response = await axios.post('${endpoint.url}', {
      event: 'user.created',
      timestamp: new Date().toISOString(),
      data: {
        userId: '12345',
        email: 'user@example.com',
        name: 'John Doe'
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'MyApp/1.0'
      }
    });
    
    console.log('Webhook sent:', response.data);
  } catch (error) {
    console.error('Error sending webhook:', error);
  }
}

sendWebhook();`,
      verify: `// Express.js - Verify Webhook Signature
const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const app = express();
const WEBHOOK_SECRET = 'your-secret-key';

// Capture raw body for signature verification
app.use(bodyParser.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString('utf8');
  }
}));

app.post('/webhook', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  
  // Verify signature
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  hmac.update(req.rawBody);
  const expectedSignature = hmac.digest('hex');
  
  if (signature !== expectedSignature) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Process webhook
  console.log('Webhook received:', req.body);
  res.json({ success: true });
});

app.listen(3000);`
    },
    fastapi: {
      send: `# FastAPI - Send Webhook
import httpx
import json
from datetime import datetime

async def send_webhook():
    url = "${endpoint.url}"
    
    payload = {
        "event": "user.created",
        "timestamp": datetime.utcnow().isoformat(),
        "data": {
            "userId": "12345",
            "email": "user@example.com",
            "name": "John Doe"
        }
    }
    
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "MyApp/1.0"
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload, headers=headers)
        print(f"Webhook sent: {response.json()}")

# Run with: asyncio.run(send_webhook())`,
      verify: `# FastAPI - Verify Webhook Signature
from fastapi import FastAPI, Request, HTTPException
import hmac
import hashlib

app = FastAPI()
WEBHOOK_SECRET = b"your-secret-key"

@app.post("/webhook")
async def receive_webhook(request: Request):
    # Get signature from headers
    signature = request.headers.get("x-webhook-signature")
    if not signature:
        raise HTTPException(status_code=401, detail="Missing signature")
    
    # Get raw body
    body = await request.body()
    
    # Verify signature
    expected_signature = hmac.new(
        WEBHOOK_SECRET,
        body,
        hashlib.sha256
    ).hexdigest()
    
    if not hmac.compare_digest(signature, expected_signature):
        raise HTTPException(status_code=401, detail="Invalid signature")
    
    # Process webhook
    payload = await request.json()
    print(f"Webhook received: {payload}")
    
    return {"success": True}`
    },
    flask: {
      send: `# Flask - Send Webhook
import requests
import json
from datetime import datetime

def send_webhook():
    url = "${endpoint.url}"
    
    payload = {
        "event": "user.created",
        "timestamp": datetime.utcnow().isoformat(),
        "data": {
            "userId": "12345",
            "email": "user@example.com",
            "name": "John Doe"
        }
    }
    
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "MyApp/1.0"
    }
    
    response = requests.post(url, json=payload, headers=headers)
    print(f"Webhook sent: {response.json()}")

send_webhook()`,
      verify: `# Flask - Verify Webhook Signature
from flask import Flask, request, jsonify
import hmac
import hashlib

app = Flask(__name__)
WEBHOOK_SECRET = b"your-secret-key"

@app.route('/webhook', methods=['POST'])
def receive_webhook():
    # Get signature from headers
    signature = request.headers.get('X-Webhook-Signature')
    if not signature:
        return jsonify({"error": "Missing signature"}), 401
    
    # Get raw body
    body = request.get_data()
    
    # Verify signature
    expected_signature = hmac.new(
        WEBHOOK_SECRET,
        body,
        hashlib.sha256
    ).hexdigest()
    
    if not hmac.compare_digest(signature, expected_signature):
        return jsonify({"error": "Invalid signature"}), 401
    
    # Process webhook
    payload = request.get_json()
    print(f"Webhook received: {payload}")
    
    return jsonify({"success": True})

if __name__ == '__main__':
    app.run(port=3000)`
    },
    curl: {
      send: `# cURL - Send Webhook
curl -X POST ${endpoint.url} \\
  -H "Content-Type: application/json" \\
  -H "User-Agent: MyApp/1.0" \\
  -d '{
    "event": "user.created",
    "timestamp": "2024-01-01T12:00:00Z",
    "data": {
      "userId": "12345",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }'`,
      verify: `# cURL - Send Webhook with Signature
# First, generate the signature (example with openssl)
PAYLOAD='{"event":"test","data":{"test":true}}'
SECRET="your-secret-key"
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" | sed 's/^.*= //')

curl -X POST ${endpoint.url} \\
  -H "Content-Type: application/json" \\
  -H "X-Webhook-Signature: $SIGNATURE" \\
  -d "$PAYLOAD"`
    }
  };

  const languages = [
    { id: 'express', name: 'Express.js', icon: '' },
    { id: 'fastapi', name: 'FastAPI', icon: '' },
    { id: 'flask', name: 'Flask', icon: '' },
    { id: 'curl', name: 'cURL', icon: '' }
  ];

  const actions = [
    { id: 'send', name: 'Send Webhook' },
    { id: 'verify', name: 'Verify Signature' }
  ];

  const copyCode = () => {
    const code = snippets[selectedLanguage][selectedAction];
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="code-snippets">
      <div className="code-header">
        <div>
          <h2>Code Examples</h2>
          <p className="code-description">
            Ready-to-use code snippets for sending and verifying webhooks
          </p>
        </div>
        <button className="copy-code-btn" onClick={copyCode}>
          Copy Code
        </button>
      </div>

      <div className="code-controls">
        <div className="control-group">
          <label>Framework</label>
          <div className="button-group">
            {languages.map(lang => (
              <button
                key={lang.id}
                className={`control-btn ${selectedLanguage === lang.id ? 'active' : ''}`}
                onClick={() => setSelectedLanguage(lang.id)}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        <div className="control-group">
          <label>Action</label>
          <div className="button-group">
            {actions.map(action => (
              <button
                key={action.id}
                className={`control-btn ${selectedAction === action.id ? 'active' : ''}`}
                onClick={() => setSelectedAction(action.id)}
              >
                {action.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="code-display">
        <SyntaxHighlighter
          language={selectedLanguage === 'curl' ? 'bash' : selectedLanguage === 'express' ? 'javascript' : 'python'}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            borderRadius: '8px',
            fontSize: '0.9rem',
            padding: '1.5rem'
          }}
        >
          {snippets[selectedLanguage][selectedAction]}
        </SyntaxHighlighter>
      </div>

      <div className="code-footer">
        <div className="info-box">
          <h4>Tips</h4>
          <ul>
            <li>Replace the URL with your generated webhook endpoint</li>
            <li>Add custom headers for API identification (User-Agent, API-Key, etc.)</li>
            <li>Use HMAC-SHA256 for signature verification in production</li>
            <li>Store webhook secrets securely (environment variables)</li>
            <li>Implement retry logic for failed webhook deliveries</li>
          </ul>
        </div>

        <div className="info-box">
          <h4>Signature Verification</h4>
          <p>
            For production webhooks, always verify signatures using HMAC-SHA256:
          </p>
          <ul>
            <li>Generate: <code>HMAC-SHA256(payload, secret)</code></li>
            <li>Compare with header signature</li>
            <li>Use constant-time comparison to prevent timing attacks</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CodeSnippets;
