# 🔥 FCM Token Manager

A Node.js server to view and manage Firebase Cloud Messaging (FCM) tokens stored in Redis.

## Features

- 📱 **Web Interface**: Beautiful, responsive web UI to view FCM tokens
- 🔄 **Real-time Updates**: Auto-refresh every 30 seconds
- 📋 **Token Management**: Copy, delete, and clear tokens
- 📊 **Statistics**: View total tokens and last updated time
- 🔐 **Redis Integration**: Connects to your Redis server
- 🚀 **REST API**: Full API for token management

## Installation

1. **Install Node.js** (version 14 or higher)

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

## Configuration

The server is configured to connect to your Redis server:
- **Host**: `switchback.proxy.rlwy.net`
- **Port**: `14760`
- **Password**: `AJFZvlgmJBkEFBEYrjimvnVUvkvWlkFB`

## Usage

### Web Interface

1. Open your browser and go to: `http://localhost:3000`
2. You'll see a beautiful interface showing all FCM tokens
3. Use the buttons to:
   - 🔄 **Refresh Tokens**: Reload the token list
   - 📋 **View Token List**: Show tokens from the Redis list
   - 🗑️ **Clear All Tokens**: Remove all tokens (be careful!)

### API Endpoints

#### Get All Tokens
```bash
GET /api/tokens
```

#### Get Token List
```bash
GET /api/token-list
```

#### Save FCM Token
```bash
POST /save-fcm-token
Content-Type: application/json

{
  "token": "your_fcm_token_here",
  "timestamp": 1734184320000,
  "expiration": 2592000
}
```

#### Delete Token
```bash
DELETE /api/token/:key
```

#### Clear All Tokens
```bash
DELETE /api/tokens/clear
```

#### Health Check
```bash
GET /health
```

## Android App Integration

The Android app will automatically send FCM tokens to this server when:
1. The app starts
2. A new FCM token is generated
3. The Firebase service refreshes the token

## Token Storage

Tokens are stored in Redis with:
- **Individual Keys**: `fcm_token:{timestamp}` with expiration
- **Token List**: `fcm_tokens_list` for tracking all tokens
- **Expiration**: 30 days by default

## Features

### Web Interface Features
- ✅ **Responsive Design**: Works on desktop and mobile
- ✅ **Real-time Updates**: Auto-refresh every 30 seconds
- ✅ **Token Copy**: One-click copy to clipboard
- ✅ **Token Deletion**: Delete individual tokens
- ✅ **Bulk Clear**: Clear all tokens at once
- ✅ **Statistics**: View token counts and timestamps
- ✅ **Beautiful UI**: Modern gradient design

### API Features
- ✅ **RESTful API**: Standard HTTP methods
- ✅ **Error Handling**: Proper error responses
- ✅ **JSON Responses**: All responses in JSON format
- ✅ **CORS Support**: Cross-origin requests allowed
- ✅ **Health Check**: Server status endpoint

## Troubleshooting

### Server Won't Start
1. Check if Node.js is installed: `node --version`
2. Check if dependencies are installed: `npm install`
3. Check if port 3000 is available

### Can't Connect to Redis
1. Check Redis server is running
2. Verify host, port, and password in `server.js`
3. Check network connectivity

### No Tokens Showing
1. Make sure the Android app is sending tokens
2. Check Redis connection
3. Verify token keys in Redis: `keys fcm_token:*`

## Development

### Project Structure
```
fcm-token-server/
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── public/            # Static files
│   └── index.html     # Web interface
└── README.md          # This file
```

### Adding Features
1. Add new routes in `server.js`
2. Update the web interface in `public/index.html`
3. Test with the Android app

## Security Notes

- The server runs on localhost by default
- Redis password is stored in the code (consider using environment variables)
- No authentication on the web interface (add if needed for production)

## License

MIT License - feel free to modify and use as needed.
