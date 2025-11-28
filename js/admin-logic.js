/* حماية الصفحة: تحقق من الصلاحيات قبل تحميل أي شيء */
(function checkAuth() {
    // محاولة جلب المستخدم، ولأننا خارج دالة الـ window.getStoredData أحياناً
    // نستخدم localStorage مباشرة للأمان الأولي
    const userJson = localStorage.getItem('currentUser');
    
    if (!userJson) {
        alert('عذراً، يجب عليك تسجيل الدخول أولاً.');
        window.location.href = 'login.html';
        return;
    }

    const user = JSON.parse(userJson);
    
    // التحقق من الصلاحية (مثلاً للمدير فقط)
    // يمكنك تغيير الشرط حسب الصفحة
    if (user.role !== 'admin') {
        alert('عذراً، ليس لديك صلاحية لدخول هذه الصفحة.');
        window.location.href = 'index.html';
    }
})();
/* js/admin-logic.js */

document.addEventListener('DOMContentLoaded', () => {
    const addProjectForm = document.getElementById('add-project-form');

    if (addProjectForm) {
       /* js/admin-logic.js - منطق الموافقة والرفض */

// ... (تأكد أن كود checkAuth موجود في الأعلى كما هو) ...

document.addEventListener('DOMContentLoaded', () => {
    // ... (كود التحقق من البيانات الموجود سابقاً) ...

    const projectsTableBody = document.getElementById('projects-admin-table-body');

    // دالة لعرض المشاريع مع أزرار التحكم الجديدة
    window.renderProjectsTable = function() {
        // إعادة سحب البيانات لضمان التحديث
        const allProjectsObject = window.getStoredData('projects', projectsData);
        const allProjects = Object.values(allProjectsObject);
        
        projectsTableBody.innerHTML = ''; 

        // فرز المشاريع: "قيد المراجعة" يظهر أولاً
        allProjects.sort((a, b) => {
            if (a.status === 'pending_approval' && b.status !== 'pending_approval') return -1;
            if (a.status !== 'pending_approval' && b.status === 'pending_approval') return 1;
            return 0;
        });

        if (allProjects.length === 0) {
            projectsTableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;">لا توجد مشاريع.</td></tr>';
            return;
        }

        allProjects.forEach((project, index) => {
            const goal = project.goal || 1;
            const paid = project.paid || 0;
            const progressPercent = Math.min(100, Math.round((paid / goal) * 100));
            
            // تحديد حالة العرض
            let statusBadge = '';
            let actionButtons = '';

            if (project.status === 'pending_approval') {
                statusBadge = '<span style="background:#ff9800; color:white; padding:2px 6px; border-radius:4px; font-size:0.8em;">بانتظار الموافقة ⏳</span>';
                // أزرار الموافقة والرفض
                actionButtons = `
                    <button class="button primary small" onclick="approveProject('${project.id}')" style="background:#4CAF50; border-color:#4CAF50;">قبول</button>
                    <button class="button secondary small" onclick="rejectProject('${project.id}')" style="color:#f44336; border-color:#f44336;">رفض</button>
                `;
            } else if (project.status === 'active') {
                statusBadge = '<span style="color:#4CAF50; font-weight:bold;">نشط ✅</span>';
                actionButtons = `<a href="manage-project.html?id=${project.id}" class="button secondary small">إدارة</a>`;
            } else {
                statusBadge = `<span style="color:#777;">${project.status}</span>`;
            }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><strong>${project.title}</strong></td>
                <td>${project.category}</td>
                <td>${goal.toLocaleString()}</td>
                <td>${paid.toLocaleString()}</td>
                <td>${progressPercent}%</td>
                <td>${statusBadge}</td>
                <td style="display:flex; gap:5px; justify-content:center;">
                    ${actionButtons}
                    <a href="project-details.html?id=${project.id}" target="_blank" class="button secondary small" style="border:none;"><i class="fas fa-eye"></i></a>
                </td>
            `;
            projectsTableBody.appendChild(row);
        });
    };

    // دوال الموافقة والرفض (يجب أن تكون Global لتعمل مع onclick في HTML)
    window.approveProject = function(projectId) {
        if(!confirm('هل أنت متأكد من الموافقة على نشر هذا المشروع؟')) return;
        
        const allProjects = window.getStoredData('projects', projectsData);
        if(allProjects[projectId]) {
            allProjects[projectId].status = 'active'; // تفعيل المشروع
            allProjects[projectId].startDate = new Date().toISOString().slice(0, 10); // تحديث تاريخ البدء
            
            window.saveData('projects', allProjects);
            showMessageBox('تم اعتماد المشروع ونشره بنجاح! ✅', 'success');
            renderProjectsTable(); // تحديث الجدول
        }
    };

    window.rejectProject = function(projectId) {
        if(!confirm('هل أنت متأكد من رفض هذا المشروع وحذفه؟')) return;
        
        const allProjects = window.getStoredData('projects', projectsData);
        if(allProjects[projectId]) {
            delete allProjects[projectId]; // حذف المشروع (أو يمكن تغيير حالته لـ rejected)
            
            window.saveData('projects', allProjects);
            showMessageBox('تم رفض المشروع وحذفه.', 'info');
            renderProjectsTable();
        }
    };

    // تشغيل العرض الأولي
    renderProjectsTable();
    // ... (باقي كود الإحصائيات والمتبرعين يبقى كما هو) ...
});
            e.preventDefault();

            // 1. جمع البيانات من النموذج
            const formData = new FormData(addProjectForm);
            const projectData = {};

            // حلقة تكرار لجمع جميع المدخلات
            formData.forEach((value, key) => {
                // التعامل مع أنواع البيانات حسب الحاجة
                if (key === 'goal' || key === 'paid') {
                    projectData[key] = parseFloat(value) || 0;
                } else if (key === 'objectives' || key === 'budgetBreakdown') {
                    // نفترض أن هذه الحقول ستتم إدارتها بطريقة أكثر تعقيداً لاحقاً، حالياً نكتفي بنص
                    projectData[key] = value.split('\n').filter(l => l.trim() !== '');
                } else {
                    projectData[key] = value.trim();
                }
            });

            // 2. إنشاء بيانات المشروع الأساسية
            
            // إنشاء ID فريد (باستخدام التاريخ الحالي لضمان التفرد في هذه المرحلة)
            const newProjectId = 'proj-' + Date.now();
            
            // تهيئة بيانات المشروع لتكون مطابقة لهيكلية data.js
            const newProject = {
                id: newProjectId,
                title: projectData.title,
                category: projectData.category || 'غير مصنف',
                tagline: projectData.tagline,
                imageUrl: projectData.imageUrl || 'https://placehold.co/800x450/3498db/FFFFFF?text=New+Project',
                description: projectData.description,
                location: projectData.location,
                goal: projectData.goal,
                paid: projectData.paid,
                donorsCount: 0, // يبدأ بصفر
                startDate: projectData.startDate || new Date().toISOString().split('T')[0],
                duration: projectData.duration,
                
                // حساب التقدم المبدئي
                progress: Math.min(100, Math.round((projectData.paid / projectData.goal) * 100)) || 0,
                
                // حقول فارغة للتعبئة لاحقاً
                mapEmbedUrl: '',
                problem: '',
                objectives: projectData.objectives, 
                needsBudget: '',
                budgetBreakdown: projectData.budgetBreakdown,
                timeline: projectData.timeline,
                impacts: [],
                team: [],
                updates: [],
                expenditures: [],
                donors: [] // قائمة متبرعي المشروع الخاصة
            };

            // 3. حفظ المشروع في LocalStorage
            
            // الحصول على جميع المشاريع المحفوظة حالياً
            // هنا نستخدم دالة getStoredData التي قمنا بتصديرها في script.js
            const allProjects = window.getStoredData('projects', projectsData);
            
            // إضافة المشروع الجديد
            allProjects[newProjectId] = newProject;

            // حفظ البيانات مرة أخرى في LocalStorage
            window.saveData('projects', allProjects);


            // 4. رسالة النجاح وإعادة التوجيه (اختياري)
            
            showMessageBox('تم إضافة المشروع بنجاح! سيتم إعادة توجيهك إلى صفحة المشاريع.', 'success');
            
            // الانتظار قليلاً قبل إعادة التوجيه لرؤية الرسالة
            setTimeout(() => {
                window.location.href = `projects.html`; 
            }, 2000); 

            addProjectForm.reset(); 
       /* js/admin-logic.js - منطق الموافقة والرفض */

// ... (تأكد أن كود checkAuth موجود في الأعلى كما هو) ...

document.addEventListener('DOMContentLoaded', () => {
    // ... (كود التحقق من البيانات الموجود سابقاً) ...

    const projectsTableBody = document.getElementById('projects-admin-table-body');

    // دالة لعرض المشاريع مع أزرار التحكم الجديدة
    window.renderProjectsTable = function() {
        // إعادة سحب البيانات لضمان التحديث
        const allProjectsObject = window.getStoredData('projects', projectsData);
        const allProjects = Object.values(allProjectsObject);
        
        projectsTableBody.innerHTML = ''; 

        // فرز المشاريع: "قيد المراجعة" يظهر أولاً
        allProjects.sort((a, b) => {
            if (a.status === 'pending_approval' && b.status !== 'pending_approval') return -1;
            if (a.status !== 'pending_approval' && b.status === 'pending_approval') return 1;
            return 0;
        });

        if (allProjects.length === 0) {
            projectsTableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;">لا توجد مشاريع.</td></tr>';
            return;
        }

        allProjects.forEach((project, index) => {
            const goal = project.goal || 1;
            const paid = project.paid || 0;
            const progressPercent = Math.min(100, Math.round((paid / goal) * 100));
            
            // تحديد حالة العرض
            let statusBadge = '';
            let actionButtons = '';

            if (project.status === 'pending_approval') {
                statusBadge = '<span style="background:#ff9800; color:white; padding:2px 6px; border-radius:4px; font-size:0.8em;">بانتظار الموافقة ⏳</span>';
                // أزرار الموافقة والرفض
                actionButtons = `
                    <button class="button primary small" onclick="approveProject('${project.id}')" style="background:#4CAF50; border-color:#4CAF50;">قبول</button>
                    <button class="button secondary small" onclick="rejectProject('${project.id}')" style="color:#f44336; border-color:#f44336;">رفض</button>
                `;
            } else if (project.status === 'active') {
                statusBadge = '<span style="color:#4CAF50; font-weight:bold;">نشط ✅</span>';
                actionButtons = `<a href="manage-project.html?id=${project.id}" class="button secondary small">إدارة</a>`;
            } else {
                statusBadge = `<span style="color:#777;">${project.status}</span>`;
            }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><strong>${project.title}</strong></td>
                <td>${project.category}</td>
                <td>${goal.toLocaleString()}</td>
                <td>${paid.toLocaleString()}</td>
                <td>${progressPercent}%</td>
                <td>${statusBadge}</td>
                <td style="display:flex; gap:5px; justify-content:center;">
                    ${actionButtons}
                    <a href="project-details.html?id=${project.id}" target="_blank" class="button secondary small" style="border:none;"><i class="fas fa-eye"></i></a>
                </td>
            `;
            projectsTableBody.appendChild(row);
        });
    };

    // دوال الموافقة والرفض (يجب أن تكون Global لتعمل مع onclick في HTML)
    window.approveProject = function(projectId) {
        if(!confirm('هل أنت متأكد من الموافقة على نشر هذا المشروع؟')) return;
        
        const allProjects = window.getStoredData('projects', projectsData);
        if(allProjects[projectId]) {
            allProjects[projectId].status = 'active'; // تفعيل المشروع
            allProjects[projectId].startDate = new Date().toISOString().slice(0, 10); // تحديث تاريخ البدء
            
            window.saveData('projects', allProjects);
            showMessageBox('تم اعتماد المشروع ونشره بنجاح! ✅', 'success');
            renderProjectsTable(); // تحديث الجدول
        }
    };

    window.rejectProject = function(projectId) {
        if(!confirm('هل أنت متأكد من رفض هذا المشروع وحذفه؟')) return;
        
        const allProjects = window.getStoredData('projects', projectsData);
        if(allProjects[projectId]) {
            delete allProjects[projectId]; // حذف المشروع (أو يمكن تغيير حالته لـ rejected)
            
            window.saveData('projects', allProjects);
            showMessageBox('تم رفض المشروع وحذفه.', 'info');
            renderProjectsTable();
        }
    };

    // تشغيل العرض الأولي
    renderProjectsTable();
    // ... (باقي كود الإحصائيات والمتبرعين يبقى كما هو) ...
});
    }
});
/* js/admin-logic.js - منطق لوحة التحكم الديناميكي */

