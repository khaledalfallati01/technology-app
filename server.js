const express = require('express');
const cors = require('cors');
const https = require('https'); // استخدام المكتبة الأساسية لضمان التوافق
const app = express();
app.use(cors());
app.use(express.json());

const ADMIN_KEY = 'KA12345KA'; 
const TELEGRAM_TOKEN = '8253232251:AAG1N5GDuPnShhxsJNQi9Lzhgbq7GDMd0Kc';
const CHAT_ID = '8253232251';

let channels = []; 
let pendingRequests = []; 

// دالة إرسال التنبيه إلى تليجرام باستخدام مكتبة https الأساسية
function sendTelegramAlert(channelName) {
    const message = encodeURIComponent(`🔔 تنبيه من TechHub:\nهناك قناة جديدة تنتظر مراجعتك:\nاسم القناة: ${channelName}`);
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${message}`;

    https.get(url, (res) => {
        console.log('Telegram Status:', res.statusCode);
    }).on('error', (e) => {
        console.error('Telegram Error:', e);
    });
}

// جلب القنوات المعتمدة
app.get('/channels', (req, res) => res.json(channels));

// جلب الطلبات المعلقة للأدمن
app.get('/pending', (req, res) => {
    if (req.headers['x-admin-key'] === ADMIN_KEY) res.json(pendingRequests);
    else res.status(401).send('Unauthorized');
});

// استقبال طلب المستخدم وإرسال إشعار تليجرام
app.post('/request-channel', (req, res) => {
    const { name, link, desc } = req.body;
    const newRequest = { id: Date.now(), name, link, desc };
    pendingRequests.push(newRequest);
    
    // إرسال الإشعار
    sendTelegramAlert(name);
    
    res.status(200).json({ message: 'Sent' });
});

// إضافة قناة مباشرة من الأدمن
app.post('/add-channel', (req, res) => {
    if (req.headers['x-admin-key'] === ADMIN_KEY) {
        const { name, link, desc } = req.body;
        channels.push({ id: Date.now(), name, link, desc });
        return res.status(200).json({ message: 'Added' });
    }
    res.status(401).send('Unauthorized');
});

// الموافقة والرفض والحذف
app.post('/approve-channel/:id', (req, res) => {
    if (req.headers['x-admin-key'] === ADMIN_KEY) {
        const id = parseInt(req.params.id);
        const reqIndex = pendingRequests.findIndex(r => r.id === id);
        if (reqIndex > -1) {
            channels.push(pendingRequests[reqIndex]);
            pendingRequests.splice(reqIndex, 1);
            return res.status(200).json({ message: 'Approved' });
        }
    }
    res.status(401).send('Unauthorized');
});

app.delete('/reject-channel/:id', (req, res) => {
    if (req.headers['x-admin-key'] === ADMIN_KEY) {
        const id = parseInt(req.params.id);
        pendingRequests = pendingRequests.filter(r => r.id !== id);
        return res.status(200).json({ message: 'Rejected' });
    }
    res.status(401).send('Unauthorized');
});

app.delete('/delete-channel/:id', (req, res) => {
    if (req.headers['x-admin-key'] === ADMIN_KEY) {
        const id = parseInt(req.params.id);
        channels = channels.filter(ch => ch.id !== id);
        return res.status(200).json({ message: 'Deleted' });
    }
    res.status(401).send('Unauthorized');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Expert Server Running with Telegram Fix'));
