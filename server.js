const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/analyze', (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    const lowerText = text.toLowerCase();
    const needs = [];

    if (lowerText.includes('water')) {
        needs.push({ category: 'Water', priority: 'High' });
    }
    if (lowerText.includes('medical')) {
        needs.push({ category: 'Medical', priority: 'Medium' });
    }
    if (lowerText.includes('food')) {
        needs.push({ category: 'Food', priority: 'Low' });
    }

    res.json({ needs });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});