document.addEventListener('DOMContentLoaded', () => {
    // التحقق من الدوال الأساسية والبيانات
    if (typeof window.getStoredData === 'undefined' || typeof projectsData === 'undefined' || typeof donorsData === 'undefined') {
        console.error('خطأ: لم يتم العثور على دوال LocalStorage أو ملف data.js. تأكد من ترتيب ملفات JS.');
        return;
    }

    // 1. سحب البيانات من LocalStorage
    // المشاريع محفوطة ككائن (Object) لذا نحولها لمصفوفة (Array) للعرض
    const allProjectsObject = window.getStoredData('projects', projectsData);
    const allProjects = Object.values(allProjectsObject);
    const allDonors = window.getStoredData('donors', donorsData);

    // عناصر الجدول
    const projectsTableBody = document.getElementById('projects-admin-table-body');
    const donorsTableBody = document.getElementById('donors-admin-table-body');


    /* =========================================
       2. دالة عرض المشاريع
       ========================================= */
    function renderProjectsTable() {
        projectsTableBody.innerHTML = ''; // تنظيف الجدول

        if (allProjects.length === 0) {
            projectsTableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;">لا توجد مشاريع مسجلة بعد.</td></tr>';
            return;
        }

        allProjects.forEach((project, index) => {
            const goal = project.goal || 1;
            const paid = project.paid || 0;
            const progressPercent = Math.min(100, Math.round((paid / goal) * 100));
            
            // تحديد حالة المشروع
            let statusText = 'قيد التنفيذ';
            let statusClass = '';
            if (progressPercent >= 100) {
                statusText = 'مُنجز ✅';
                statusClass = 'status-confirmed';
            } else if (progressPercent < 100 && paid > 0) {
                statusText = 'قيد التمويل';
                statusClass = 'status-pending';
            } else if (progressPercent === 0) {
                 statusText = 'جديد';
                 statusClass = 'status-pending';
            }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-label="#">${index + 1}</td>
                <td data-label="المشروع"><a href="project-details.html?id=${project.id}" target="_blank">${project.title}</a></td>
                <td data-label="الفئة">${project.category || 'غير محدد'}</td>
                <td data-label="الهدف">${goal.toLocaleString()}</td>
                <td data-label="المحصل">${paid.toLocaleString()}</td>
                <td data-label="التقدم">${progressPercent}%</td>
                <td data-label="الحالة" class="${statusClass}">${statusText}</td>
                <td data-label="إجراء">
                    <button class="button secondary action-btn view-btn" data-id="${project.id}">عرض</button>
                    </td>
            `;
            projectsTableBody.appendChild(row);
        });
    }

    /* =========================================
       3. دالة عرض المتبرعين
       ========================================= */
    function renderDonorsTable() {
        donorsTableBody.innerHTML = ''; // تنظيف الجدول

        if (allDonors.length === 0) {
            donorsTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">لا توجد تبرعات مسجلة بعد.</td></tr>';
            return;
        }
        
        // عرض المتبرعين الأحدث أولاً
        const recentDonors = allDonors.slice().reverse();

        recentDonors.forEach(donor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-label="التاريخ">${donor.date}</td>
                <td data-label="الاسم">${donor.name}</td>
                <td data-label="المبلغ">${donor.amount.toLocaleString()}</td>
                <td data-label="المشروع"><a href="project-details.html?id=${donor.projectId}" target="_blank">${donor.project}</a></td>
                <td data-label="#ID">${donor.id}</td>
            `;
            donorsTableBody.appendChild(row);
        });
    }

    /* =========================================
       4. دالة عرض الإحصائيات
       ========================================= */
    function renderStats() {
        const totalProjectsCount = allProjects.length;
        
        // حساب المشاريع المنجزة (100% تقدم)
        const completedProjectsCount = allProjects.filter(p => {
            const paid = p.paid || 0;
            const goal = p.goal || 1;
            return Math.round((paid / goal) * 100) >= 100;
        }).length;
        
        // حساب إجمالي التبرعات
        const totalDonationsAmount = allDonors.reduce((sum, donor) => sum + (donor.amount || 0), 0);
        
        // عدد المتبرعين
        const totalDonorsCount = allDonors.length; 

        document.getElementById('total-projects-count').textContent = totalProjectsCount.toLocaleString();
        document.getElementById('completed-projects-count').textContent = completedProjectsCount.toLocaleString();
        document.getElementById('total-donations-amount').textContent = `${totalDonationsAmount.toLocaleString()} ريال`;
        document.getElementById('total-donors-count').textContent = totalDonorsCount.toLocaleString();
    }


    /* =========================================
       5. التشغيل
       ========================================= */
    renderStats();
    renderProjectsTable();
    renderDonorsTable();

    // إضافة مستمعي الأحداث لأزرار "عرض" في جدول المشاريع لفتح صفحة التفاصيل
    projectsTableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('view-btn')) {
            const projectId = e.target.getAttribute('data-id');
            window.open(`project-details.html?id=${projectId}`, '_blank');
        }
    });
});