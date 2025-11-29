/* js/admin-logic.js - منطق لوحة التحكم المتطور */

// حماية الصفحة: تحقق بسيط من الجلسة
(function checkAuth() {
    const userJson = localStorage.getItem('currentUser');
    if (!userJson) {
        // في التطبيق الحقيقي نوجه لصفحة الدخول
        // window.location.href = 'login.html';
        console.warn('دخول كزائر (لأغراض العرض فقط)');
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // 1. تحميل البيانات
    const allProjectsObject = window.getStoredData('projects', projectsData);
    const allProjects = Object.values(allProjectsObject);
    const allDonors = window.getStoredData('donors', donorsData);
    
    // محاكاة بيانات الرسائل (لأننا لم ننشئ تخزيناً حقيقياً لها بعد)
    const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');

    // 2. تحديث الإحصائيات (Overview)
    function updateDashboardStats() {
        // المال
        const totalMoney = allDonors.reduce((sum, d) => sum + (d.amount || 0), 0);
        document.getElementById('total-money').textContent = totalMoney.toLocaleString() + ' ريال';
        
        // المشاريع المكتملة
        const completed = allProjects.filter(p => p.paid >= p.goal).length;
        document.getElementById('completed-count').textContent = completed;
        
        // المتبرعين
        document.getElementById('donors-count-card').textContent = allDonors.length;
        
        // الرسائل
        document.getElementById('messages-count').textContent = messages.length;
        document.getElementById('last-update-time').textContent = new Date().toLocaleTimeString('ar-YE');

        // رسم بياني بسيط (أفضل 3 مشاريع)
        const topProjects = [...allProjects].sort((a,b) => (b.paid || 0) - (a.paid || 0)).slice(0, 3);
        const chartContainer = document.getElementById('top-projects-chart');
        chartContainer.innerHTML = '';
        
        topProjects.forEach(p => {
            const percent = Math.min(100, Math.round((p.paid / p.goal) * 100));
            chartContainer.innerHTML += `
                <div style="margin-bottom: 15px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                        <span style="font-weight:bold;">${p.title}</span>
                        <span>${percent}%</span>
                    </div>
                    <div style="background:#eee; height:10px; border-radius:5px; overflow:hidden;">
                        <div style="background:var(--primary-color); width:${percent}%; height:100%;"></div>
                    </div>
                </div>
            `;
        });
    }

    // 3. جدول المشاريع
    function renderProjectsTable() {
        const tbody = document.getElementById('admin-projects-table');
        tbody.innerHTML = '';
        
        allProjects.forEach(p => {
            const status = (p.paid >= p.goal) ? 'مكتمل' : 'نشط';
            const statusColor = (p.paid >= p.goal) ? '#2ecc71' : '#3498db';
            
            tbody.innerHTML += `
                <tr>
                    <td>${p.title}</td>
                    <td>${Number(p.goal).toLocaleString()}</td>
                    <td>${Number(p.paid).toLocaleString()}</td>
                    <td><span style="color:white; background:${statusColor}; padding:2px 8px; border-radius:10px; font-size:0.8em;">${status}</span></td>
                    <td>
                        <button class="action-btn btn-view" onclick="window.location.href='project-details.html?id=${p.id}'" title="عرض"><i class="fas fa-eye"></i></button>
                        <button class="action-btn btn-reject" onclick="deleteProject('${p.id}')" title="حذف"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
    }

    // 4. جدول المتبرعين
    function renderDonorsTable() {
        const tbody = document.getElementById('admin-donors-table');
        tbody.innerHTML = '';
        // عرض آخر 15 تبرع فقط
        const recentDonors = [...allDonors].reverse().slice(0, 15);
        
        recentDonors.forEach(d => {
            tbody.innerHTML += `
                <tr>
                    <td>${d.date}</td>
                    <td>${d.name}</td>
                    <td style="color:var(--success-color); font-weight:bold;">${d.amount.toLocaleString()}</td>
                    <td>${d.project || '-'}</td>
                </tr>
            `;
        });
    }

    // 5. جدول الرسائل
    function renderMessagesTable() {
        const tbody = document.getElementById('admin-messages-table');
        if (messages.length === 0) return;
        
        tbody.innerHTML = '';
        messages.reverse().forEach(msg => {
            tbody.innerHTML += `
                <tr>
                    <td>${msg.date}</td>
                    <td>${msg.name}</td>
                    <td>${msg.email}</td>
                    <td>${msg.message}</td>
                </tr>
            `;
        });
    }

    // --- الوظائف العامة ---
    
    // دالة التبديل بين التبويبات
    window.showTab = function(tabName) {
        // إخفاء كل المحتويات
        document.querySelectorAll('.admin-tab-content').forEach(el => el.style.display = 'none');
        // إلغاء تنشيط كل الروابط
        document.querySelectorAll('.admin-sidebar a').forEach(el => el.classList.remove('active'));
        
        // إظهار المطلوب
        document.getElementById(`tab-${tabName}`).style.display = 'block';
        // تنشيط الرابط (تقريبي)
        event.target.closest('a').classList.add('active');
    };

    // دالة حذف مشروع (محاكاة)
    window.deleteProject = function(pid) {
        if(confirm('هل أنت متأكد من حذف هذا المشروع؟ لا يمكن التراجع.')) {
            delete allProjectsObject[pid];
            window.saveData('projects', allProjectsObject);
            location.reload(); // إعادة تحميل الصفحة لتحديث الجدول
        }
    };
    
    // دالة تصدير البيانات (محاكاة)
    window.exportDonorsData = function() {
        alert('سيتم تنزيل ملف donors_data.csv الآن...');
        // في الواقع نحتاج كود لتحويل JSON إلى CSV وتنزيله
    };

    // زر الخروج
    document.getElementById('admin-logout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });

    // التشغيل الأولي
    updateDashboardStats();
    renderProjectsTable();
    renderDonorsTable();
    renderMessagesTable();
});