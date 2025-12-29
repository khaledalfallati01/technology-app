<script>
    const API = "https://technology-app.onrender.com";
    const KEY = "KA12345KA";
    let allCh = [];

    // --- ضع الدوال الجديدة هنا ---

    async function verifyAdmin() {
        const passInput = document.getElementById('admPass');
        
        if(passInput.value === KEY) {
            document.getElementById('authBox').style.display = 'none';
            document.getElementById('adminContent').style.display = 'block';
            await loadPending(); 
        } else {
            alert("❌ رمز الدخول غير صحيح");
        }
    }

    async function loadPending() {
        const list = document.getElementById('pendingList');
        list.innerHTML = `<div style="text-align:center; padding:10px;">⚡ جاري جلب الطلبات بسرعة...</div>`;
        
        try {
            const res = await fetch(`${API}/pending`, { 
                headers: {'x-admin-key': KEY} 
            });
            
            if (!res.ok) throw new Error();
            
            const data = await res.json();
            list.innerHTML = data.length ? "" : "<p style='text-align:center; color:#6b7280;'>لا توجد طلبات جديدة حالياً.</p>";
            
            data.forEach(p => {
                list.innerHTML += `
                    <div class="pending-card" id="req-${p.id}">
                        <strong>${p.name}</strong>
                        <p style="font-size:12px; margin:5px 0; color:#4b5563;">${p.desc}</p>
                        <div class="admin-actions">
                            <button class="approve" onclick="action('approve', ${p.id})">✅ قبول</button>
                            <button class="reject" onclick="action('reject', ${p.id})">❌ رفض</button>
                        </div>
                    </div>`;
            });
        } catch (e) {
            list.innerHTML = "<p style='color:red; text-align:center;'>📡 حدث خطأ أثناء الاتصال بالسيرفر</p>";
        }
    }

    // --- باقي الدوال مثل action و draw ... ---
</script>
