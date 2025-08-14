const express = require('express');
const Redis = require('ioredis');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const app = express();
const port = process.env.PORT || 3000;

// Redis configuration
const redis = new Redis({
    host: process.env.REDIS_HOST || 'switchback.proxy.rlwy.net',
    port: process.env.REDIS_PORT || 14760,
    password: process.env.REDIS_PASSWORD || 'AJFZvlgmJBkEFBEYrjimvnVUvkvWlkFB',
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3
});

// Session configuration
app.use(session({
    secret: 'fcm-token-manager-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Authentication credentials
const ADMIN_USERNAME = 'thonewathan-noti';
const ADMIN_PASSWORD = 'Facai8898@';

// Authentication middleware
const requireAuth = (req, res, next) => {
    if (req.session.authenticated) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Login route
app.get('/login', (req, res) => {
    if (req.session.authenticated) {
        res.redirect('/');
    } else {
        res.sendFile(path.join(__dirname, 'public', 'login.html'));
    }
});

// Login POST route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        req.session.authenticated = true;
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/login');
    });
});

// Protected routes
app.get('/', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API to save FCM token
app.post('/save-fcm-token', requireAuth, async (req, res) => {
    try {
        const { token, timestamp, expiration } = req.body;
        
        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }

        // Check if token already exists
        const existingKeys = await redis.keys('fcm_token:*');
        let tokenExists = false;
        
        for (const key of existingKeys) {
            const existingToken = await redis.get(key);
            if (existingToken === token) {
                tokenExists = true;
                break;
            }
        }

        if (tokenExists) {
            console.log(`FCM token already exists: ${token.substring(0, 20)}...`);
            return res.json({ success: true, message: 'Token already exists', duplicate: true });
        }

        // Save token with timestamp as key
        const key = `fcm_token:${timestamp || Date.now()}`;
        await redis.setex(key, expiration || (30 * 24 * 60 * 60), token);
        
        // Also add to list for tracking (only if not duplicate)
        await redis.lpush('fcm_tokens_list', token);
        await redis.ltrim('fcm_tokens_list', 0, 999); // Keep only last 1000
        
        console.log(`FCM token saved: ${token.substring(0, 20)}...`);
        res.json({ success: true, message: 'Token saved successfully', duplicate: false });
        
    } catch (error) {
        console.error('Error saving FCM token:', error);
        res.status(500).json({ error: 'Failed to save token' });
    }
});

// API to get all FCM tokens
app.get('/api/tokens', requireAuth, async (req, res) => {
    try {
        // Get all keys that match fcm_token:*
        const keys = await redis.keys('fcm_token:*');
        const tokens = [];
        
        for (const key of keys) {
            const token = await redis.get(key);
            const timestamp = key.split(':')[1];
            
            if (token) {
                tokens.push({
                    token: token,
                    timestamp: parseInt(timestamp),
                    date: new Date(parseInt(timestamp)).toLocaleString(),
                    key: key
                });
            }
        }
        
        // Sort by timestamp (newest first)
        tokens.sort((a, b) => b.timestamp - a.timestamp);
        
        res.json({ tokens: tokens, count: tokens.length });
        
    } catch (error) {
        console.error('Error fetching tokens:', error);
        res.status(500).json({ error: 'Failed to fetch tokens' });
    }
});

// API to get token list
app.get('/api/token-list', requireAuth, async (req, res) => {
    try {
        const tokens = await redis.lrange('fcm_tokens_list', 0, -1);
        res.json({ tokens: tokens, count: tokens.length });
        
    } catch (error) {
        console.error('Error fetching token list:', error);
        res.status(500).json({ error: 'Failed to fetch token list' });
    }
});

// API to delete a token
app.delete('/api/token/:key', requireAuth, async (req, res) => {
    try {
        const key = req.params.key;
        await redis.del(key);
        res.json({ success: true, message: 'Token deleted' });
        
    } catch (error) {
        console.error('Error deleting token:', error);
        res.status(500).json({ error: 'Failed to delete token' });
    }
});

// API to clear all tokens
app.delete('/api/tokens/clear', async (req, res) => {
    try {
        const keys = await redis.keys('fcm_token:*');
        if (keys.length > 0) {
            await redis.del(...keys);
        }
        await redis.del('fcm_tokens_list');
        res.json({ success: true, message: 'All tokens cleared' });
        
    } catch (error) {
        console.error('Error clearing tokens:', error);
        res.status(500).json({ error: 'Failed to clear tokens' });
    }
});

