#  Quick Reference - Common Commands

## Installation

```powershell
# Install all dependencies
npm run install:all

# Or manually:
cd backend; npm install
cd ../frontend; npm install
```

## Running the Application

```powershell
# Terminal 1 - Start Backend
cd backend
npm run dev
# Server runs on: http://localhost:3001

# Terminal 2 - Start Frontend
cd frontend
npm start
# App opens at: http://localhost:3000
```

## Testing Webhooks

### Using PowerShell
```powershell
# Basic webhook
$body = @{
    event = "test.event"
    timestamp = (Get-Date).ToString("o")
    data = @{
        test = $true
        message = "Hello from PowerShell"
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/webhook/YOUR-ENDPOINT-ID" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

### Using cURL
```bash
curl -X POST http://localhost:3001/webhook/YOUR-ENDPOINT-ID \
  -H "Content-Type: application/json" \
  -d '{"event":"test","data":{"test":true}}'
```

### With Signature (PowerShell)
```powershell
# Generate HMAC signature
$secret = "your-secret-key"
$payload = '{"event":"test","data":{"test":true}}'
$hmac = New-Object System.Security.Cryptography.HMACSHA256
$hmac.Key = [Text.Encoding]::UTF8.GetBytes($secret)
$signature = [Convert]::ToHex($hmac.ComputeHash([Text.Encoding]::UTF8.GetBytes($payload)))

Invoke-RestMethod -Uri "http://localhost:3001/webhook/YOUR-ENDPOINT-ID" `
    -Method POST `
    -Headers @{
        "Content-Type" = "application/json"
        "X-Webhook-Signature" = $signature.ToLower()
    } `
    -Body $payload
```

## API Endpoints

### Endpoints Management
```powershell
# Create endpoint
Invoke-RestMethod -Uri "http://localhost:3001/api/endpoints" `
    -Method POST `
    -ContentType "application/json" `
    -Body '{"name":"Test Endpoint"}'

# List all endpoints
Invoke-RestMethod -Uri "http://localhost:3001/api/endpoints"

# Get specific endpoint
Invoke-RestMethod -Uri "http://localhost:3001/api/endpoints/ENDPOINT-ID"

# Delete endpoint
Invoke-RestMethod -Uri "http://localhost:3001/api/endpoints/ENDPOINT-ID" `
    -Method DELETE
```

### Webhooks
```powershell
# Get all webhooks
Invoke-RestMethod -Uri "http://localhost:3001/api/webhooks"

# Get webhooks for endpoint
Invoke-RestMethod -Uri "http://localhost:3001/api/endpoints/ENDPOINT-ID/webhooks"

# Get specific webhook
Invoke-RestMethod -Uri "http://localhost:3001/api/webhooks/WEBHOOK-ID"

# Replay webhook
Invoke-RestMethod -Uri "http://localhost:3001/api/webhooks/WEBHOOK-ID/replay" `
    -Method POST `
    -ContentType "application/json" `
    -Body '{"targetUrl":"https://your-target-url.com/webhook"}'

# Send test webhook
Invoke-RestMethod -Uri "http://localhost:3001/api/endpoints/ENDPOINT-ID/test" `
    -Method POST
```

## Troubleshooting

### Kill Port 3001 (Backend)
```powershell
# Find process
netstat -ano | findstr :3001

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Kill Port 3000 (Frontend)
```powershell
# Find process
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F
```

### Clear Node Modules
```powershell
# Backend
cd backend
Remove-Item -Recurse -Force node_modules
npm install

# Frontend
cd frontend
Remove-Item -Recurse -Force node_modules
npm install
```

### Check if servers are running
```powershell
# Backend health check
Invoke-RestMethod -Uri "http://localhost:3001/health"

# Should return: {"status":"ok","endpoints":0,"webhooks":0}
```

## Development

### Backend
```powershell
cd backend
npm run dev        # Start with nodemon (auto-restart)
npm start          # Start without auto-restart
```

### Frontend
```powershell
cd frontend
npm start          # Development server
npm run build      # Production build
npm test           # Run tests
```

## Environment Variables

### Backend (.env)
```
PORT=3001
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:3001
```

## Git Commands

```powershell
# Initial commit
git add .
git commit -m "Initial commit - Webhook Visualizer"
git push origin main

# Create new branch
git checkout -b feature/new-feature

# Push changes
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
```

## Useful URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/health
- **Example Webhook URL:** http://localhost:3001/webhook/YOUR-ENDPOINT-ID

## Quick Test Sequence

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm start`
3. Open browser: http://localhost:3000
4. Create endpoint: Enter name  Click "Generate"
5. Copy webhook URL
6. Send test: Click "Send Test" button
7. View webhook: Click on webhook in list
8. Inspect details: View headers, payload, timing

## Pro Tips

- Use `Ctrl+C` to stop servers
- Backend auto-restarts on file changes (nodemon)
- Frontend auto-refreshes on file changes (React)
- Use browser DevTools (F12) for debugging
- Check terminal for backend logs
- WebSocket errors usually mean backend isn't running

---

**Keep this reference handy during development! **
