#  Getting Started - Webhook Visualizer

Welcome! This guide will help you get the Webhook Visualizer up and running in just a few minutes.

##  Quick Start (2 minutes)

### 1 Install Dependencies

Open two terminals/command prompts:

**Terminal 1 - Backend:**
```powershell
cd backend
npm install
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm install
```

### 2 Start the Application

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```
 You should see: ` Webhook Visualizer Backend running on port 3001`

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm start
```
 Browser should automatically open to `http://localhost:3000`

### 3 Create Your First Webhook Endpoint

1. In the browser, enter a name (e.g., "My First Endpoint")
2. Click **" Generate Endpoint"**
3. Copy the generated webhook URL
4. Click **" Send Test"** to send a test webhook
5. Watch it appear instantly! 

**That's it! You're ready to go!** 

---

##  What's Next?

### Try These Features:
-  **Send webhooks** using cURL or PowerShell (see QUICK_REFERENCE.md)
-  **Inspect details** by clicking on any webhook
-  **Replay webhooks** to test your own endpoints
-  **Copy code snippets** for Express, FastAPI, Flask, or cURL

### Read the Documentation:
- **SETUP.md** - Detailed setup and troubleshooting
- **QUICK_REFERENCE.md** - Common commands and examples
- **INTERVIEW_GUIDE.md** - Demo script for interviews
- **ARCHITECTURE.md** - Technical deep dive

---

##  Quick Test

Send a webhook using PowerShell:

```powershell
$body = @{
    event = "user.signup"
    email = "test@example.com"
    timestamp = (Get-Date).ToString("o")
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/webhook/YOUR-ENDPOINT-ID" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

Replace `YOUR-ENDPOINT-ID` with the ID from your generated URL!

---

##  Troubleshooting

### "Port 3001 already in use"
```powershell
# Find and kill the process
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### "WebSocket connection failed"
Make sure the backend is running on port 3001. Check Terminal 1.

### "Cannot find module"
```powershell
# Reinstall dependencies
cd backend
Remove-Item -Recurse -Force node_modules
npm install
```

---

##  Project Structure

```
webhook-visualiser/
 backend/              # Express.js server
    server.js        # Main server file
    package.json     # Dependencies
    .env.example     # Environment template
 frontend/            # React application
    src/
       App.js       # Main app component
       components/  # React components
       ...
    public/
    package.json
 README.md            # Main documentation
 SETUP.md             # Detailed setup guide
 QUICK_REFERENCE.md   # Command reference
 INTERVIEW_GUIDE.md   # Demo preparation
 ARCHITECTURE.md      # Technical details
```

---

##  Learning Resources

### Key Concepts Demonstrated:
- **Webhooks** - Event-driven API communication
- **HMAC Signatures** - Webhook security and verification
- **WebSockets** - Real-time bidirectional communication
- **RESTful APIs** - Backend API design
- **React Hooks** - Modern React patterns
- **Developer Experience** - Tooling and UX

---

##  Pro Tips

1. **Real-time updates** work via WebSocket - you'll see webhooks appear instantly
2. **Test webhooks** are marked with a special badge
3. **Signature verification** shows  or  when configured
4. **Code snippets** are ready to copy-paste into your projects
5. **Replay feature** is great for testing error handling

---

##  Use Cases

### During Development:
- Test webhook integrations without external services
- Debug webhook payloads and headers
- Verify signature implementation
- Prototype webhook-based features

### For Interviews:
- Demonstrate API knowledge
- Show security understanding
- Explain architecture decisions
- Prove production-ready thinking

### For Learning:
- Understand webhook patterns
- Practice security best practices
- Learn real-time communication
- Study full-stack development

---

##  Need Help?

- **Setup issues?**  Check SETUP.md
- **Common commands?**  Check QUICK_REFERENCE.md
- **Interview prep?**  Check INTERVIEW_GUIDE.md
- **Technical details?**  Check ARCHITECTURE.md
- **General info?**  Check README.md

---

##  Features at a Glance

| Feature | Description | Status |
|---------|-------------|--------|
| Endpoint Generation | Create unique webhook URLs |  Ready |
| Webhook Capture | Receive any HTTP method |  Ready |
| Real-time Updates | WebSocket-powered |  Ready |
| Signature Verification | HMAC-SHA256 security |  Ready |
| Webhook Inspector | Full details view |  Ready |
| Test Webhooks | One-click testing |  Ready |
| Replay Feature | Resend webhooks |  Ready |
| Code Snippets | Express, FastAPI, Flask, cURL |  Ready |
| JSON Viewer | Beautiful formatting |  Ready |
| Delivery Timeline | Attempt tracking |  Ready |

---

##  You're All Set!

The application is ready to use. Have fun exploring webhooks!

**Next Steps:**
1. Create an endpoint
2. Send some test webhooks
3. Explore the features
4. Check out the code snippets
5. Try the replay functionality

**Happy webhook visualizing! **

---

*Questions? Issues? Check the documentation files in this folder!*
