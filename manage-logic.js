/* js/manage-logic.js - منطق لوحة تحكم مدير المشروع */

document.addEventListener('DOMContentLoaded', () => {
    // 1. الحصول على ID المشروع من الرابط
    // الرابط سيكون: manage-project.html?id=proj-123456
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    if (!projectId) {
        alert('خطأ: لم يتم تحديد المشروع المراد إدارته.');
        window.location.href = 'index.html';
        return;
    }

    // 2. تحميل البيانات
    const allProjects = window.getStoredData('projects', projectsData);
    const project = allProjects[projectId];

    if (!project) {
        alert('خطأ: المشروع غير موجود.');
        window.location.href = 'index.html';
        return;
    }

    // 3. عرض بيانات المشروع في اللوحة (نظرة عامة)
    document.getElementById('m-project-title').textContent = `إدارة: ${project.title}`;
    document.getElementById('m-collected').textContent = (project.paid || 0).toLocaleString() + ' ريال';
    document.getElementById('m-donors').textContent = project.donorsCount || 0;
    
    // حساب النسبة
    const goal = project.goal || 1;
    const paid = project.paid || 0;
    const percent = Math.min(100, Math.round((paid / goal) * 100));
    document.getElementById('m-progress').textContent = percent + '%';

    // رابط المعاينة
    document.getElementById('view-live-btn').href = `project-details.html?id=${projectId}`;

    // عرض المصروفات السابقة في الجدول المصغر
    renderExpensesPreview(project.expenditures || []);


    // ----------------------------------------------------
    // 4. منطق إضافة تحديث (Update)
    // ----------------------------------------------------
    const updateForm = document.getElementById('add-update-form');
    updateForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newUpdate = {
            id: Date.now(),
            title: document.getElementById('u-title').value,
            description: document.getElementById('u-desc').value,
            imageUrl: document.getElementById('u-image').value || '',
            date: new Date().toISOString().slice(0, 10) // تاريخ اليوم
        };

        // إضافة للتحديثات
        if (!project.updates) project.updates = [];
        project.updates.unshift(newUpdate); // إضافة في البداية

        saveAndRefresh('تم نشر التحديث بنجاح!', updateForm);
    });


    // ----------------------------------------------------
    // 5. منطق إضافة مصروف (Expense)
    // ----------------------------------------------------
  
  
  
 

     const expenseForm = document.getElementById('add-expense-form');
      if (expenseForm) {
      expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const expenseId = 'exp-' + Date.now();
        const newExpense = {
            id: expenseId,
            item: document.getElementById('e-item').value,
            amount: parseFloat(document.getElementById('e-amount').value),
            recipient: document.getElementById('e-recipient').value,
            invoiceUrl: document.getElementById('e-invoice').value || '',
            date: new Date().toISOString().slice(0, 10),
            
            // --- التغيير الجوهري: الحالة الافتراضية ---
            status: 'pending', // قيد الانتظار
            verifiedBy: null,
            verificationDate: null
        };

        // إضافة للمصروفات
        if (!project.expenditures) project.expenditures = [];
        project.expenditures.unshift(newExpense);

        // الحفظ
        allProjects[projectId] = project;
        window.saveData('projects', allProjects);

        showMessageBox('تم تسجيل المصروف! بانتظار تأكيد المستلم.', 'info');
        expenseForm.reset();
        
        // تحديث الجدول
        renderExpensesPreview(project.expenditures);
    });
}

// تعديل دالة عرض المصروفات لتظهر رابط التحقق
function renderExpensesPreview(expenses) {
    const tbody = document.getElementById('expenses-list-preview');
    tbody.innerHTML = '';
    
    expenses.slice(0, 10).forEach(exp => {
        const isVerified = exp.status === 'verified';
        const statusBadge = isVerified 
            ? '<span style="color:#2ecc71"><i class="fas fa-check-circle"></i> مؤكد</span>' 
            : '<span style="color:#f39c12"><i class="fas fa-clock"></i> انتظار</span>';
            
        // رابط التحقق (Simulated Link)
        // هذا الرابط سنقوم بإنشاء صفحته في الخطوة التالية
        const verifyLink = `verify-expense.html?pid=${projectId}&eid=${exp.id}`;
        
        const actionBtn = isVerified 
            ? '-' 
            : `<button onclick="copyLink('${verifyLink}')" class="button secondary small" style="padding:2px 5px; font-size:0.7em;">نسخ رابط التحقق</button>`;

        tbody.innerHTML += `
            <tr>
                <td>${exp.item}</td>
                <td>${exp.amount.toLocaleString()}</td>
                <td>${statusBadge}</td>
                <td>${actionBtn}</td>
            </tr>
        `;
    });
    
    if(expenses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">لا توجد مصروفات مسجلة.</td></tr>';
    }
}

// دالة مساعدة لنسخ الرابط (ضعها خارج الـ EventListeners لتكون Global)
window.copyLink = function(url) {
    // لأننا في بيئة محلية، سنقوم بفتح الرابط مباشرة للتسهيل عليك بدلاً من نسخه
    // في الواقع يتم نسخه وإرساله عبر الواتساب للتاجر
    if(confirm('في الواقع، يتم إرسال هذا الرابط للتاجر ليؤكد الاستلام.\n\nهل تريد فتح صفحة التحقق الآن (كمحاكاة)؟')) {
        window.open(url, '_blank');
    }
};
        const newExpense = {
            id: Date.now(),
            item: document.getElementById('e-item').value,
            amount: parseFloat(document.getElementById('e-amount').value),
            recipient: document.getElementById('e-recipient').value,
            invoiceUrl: document.getElementById('e-invoice').value || '',
            date: new Date().toISOString().slice(0, 10),
            status: 'confirmed' // نفترض أنها مؤكدة لأن المدير هو من أدخلها
        };

        // إضافة للمصروفات
        if (!project.expenditures) project.expenditures = [];
        project.expenditures.unshift(newExpense);

        saveAndRefresh('تم تسجيل المصروف بنجاح!', expenseForm);
        renderExpensesPreview(project.expenditures);
    });


    // ----------------------------------------------------
    // دوال مساعدة
    // ----------------------------------------------------
    
    function saveAndRefresh(message, formElement) {
        // تحديث الكائن الرئيسي في LocalStorage
        allProjects[projectId] = project;
        window.saveData('projects', allProjects);

        showMessageBox(message, 'success');
        formElement.reset();
    }

    function renderExpensesPreview(expenses) {
        const tbody = document.getElementById('expenses-list-preview');
        tbody.innerHTML = '';
        
        // عرض آخر 5 مصروفات فقط
        expenses.slice(0, 5).forEach(exp => {
            tbody.innerHTML += `
                <tr>
                    <td>${exp.item}</td>
                    <td>${exp.amount.toLocaleString()}</td>
                    <td>${exp.date}</td>
                </tr>
            `;
        });
        
        if(expenses.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align:center">لا توجد مصروفات مسجلة.</td></tr>';
        }
    }
           