#!/bin/bash

echo "🚀 Deploying FCM Token Server to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Login to Railway
echo "🔐 Logging into Railway..."
railway login

# Initialize project
echo "🏗️ Initializing Railway project..."
railway init

# Set environment variables
echo "⚙️ Setting environment variables..."
railway variables set REDIS_HOST=switchback.proxy.rlwy.net
railway variables set REDIS_PORT=14760
railway variables set REDIS_PASSWORD=AJFZvlgmJBkEFBEYrjimvnVUvkvWlkFB
railway variables set NODE_ENV=production

# Deploy
echo "🚀 Deploying to Railway..."
railway up

echo "✅ Deployment complete!"
echo "🌐 Your app will be available at: https://your-app-name.railway.app"
echo "📱 Update your Android app with the new URL!"
