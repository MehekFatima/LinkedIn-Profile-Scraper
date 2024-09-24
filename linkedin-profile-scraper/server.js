// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const Profile = require('./models/Profile');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the LinkedIn Profile Scraper API!');
});

// Sync database and create the POST route
sequelize.sync().then(() => {
    console.log('Database synced');

    app.post('/api/profiles', async (req, res) => {
        const { name, url, about, bio, location, connectionCount } = req.body;
    
        // Check if required fields are present
        if (!name || !url) {
            return res.status(400).json({ error: 'Name and URL are required.' });
        }
    
        console.log('Received profile data:', req.body); // Log incoming data
    
        try {
            const profile = await Profile.create(req.body);
            res.status(201).json(profile);
        } catch (error) {
            console.error('Error saving profile:', error); // Log the error
            res.status(500).json({ error: error.message });
        }
    });
    

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
