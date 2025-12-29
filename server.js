const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const ADMIN_KEY = 'KA12345KA'; 
let channels = []; 
let pendingRequests = []; 

// جلب القنوات المعتمدة
app.get('/channels', (req, res) => res.json(channels));

// جلب الطلبات المعلقة (للأدمن فقط)
app.get('/pending', (req, res) => {
    if (req.headers['x-admin-key'] === ADMIN_KEY) res.json(pendingRequests);
    else res.status(401).send('Unauthorized');
});

// مستخدم يرسل طلب إضافة
app.post('/request-channel', (req, res) => {
    const { name, link, desc } = req.body;
    pendingRequests.push({ id: Date.now(), name, link, desc });
    res.status(200).json({ message: 'Sent' });
});

// أدمن يضيف قناة مباشرة
app.post('/add-channel', (req, res) => {
    if (req.headers['x-admin-key'] === ADMIN_KEY) {
        const { name, link, desc } = req.body;
        channels.push({ id: Date.now(), name, link, desc });
        return res.status(200).json({ message: 'Added' });
    }
    res.status(401).send('Unauthorized');
});

// أدمن يوافق على طلب معلق
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

// أدمن يرفض طلب أو يحذف قناة
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
app.listen(PORT, () => console.log('TechHub Expert Server Running'));
