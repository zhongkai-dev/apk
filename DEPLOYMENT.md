# 🚀 FCM Token Server Deployment Guide

## **Quick Deploy Options:**

### **Option 1: Railway (Easiest - Free)**
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Deploy
railway init
railway up
```

### **Option 2: Render (Free Tier)**
```bash
# 1. Connect your GitHub repo to Render
# 2. Create new Web Service
# 3. Set build command: npm install
# 4. Set start command: npm start
# 5. Add environment variables:
#    REDIS_HOST=switchback.proxy.rlwy.net
#    REDIS_PORT=14760
#    REDIS_PASSWORD=AJFZvlgmJBkEFBEYrjimvnVUvkvWlkFB
```

### **Option 3: Heroku (Free Tier)**
```bash
# 1. Install Heroku CLI
# 2. Login
heroku login

# 3. Create app
heroku create your-fcm-server

# 4. Set environment variables
heroku config:set REDIS_HOST=switchback.proxy.rlwy.net
heroku config:set REDIS_PORT=14760
heroku config:set REDIS_PASSWORD=AJFZvlgmJBkEFBEYrjimvnVUvkvWlkFB

# 5. Deploy
git push heroku main
```

### **Option 4: DigitalOcean App Platform**
```bash
# 1. Connect GitHub repo
# 2. Create new app
# 3. Select Node.js
# 4. Set environment variables
# 5. Deploy
```

### **Option 5: VPS with Docker**
```bash
# 1. SSH to your VPS
ssh user@your-server.com

# 2. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 3. Clone your repo
git clone https://github.com/your-username/fcm-token-server.git
cd fcm-token-server

# 4. Deploy with Docker Compose
docker-compose up -d

# 5. Your server will be available at:
# http://your-server-ip:3000
```

## **Update Android App for Public URL:**

After deploying, update the Android app with your public URL:

```java
// In TokenService.java, change:
private static final String API_URL = "https://your-app-name.railway.app";
// or
private static final String API_URL = "https://your-app-name.onrender.com";
// or
private static final String API_URL = "https://your-app-name.herokuapp.com";
```

## **Environment Variables:**

Set these in your deployment platform:

```bash
REDIS_HOST=switchback.proxy.rlwy.net
REDIS_PORT=14760
REDIS_PASSWORD=AJFZvlgmJBkEFBEYrjimvnVUvkvWlkFB
NODE_ENV=production
PORT=3000
```

## **Custom Domain (Optional):**

1. **Buy a domain** (e.g., from Namecheap, GoDaddy)
2. **Point DNS** to your deployed app
3. **Update Android app** with your custom domain:
   ```java
   private static final String API_URL = "https://fcm.yourdomain.com";
   ```

## **SSL Certificate:**

Most platforms (Railway, Render, Heroku) provide free SSL certificates automatically.

## **Monitoring:**

- **Health Check**: `https://your-app.com/health`
- **Web Interface**: `https://your-app.com`
- **API Endpoint**: `https://your-app.com/save-fcm-token`

## **Recommended: Railway (Free & Easy)**

1. **Go to**: https://railway.app
2. **Sign up** with GitHub
3. **Create new project**
4. **Deploy from GitHub repo**
5. **Add environment variables**
6. **Get your public URL**: `https://your-app-name.railway.app`

## **Testing After Deployment:**

1. **Update Android app** with new public URL
2. **Rebuild and install** the APK
3. **Test token saving** from the app
4. **Check web interface** at your public URL

Your FCM tokens will now be accessible from anywhere in the world! 🌍
