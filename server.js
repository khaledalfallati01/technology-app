const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const ADMIN_KEY = 'KA12345KA'; 
let channels = []; 
let pendingRequests = []; // مخزن الطلبات الجديدة

app.get('/channels', (req, res) => res.json(channels));
app.get('/pending', (req, res) => {
    if (req.headers['x-admin-key'] === ADMIN_KEY) res.json(pendingRequests);
    else res.status(401).send('Unauthorized');
});

// المستخدم يرسل طلب إضافة
app.post('/request-channel', (req, res) => {
    const { name, link, desc } = req.body;
    pendingRequests.push({ id: Date.now(), name, link, desc });
    res.status(200).json({ message: 'Sent' });
});

// الأدمن يوافق على الطلب
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

// الأدمن يرفض الطلب
app.delete('/reject-channel/:id', (req, res) => {
    if (req.headers['x-admin-key'] === ADMIN_KEY) {
        const id = parseInt(req.params.id);
        pendingRequests = pendingRequests.filter(r => r.id !== id);
        return res.status(200).json({ message: 'Rejected' });
    }
    res.status(401).send('Unauthorized');
});

// حذف قناة موجودة
app.delete('/delete-channel/:id', (req, res) => {
    if (req.headers['x-admin-key'] === ADMIN_KEY) {
        const id = parseInt(req.params.id);
        channels = channels.filter(ch => ch.id !== id);
        return res.status(200).json({ message: 'Deleted' });
    }
    res.status(401).send('Unauthorized');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Expert Server V2 Running'));
