
require('dotenv').config(); // Load env vars
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adminJapon2025'; // Default fallback (CHANGE THIS IN PROD)

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Allow large payloads
app.use(session({
    secret: 'japansessionsecretkey8823', // In prod, use strong random env var
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if using HTTPS behind proxy correctly configured (trust proxy)
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Auth Middleware
const requireAuth = (req, res, next) => {
    if (req.session && req.session.isAdmin) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
};

const requireAuthRedirect = (req, res, next) => {
    if (req.session && req.session.isAdmin) {
        return next();
    }
    res.redirect('/login.html');
};

// --- STATIC FILE SERVING INTERCEPTION ---
// Verify editor access BEFORE serving static files
app.get('/editor.html', requireAuthRedirect, (req, res) => {
    res.sendFile(path.join(__dirname, 'editor.html'));
});
// Serve other static files publicly
app.use(express.static(path.join(__dirname, '.')));


// Database Setup
const dbPath = path.join(__dirname, 'content.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Error opening database', err);
    else { console.log('Connected to SQLite database.'); initializeDb(); }
});

function initializeDb() {
    db.run(`CREATE TABLE IF NOT EXISTS sections (
        id TEXT PRIMARY KEY,
        layout TEXT,
        content_html TEXT,
        images_html TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
}

// Image Upload Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
    }
});
const upload = multer({ storage: storage });

// Routes

// 1. Login Route
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    // Simple check. In prod, use standard comparison or hash.
    // For single user admin, strict equality of env pwd is secure enough if env is secure.
    if (password && password === ADMIN_PASSWORD) {
        req.session.isAdmin = true;
        res.json({ success: true });
    } else {
        res.status(401).json({ error: 'Invalid password' });
    }
});

// 2. Check Auth Status (for frontend init)
app.get('/api/me', (req, res) => {
    res.json({ isAdmin: !!req.session.isAdmin });
});

// 3. Logout
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// 4. Get All Content (PUBLIC - Viewer needs this)
app.get('/api/sections', (req, res) => {
    db.all("SELECT * FROM sections", [], (err, rows) => {
        if (err) { res.status(500).json({ error: err.message }); return; }
        res.json({ data: rows });
    });
});

// 5. Save Section (PROTECTED)
app.post('/api/save', requireAuth, (req, res) => {
    const { id, layout, content_html, images_html } = req.body;
    const sql = `INSERT INTO sections (id, layout, content_html, images_html, updated_at) 
                 VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
                 ON CONFLICT(id) DO UPDATE SET 
                    layout=excluded.layout,
                    content_html=excluded.content_html,
                    images_html=excluded.images_html,
                    updated_at=CURRENT_TIMESTAMP`;

    db.run(sql, [id, layout, content_html, images_html], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Saved successfully', changes: this.changes });
    });
});

// 6. Upload Image (PROTECTED)
app.post('/api/upload', requireAuth, upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
    const imageUrl = `uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
