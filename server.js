const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// هذا هو المفتاح السري الذي سيحل مشكلة الخطأ 401
const ADMIN_KEY = 'tech2025'; 

let channels = [];

// مسح لجلب القنوات
app.get('/channels', (req, res) => {
    res.json(channels);
});

// مسار إضافة قناة جديدة مع التحقق من المفتاح
app.post('/add-channel', (req, res) => {
    const userKey = req.headers['x-admin-key'];
    
    if (userKey !== ADMIN_KEY) {
        return res.status(401).json({ error: 'غير مصرح لك' });
    }

    const { name, link } = req.body;
    if (name && link) {
        channels.push({ name, link });
        return res.status(200).json({ message: 'تمت الإضافة بنجاح' });
    }
    res.status(400).json({ error: 'بيانات ناقصة' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
