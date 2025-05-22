// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB Verbindung
mongoose.connect('mongodb://localhost:27017/geoboost', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Email Modell
const Email = mongoose.model('Email', new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
}));

// Subscribe Endpoint
app.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        
        // Validierung
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: 'Ungültige E-Mail-Adresse' });
        }
        
        // Speichern in DB
        const newEmail = new Email({ email });
        await newEmail.save();
        
        // Hier könntest du einen Email-Service wie SendGrid einbinden
        // await sendConfirmationEmail(email);
        
        res.status(200).json({ message: 'Erfolgreich angemeldet!' });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'Diese E-Mail ist bereits registriert' });
        } else {
            console.error('Fehler:', error);
            res.status(500).json({ message: 'Serverfehler' });
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));