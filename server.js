const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const ADMIN_SECRET_KEY = "123456"; 
let channels = []; 

app.get('/channels', (req, res) => {
    res.json(channels);
});

app.post('/add-channel', (req, res) => {
    const adminKey = req.headers['admin-secret'];
    const { name, link } = req.body;
    if (adminKey !== ADMIN_SECRET_KEY) {
        return res.status(401).json({ error: "غير مصرح لك!" });
    }
    const newChannel = { id: Date.now(), name, link };
    channels.push(newChannel);
    res.status(201).json({ message: "تمت الإضافة", channel: newChannel });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server is running'));
