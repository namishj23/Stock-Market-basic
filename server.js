const express = require('express');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(cors());
app.use(express.json());

// IN-MEMORY DATABASE (Resets when server restarts)
const users = {}; 
const predictions = {}; 

// 1. VERIFY GOOGLE TOKEN & CREATE SESSION
app.post('/api/auth/google', async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        
        const payload = ticket.getPayload();
        const googleId = payload['sub'];
        const email = payload['email'];
        const name = payload['name'];

        // Store user in memory if they don't exist
        if (!users[googleId]) {
            users[googleId] = { id: googleId, email, name };
        }

        // Create a JWT (Session Ticket)
        const sessionToken = jwt.sign({ userId: googleId }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token: sessionToken, user: users[googleId] });
    } catch (error) {
        res.status(401).json({ error: "Invalid Google Token" });
    }
});

// 2. PROTECTED ROUTE: SUBMIT PREDICTION
app.post('/api/predict', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Please log in first" });

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const { stock, direction, justification } = req.body;
        const today = new Date().toDateString(); // "Wed Jan 07 2026"

        // Enforce one prediction per day
        const predictionKey = `${userId}-${today}`;
        if (predictions[predictionKey]) {
            return res.status(400).json({ error: "You already submitted today!" });
        }

        // Save prediction
        predictions[predictionKey] = { stock, direction, justification };
        
        res.json({ success: true, message: "Prediction locked for " + today });
    } catch (err) {
        res.status(403).json({ error: "Session expired. Please log in again." });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));