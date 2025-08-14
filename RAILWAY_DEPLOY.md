# 🚀 Railway Deployment Guide

## **Your Railway Project is Ready!**

**Project**: `independent-purpose`  
**Service**: `testing`  
**URL**: `https://testing-production-0a66.up.railway.app`

## **Step-by-Step Deployment:**

### **1. Go to Railway Dashboard**
- Visit: https://railway.app/dashboard
- Login with your GitHub account
- Find your project: `independent-purpose`

### **2. Set Environment Variables**
In your Railway project dashboard:

1. **Click on your service**: `testing`
2. **Go to Variables tab**
3. **Add these environment variables**:

```
REDIS_HOST=switchback.proxy.rlwy.net
REDIS_PORT=14760
REDIS_PASSWORD=AJFZvlgmJBkEFBEYrjimvnVUvkvWlkFB
NODE_ENV=production
PORT=3000
```

### **3. Deploy Your Code**
1. **Go to Deployments tab**
2. **Click "Deploy"** or **"Redeploy"**
3. **Wait for deployment to complete** (2-3 minutes)

### **4. Test Your Deployment**
Once deployed, test these URLs:

- **Health Check**: `https://testing-production-0a66.up.railway.app/health`
- **Web Interface**: `https://testing-production-0a66.up.railway.app`
- **Test Page**: `https://testing-production-0a66.up.railway.app/test.html`

## **Update Android App**

After successful deployment, update your Android app:

```java
// In TokenService.java, change:
private static final String API_URL = "https://testing-production-0a66.up.railway.app";
```

## **Rebuild Android App**

```bash
./gradlew.bat assembleDebug
```

## **Test FCM Token Saving**

1. **Install the updated APK**
2. **Open the app**
3. **Navigate to**: `https://testing-production-0a66.up.railway.app/test.html`
4. **Click "Save FCM Token"**
5. **Check the web interface** for tokens

## **Troubleshooting**

If deployment fails:
1. **Check Railway logs** in the dashboard
2. **Verify environment variables** are set correctly
3. **Ensure all files are committed** to your repository
4. **Try redeploying** from the Railway dashboard

## **Your Public URLs**

✅ **Main Interface**: `https://testing-production-0a66.up.railway.app`  
✅ **Health Check**: `https://testing-production-0a66.up.railway.app/health`  
✅ **Test Page**: `https://testing-production-0a66.up.railway.app/test.html`  
✅ **API Endpoint**: `https://testing-production-0a66.up.railway.app/save-fcm-token`

Your FCM token server will be accessible from anywhere in the world! 🌍
