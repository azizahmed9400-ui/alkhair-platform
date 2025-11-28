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
    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();

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
});