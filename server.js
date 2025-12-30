const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// مفتاح الحماية للأدمن
const ADMIN_KEY = 'KA12345KA'; 

// قاعدة بيانات مؤقتة (سيتم مسحها عند ريستارت السيرفر)
let channels = [];

// 1. جلب جميع القنوات (للمستخدم)
app.get('/channels', (req, res) => {
    res.json(channels);
});

// 2. إضافة قناة جديدة (للأدمن)
app.post('/add-channel', (req, res) => {
    const key = req.headers['x-admin-key'];
    
    if (key !== ADMIN_KEY) {
        return res.status(401).json({ error: 'غير مصرح لك' });
    }

    const { name, link } = req.body;
    if (!name || !link) {
        return res.status(400).json({ error: 'الاسم والرابط مطلوبان' });
    }

    const newChannel = {
        id: Date.now(),
        name: name,
        link: link,
        created_at: new Date()
    };

    channels.push(newChannel);
    res.status(201).json({ message: 'تمت الإضافة بنجاح' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
