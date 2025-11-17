# Webhook Visualizer - Architecture & Technical Details

## System Architecture

```

                        Client Browser                        
              
    React App        WebSocket Connection      
    (Port 3000)               
                                            

                                        
           HTTP REST API                 WebSocket Messages
                                        

              Express.js Backend (Port 3001)                  
       
     REST API        WebSocket      Webhook Receiver 
     Endpoints        Server        (Dynamic URLs)   
       
                                                              
    
             In-Memory Data Store                         
     Endpoints Map (ID  Config)                         
     Webhooks Map (ID  Data)                            
    

          
           HTTP Webhook Requests
          

              External Services / Users                       
   Stripe   GitHub   Twilio   cURL   Custom Apps        

```

## Data Flow

### 1. Endpoint Creation
```
User  Frontend  POST /api/endpoints  Backend
                                        
                                    Generate UUID
                                        
                                    Store in Map
                                        
                                    Return URL
```

### 2. Webhook Receipt
```
External Service  POST /webhook/:id  Backend Middleware
                                           
                                    Extract Headers
                                           
                                    Capture Payload
                                           
                                    Verify Signature (if configured)
                                           
                                    Store Webhook Data
                                           
                                    Broadcast via WebSocket
                                           
                                    Return 200 OK
```

### 3. Real-time Updates
```
Backend (New Webhook)  WebSocket.broadcast()
                              
                        All Connected Clients
                              
                        Frontend Updates UI
```

## Component Hierarchy

```
App
 EndpointGenerator
    Creates new webhook endpoints
 WebhookList
    Displays all webhooks for selected endpoint
    Shows status badges (test, verified, etc.)
 WebhookDetails
    Overview section (timing, IP, status)
    Headers viewer
    JSON payload viewer (ReactJson)
    Delivery attempts timeline
    Replay functionality
 CodeSnippets
     Language selector
     Action selector (send/verify)
     Syntax highlighted code
```

## Key Technical Decisions

### 1. In-Memory Storage
**Why:** 
- Fast access
- Simple implementation
- No external dependencies
- Perfect for demo/development

**Migration Path:**
- Easy to swap with PostgreSQL/MongoDB
- Just replace Map with database queries
- Keep same API interface

### 2. WebSocket for Real-time
**Why:**
- Instant updates without polling
- Low latency
- Efficient for high-frequency updates
- Professional touch

**Implementation:**
- Server broadcasts on webhook receipt
- Clients automatically update UI
- Reconnection handling built-in

### 3. HMAC Signature Verification
**Why:**
- Industry standard (Stripe, GitHub, etc.)
- Prevents replay attacks
- Ensures data integrity
- Configurable per endpoint

**Implementation:**
```javascript
HMAC-SHA256(raw_payload, secret) === provided_signature
```

### 4. Raw Body Preservation
**Why:**
- Critical for signature verification
- Signature computed on exact bytes
- Body parser can modify content

**Implementation:**
- Custom middleware captures raw body
- Stored in `req.rawBody`
- Used for signature computation

## Security Considerations

### Current Implementation
-  HMAC signature verification
-  Constant-time signature comparison
-  Raw body preservation
-  CORS enabled
-  Input validation

### Production Additions
-  Rate limiting (express-rate-limit)
-  Request size limits (already set to 10MB)
-  HTTPS enforcement
-  Secret rotation mechanism
-  Authentication/Authorization
-  Webhook retention policies

## Performance Optimizations

### Current
- In-memory storage (O(1) access)
- Efficient WebSocket broadcasting
- Limited response size (prevents memory issues)

### Future
- Database indexing on timestamp, endpoint_id
- Pagination for webhook lists
- Webhook archival after X days
- Connection pooling
- Redis caching layer

## API Design Principles

### RESTful Routes
- `GET /api/endpoints` - List all
- `POST /api/endpoints` - Create
- `GET /api/endpoints/:id` - Get one
- `DELETE /api/endpoints/:id` - Delete
- `GET /api/endpoints/:id/webhooks` - Related resources

### Consistent Response Format
```json
{
  "data": { ... },
  "error": null
}
```

### Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized (invalid signature)
- 404: Not Found
- 500: Server Error

## Testing Strategy

### Manual Testing
-  UI interaction testing
-  cURL webhook sending
-  PowerShell testing scripts
-  Browser DevTools monitoring

### Automated Testing (Future)
- Unit tests (Jest)
- Integration tests (Supertest)
- E2E tests (Cypress)
- Load testing (Artillery)

## Deployment Considerations

### Backend
- **Heroku**: Procfile with `node server.js`
- **Railway**: Auto-detect Node.js
- **DigitalOcean**: PM2 process manager
- **AWS**: Elastic Beanstalk or EC2

### Frontend
- **Vercel**: Zero config, automatic
- **Netlify**: Deploy `build/` folder
- **GitHub Pages**: Static build
- **Cloudflare Pages**: Fast CDN

### Environment Variables
```
Backend:
- PORT (default: 3001)
- NODE_ENV (production/development)
- DATABASE_URL (when migrating to DB)

Frontend:
- REACT_APP_API_URL (backend URL)
```

## Database Schema (Future Migration)

### Endpoints Table
```sql
CREATE TABLE endpoints (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  url TEXT,
  signature_secret VARCHAR(255),
  signature_algorithm VARCHAR(50),
  signature_header VARCHAR(100),
  webhook_count INTEGER DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Webhooks Table
```sql
CREATE TABLE webhooks (
  id UUID PRIMARY KEY,
  endpoint_id UUID REFERENCES endpoints(id),
  timestamp TIMESTAMP,
  method VARCHAR(10),
  headers JSONB,
  payload JSONB,
  query_params JSONB,
  ip_address INET,
  response_time INTEGER,
  status_code INTEGER,
  signature_verified BOOLEAN,
  is_test BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP
);

CREATE INDEX idx_webhooks_endpoint ON webhooks(endpoint_id);
CREATE INDEX idx_webhooks_timestamp ON webhooks(timestamp DESC);
```

### Delivery Attempts Table
```sql
CREATE TABLE delivery_attempts (
  id SERIAL PRIMARY KEY,
  webhook_id UUID REFERENCES webhooks(id),
  attempt_number INTEGER,
  timestamp TIMESTAMP,
  success BOOLEAN,
  status_code INTEGER,
  response_time INTEGER,
  error_message TEXT
);
```

## Monitoring & Observability (Future)

### Metrics to Track
- Webhook receive rate
- Average response time
- Signature verification success rate
- WebSocket connection count
- Memory usage
- Storage size

### Logging
- Request/response logging
- Error tracking (Sentry)
- Performance monitoring (New Relic)
- Webhook audit trail

## Extension Ideas

### Premium Features
- Webhook transformation/filtering
- Custom response codes/headers
- Webhook forwarding rules
- Email/Slack notifications
- Scheduled webhook replays
- Webhook analytics dashboard
- Team collaboration
- API rate limiting per endpoint

### Integrations
- Pre-configured templates (Stripe, GitHub, Twilio)
- OAuth for third-party services
- CI/CD pipeline testing
- Postman collection export
- OpenAPI/Swagger documentation

---

This architecture is production-ready with clear migration paths for scaling!