// API to remove duplicates
app.post('/api/tokens/remove-duplicates', async (req, res) => {
    try {
        const keys = await redis.keys('fcm_token:*');
        const tokens = new Map();
        const duplicates = [];
        
        // Find duplicates
        for (const key of keys) {
            const token = await redis.get(key);
            if (tokens.has(token)) {
                duplicates.push(key);
            } else {
                tokens.set(token, key);
            }
        }
        
        // Remove duplicates
        if (duplicates.length > 0) {
            await redis.del(...duplicates);
        }
        
        // Rebuild token list without duplicates
        await redis.del('fcm_tokens_list');
        for (const [token] of tokens) {
            await redis.lpush('fcm_tokens_list', token);
        }
        
        res.json({ 
            success: true, 
            message: `Removed ${duplicates.length} duplicate tokens`,
            duplicatesRemoved: duplicates.length,
            uniqueTokens: tokens.size
        });
        
    } catch (error) {
        console.error('Error removing duplicates:', error);
        res.status(500).json({ error: 'Failed to remove duplicates' });
    }
});

// API to send notifications (real implementation)
app.post('/api/send-notification', async (req, res) => {
    try {
        const { tokens, title, message, url, image } = req.body;
        
        if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
            return res.status(400).json({ error: 'Tokens array is required' });
        }
        
        if (!title || !message) {
            return res.status(400).json({ error: 'Title and message are required' });
        }

        // Firebase Admin SDK configuration
        const admin = require('firebase-admin');
        
        // Initialize Firebase Admin if not already initialized
        if (!admin.apps.length) {
            try {
                // Try to use environment variable first
                if (process.env.FIREBASE_SERVICE_ACCOUNT) {
                    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
                    admin.initializeApp({
                        credential: admin.credential.cert(serviceAccount)
                    });
                } else {
                    // Fallback to default credentials
                    admin.initializeApp({
                        credential: admin.credential.applicationDefault()
                    });
                }
                console.log('Firebase Admin SDK initialized successfully');
            } catch (error) {
                console.error('Error initializing Firebase Admin SDK:', error);
                return res.status(500).json({ 
                    error: 'Firebase Admin SDK not configured properly. Please check FIREBASE_SERVICE_ACCOUNT environment variable.' 
                });
            }
        }

        const messaging = admin.messaging();
        let sentCount = 0;
        let failedCount = 0;
        const results = [];

        // Send to each token
        for (const token of tokens) {
            try {
                const notificationPayload = {
                    token: token,
                    data: {
                        title: title,
                        body: message,
                        ...(url && { url: url }),
                        ...(image && { image: image }),
                        click_action: 'FLUTTER_NOTIFICATION_CLICK',
                        timestamp: Date.now().toString()
                    },
                    android: {
                        priority: 'high'
                    },
                    apns: {
                        payload: {
                            aps: {
                                ...(url && { 'mutable-content': '1' }),
                                sound: 'default',
                                badge: 1
                            }
                        },
                        fcm_options: {
                            ...(url && { image: image })
                        }
                    },
                    webpush: {
                        notification: {
                            ...(image && { icon: image }),
                            ...(url && { requireInteraction: true }),
                            actions: url ? [
                                {
                                    action: 'open',
                                    title: 'Open',
                                    icon: 'https://www.fanzygame.shop/images/log_or_fav.png'
                                }
                            ] : undefined
                        },
                        fcm_options: {
                            ...(url && { link: url })
                        }
                    }
                };

                const response = await messaging.send(notificationPayload);
                results.push({ token: token.substring(0, 20) + '...', success: true, messageId: response });
                sentCount++;
                console.log(`✅ Notification sent successfully to ${token.substring(0, 20)}...`);
                
            } catch (error) {
                console.error(`❌ Failed to send to token ${token.substring(0, 20)}...:`, error.message);
                results.push({ token: token.substring(0, 20) + '...', success: false, error: error.message });
                failedCount++;
            }
        }

        console.log(`📊 Notification summary: ${sentCount} successful, ${failedCount} failed`);
        
        res.json({
            success: true,
            message: `Notification sent to ${sentCount} devices successfully!`,
            sentCount: sentCount,
            failedCount: failedCount,
            results: results
        });
        
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).json({ error: 'Failed to send notification: ' + error.message });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(port, () => {
    console.log(`FCM Token Server running at http://localhost:${port}`);
    console.log(`Redis connected to: switchback.proxy.rlwy.net:14760`);
});
