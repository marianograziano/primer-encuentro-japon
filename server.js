
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Allow large payloads for images if needed
app.use(express.static(path.join(__dirname, '.')));

// Database Setup
const dbPath = path.join(__dirname, 'content.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Connected to SQLite database.');
        initializeDb();
    }
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
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Sanitize filename and timestamp
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
    }
});
const upload = multer({ storage: storage });

// Routes

// 1. Get All Content
app.get('/api/sections', (req, res) => {
    db.all("SELECT * FROM sections", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});

// 2. Save Section (Upsert)
app.post('/api/save', (req, res) => {
    const { id, layout, content_html, images_html } = req.body;

    const sql = `INSERT INTO sections (id, layout, content_html, images_html, updated_at) 
                 VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
                 ON CONFLICT(id) DO UPDATE SET 
                    layout=excluded.layout,
                    content_html=excluded.content_html,
                    images_html=excluded.images_html,
                    updated_at=CURRENT_TIMESTAMP`;

    db.run(sql, [id, layout, content_html, images_html], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Saved successfully', changes: this.changes });
    });
});

// 3. Upload Image
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
    }
    // Return relative path
    const imageUrl = `uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
