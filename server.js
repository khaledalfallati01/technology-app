const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// كلمة المرور التي طلبتها
const ADMIN_KEY = 'KA12345KA'; 

let channels = []; 

app.get('/channels', (req, res) => {
    res.json(channels);
});

app.post('/add-channel', (req, res) => {
    const userKey = req.headers['x-admin-key'];
    if (userKey !== ADMIN_KEY) {
        return res.status(401).json({ error: 'كلمة مرور خاطئة' });
    }
    const { name, link } = req.body;
    if (name && link) {
        channels.push({ name, link });
        return res.status(200).json({ message: 'تمت الإضافة بنجاح' });
    }
    res.status(400).json({ error: 'بيانات ناقصة' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Ready`));
