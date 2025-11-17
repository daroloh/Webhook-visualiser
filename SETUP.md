#  Quick Start Guide

## Initial Setup

### 1. Install Dependencies

**Backend:**
```powershell
cd backend
npm install
```

**Frontend:**
```powershell
cd frontend
npm install
```

### 2. Environment Setup (Optional)

**Backend:**
```powershell
cd backend
copy .env.example .env
# Edit .env if you want to change the port
```

**Frontend:**
```powershell
cd frontend
copy .env.example .env
# Edit .env if your backend runs on a different URL
```

### 3. Start the Application

**Option A: Two Separate Terminals**

Terminal 1 (Backend):
```powershell
cd backend
npm run dev
```

Terminal 2 (Frontend):
```powershell
cd frontend
npm start
```

**Option B: Using the provided scripts**

From the root directory:
```powershell
# Start backend
npm run start:backend

# In another terminal, start frontend
npm run start:frontend
```

### 4. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/health

---

## Testing Your Setup

### 1. Generate a Webhook Endpoint
1. Open http://localhost:3000
2. Enter a name (e.g., "Test Endpoint")
3. Click "Generate Endpoint"
4. Copy the generated URL

### 2. Send a Test Webhook

**Using the UI:**
- Click the " Send Test" button

**Using cURL:**
```powershell
curl -X POST http://localhost:3001/webhook/YOUR-ENDPOINT-ID `
  -H "Content-Type: application/json" `
  -d '{\"event\":\"test\",\"message\":\"Hello Webhook!\"}'
```

**Using PowerShell:**
```powershell
$body = @{
    event = "test"
    message = "Hello Webhook!"
    timestamp = (Get-Date).ToString("o")
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/webhook/YOUR-ENDPOINT-ID" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

### 3. View Your Webhook
- Check the dashboard - you should see your webhook appear in real-time!
- Click on it to view full details

---

## Troubleshooting

### Port Already in Use

**Backend (Port 3001):**
```powershell
# Find process using port 3001
netstat -ano | findstr :3001

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Frontend (Port 3000):**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F
```

### WebSocket Connection Failed
- Ensure backend is running on port 3001
- Check browser console for specific error messages
- Verify no firewall is blocking WebSocket connections

### CORS Errors
- The backend is configured with CORS enabled
- If issues persist, check that frontend proxy is set correctly in `frontend/package.json`

---

## Next Steps

1. **Explore Features:**
   - Try the replay functionality
   - Check out the code snippets tab
   - Test signature verification

2. **Integrate with Real APIs:**
   - Use your endpoint URL with Stripe, GitHub, etc.
   - Set up signature verification for production use

3. **Customize:**
   - Add more code snippet languages
   - Implement database persistence
   - Add user authentication

---

## Development Tips

### Hot Reload
- Backend: Uses `nodemon` for automatic restart on file changes
- Frontend: React's built-in hot reload

### Debugging
- Backend logs appear in the terminal
- Frontend: Use React DevTools browser extension
- Check Network tab in browser for API calls

### Making Changes
- Backend: Edit files in `backend/` - server auto-restarts
- Frontend: Edit files in `frontend/src/` - browser auto-refreshes

---

Happy coding! 
