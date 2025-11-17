# Webhook Visualizer + Delivery Inspector

> **An impressive full-stack application for capturing, inspecting, and debugging webhooks from any API**

Perfect for demonstrating expertise in async API patterns, security, event-driven architecture, and developer experience to companies like Stripe, Twilio, GitHub, and AssemblyAI.

![Webhook Visualizer](https://img.shields.io/badge/Status-Production%20Ready-success)
![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green)
![React](https://img.shields.io/badge/Frontend-React-blue)
![WebSocket](https://img.shields.io/badge/Real--time-WebSocket-orange)

---

## What It Does

This application simulates receiving webhooks from third-party APIs and provides a comprehensive inspection tool:

1. **Generate Webhook URL** - Click a button to create a unique webhook endpoint
2. **Capture Everything** - Automatically logs ANY webhook sent to your endpoint
3. **Real-time Updates** - See webhooks arrive instantly via WebSocket
4. **Complete Inspection** - View headers, payload, timestamp, response time, and more
5. **Security First** - HMAC signature verification for webhook authenticity
6. **Developer Tools** - Replay webhooks, send test requests, and generate code snippets

---

## Key Features

### Core Functionality
- **Dynamic Endpoint Generation** - Create unlimited unique webhook URLs
- **Universal Webhook Receiver** - Accepts ANY HTTP method (GET, POST, PUT, DELETE, PATCH)
- **Complete Data Capture** - Headers, payload, query parameters, IP address, timestamps
- **Real-time Dashboard** - WebSocket-powered live updates
- **Webhook History** - Full audit trail of all received webhooks

### Security Features
- **HMAC Signature Verification** - SHA-256 signature validation
- **Configurable Per-Endpoint** - Different secrets for different sources
- **Visual Verification Status** - Clear indicators for verified/failed signatures
- **Raw Body Preservation** - Essential for accurate signature verification

### Developer Experience
- **Replay Webhooks** - Resend captured webhooks to any URL
- **Test Webhook Generator** - Send sample webhooks with one click
- **Code Snippet Generator** - Ready-to-use examples in Express, FastAPI, Flask, cURL
- **JSON Viewer** - Beautiful, collapsible JSON payload display
- **Delivery Timeline** - Track multiple delivery attempts with full details

### Monitoring & Debugging
- **Response Time Tracking** - Millisecond-precise timing
- **Status Code Logging** - HTTP response codes for each request
- **Delivery Attempts** - Full history of retry attempts
- **IP Address Logging** - Source identification
- **Header Inspection** - Complete header analysis

---

## Why It's Powerful

This project demonstrates deep understanding of:

✅ **Async API Patterns** - Webhooks vs polling, event-driven architecture  
✅ **Security** - HMAC/signature verification, secure secret handling  
✅ **Real-time Communication** - WebSocket implementation  
✅ **Developer Experience** - Intuitive UI, helpful tooling, code generation  
✅ **API Design** - RESTful endpoints, proper error handling  
✅ **Event-Driven Architecture** - Webhook lifecycle management  
✅ **Debugging Tools** - Replay, inspect, test capabilities  

---

## Tech Stack

### Backend
- **Node.js** + **Express.js** - Fast, scalable API server
- **WebSocket (ws)** - Real-time bidirectional communication
- **UUID** - Unique endpoint and webhook ID generation
- **Crypto** - HMAC signature verification

### Frontend
- **React 18** - Modern, component-based UI
- **Axios** - HTTP client for API calls
- **react-json-view** - Beautiful JSON visualization
- **date-fns** - Time formatting and relative dates
- **react-syntax-highlighter** - Code snippet highlighting
- **WebSocket API** - Real-time updates

### Architecture
- **RESTful API** - Clean, predictable endpoints
- **In-Memory Storage** - Fast access (easily upgradable to database)
- **Real-time Updates** - WebSocket broadcast system
- **Modular Components** - Reusable, maintainable code

---

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/webhook-visualiser.git
   cd webhook-visualiser
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend runs on `http://localhost:3001`

5. **Start the Frontend (in a new terminal)**
   ```bash
   cd frontend
   npm start
   ```
   Frontend runs on `http://localhost:3000`

6. **Open your browser**
   Navigate to `http://localhost:3000`

---

## Usage

### 1. Generate a Webhook Endpoint
- Enter a name for your endpoint (e.g., "Stripe Webhooks")
- Click "Generate Endpoint"
- Copy the generated URL

### 2. Send Webhooks
Use the generated URL to receive webhooks from:
- External services (Stripe, GitHub, Twilio, etc.)
- Your own applications
- The built-in test webhook feature
- cURL or any HTTP client

**Example with cURL:**
```bash
curl -X POST http://localhost:3001/webhook/your-endpoint-id \
  -H "Content-Type: application/json" \
  -d '{
    "event": "payment.success",
    "amount": 1000,
    "currency": "USD"
  }'
```

### 3. Inspect Webhooks
- Click on any webhook in the list
- View headers, payload, timing, and delivery info
- Use the JSON viewer to explore nested data

### 4. Test & Replay
- Click "Send Test" to generate a sample webhook
- Use "Replay" to resend a webhook to any URL
- Perfect for debugging or testing integrations

### 5. Generate Code Snippets
- Switch to "Code Snippets" tab
- Select your framework (Express, FastAPI, Flask, cURL)
- Copy ready-to-use code for sending or verifying webhooks

---

## Security: Signature Verification

### Setup Signature Verification

When creating an endpoint, you can configure signature verification:

```javascript
{
  "name": "Stripe Webhooks",
  "signatureConfig": {
    "headerName": "x-webhook-signature",
    "secret": "your-secret-key",
    "algorithm": "sha256"
  }
}
```

### How It Works
1. Webhook sender creates HMAC signature: `HMAC-SHA256(payload, secret)`
2. Signature sent in header (e.g., `X-Webhook-Signature`)
3. Backend verifies by computing expected signature
4. Visual indicator shows verification status

---

## API Endpoints

### Endpoint Management
- `POST /api/endpoints` - Create new webhook endpoint
- `GET /api/endpoints` - List all endpoints
- `GET /api/endpoints/:id` - Get specific endpoint
- `DELETE /api/endpoints/:id` - Delete endpoint

### Webhook Operations
- `ALL /webhook/:endpointId` - Receive webhook (any HTTP method)
- `GET /api/webhooks` - Get all webhooks
- `GET /api/webhooks/:id` - Get specific webhook
- `GET /api/endpoints/:id/webhooks` - Get webhooks for endpoint
- `POST /api/webhooks/:id/replay` - Replay webhook to target URL
- `POST /api/endpoints/:id/test` - Send test webhook

### Health
- `GET /health` - Server health check

---

## Screenshots

### Main Dashboard
Beautiful dark theme with real-time webhook updates

### Webhook Inspector
Detailed view with headers, payload, and delivery info

### Code Generator
Ready-to-use snippets in multiple languages

---

## Deployment

### Backend Deployment (e.g., Heroku, Railway)
```bash
# Set PORT environment variable
# Deploy backend folder
```

### Frontend Deployment (e.g., Vercel, Netlify)
```bash
# Set REACT_APP_API_URL to your backend URL
# Deploy frontend folder
```

---

## Roadmap

- [ ] Database persistence (PostgreSQL/MongoDB)
- [ ] User authentication & multiple accounts
- [ ] Webhook filtering and search
- [ ] Custom webhook transformations
- [ ] Email notifications for webhooks
- [ ] Webhook forwarding rules
- [ ] API rate limiting
- [ ] Export webhooks (JSON, CSV)
- [ ] Webhook analytics dashboard
- [ ] Custom retry logic configuration

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## License

MIT License - feel free to use this project for learning, portfolio, or production!

---

## Perfect For

- **API Support Engineer** interviews
- **Developer Relations** roles
- **Backend Engineer** positions
- **Full-stack Developer** portfolios
- Demonstrating API expertise
- Understanding of webhook architecture
- Security best practices

---

## What You'll Learn

Building this project teaches:
- Real-time WebSocket communication
- HMAC signature verification
- RESTful API design
- Event-driven architecture
- Security best practices
- Developer tooling
- React state management
- Modern full-stack development

---

## Support

Questions? Issues? Feel free to open an issue or reach out!

---

**Built with love for developers who love clean APIs and great developer experience**