/* js/project-details-logic.js - منطق عرض وتحديث تفاصيل المشروع والتبرع */

document.addEventListener('DOMContentLoaded', () => {
    // 1. الأساسيات والتحقق
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    if (typeof window.getStoredData === 'undefined' || typeof projectsData === 'undefined') {
         console.error('خطأ: البيانات غير موجودة.');
         return;
    }

    const allProjectsObject = window.getStoredData('projects', projectsData);
    const allDonorsArray = window.getStoredData('donors', donorsData);
    const project = allProjectsObject[projectId];

    // 2. التحقق من وجود المشروع وعرض البيانات
    if (project) {
        // تعبئة البيانات النصية
        document.getElementById('project-title-hero').textContent = project.title;
        document.getElementById('project-tagline-hero').textContent = project.tagline;
        document.getElementById('project-main-image').src = project.imageUrl;
        document.getElementById('project-description').textContent = project.description;
        document.getElementById('project-location').textContent = project.location || 'اليمن';
        document.getElementById('project-duration').textContent = project.duration || 'غير محدد';
        
        // رسم الإحصائيات
        renderStats(project);
        
        // رسم الجداول
        renderDonors(projectId, allDonorsArray);
        renderExpenses(project.expenditures);

    } else {
        document.querySelector('main').innerHTML = '<h2 style="text-align:center; padding:50px;">المشروع غير موجود!</h2>';
    }

    /* ----------------------------------------------------
       دوال المساعدة في العرض (Rendering Helpers)
    ---------------------------------------------------- */
    function renderStats(p) {
        const goal = p.goal || 1;
        const paid = p.paid || 0;
        const percentage = Math.min(100, Math.round((paid / goal) * 100));
        
        document.getElementById('project-total-cost').textContent = goal.toLocaleString();
        document.getElementById('project-paid').textContent = paid.toLocaleString();
        document.getElementById('project-donors-count').textContent = (p.donorsCount || 0).toLocaleString();
        
        const bar = document.getElementById('project-progress-bar');
        bar.style.width = `${percentage}%`;
        document.getElementById('project-percentage').textContent = `${percentage}%`;
    }

    function renderDonors(pid, allDonors) {
        const tbody = document.getElementById('project-donors-table');
        tbody.innerHTML = '';
        const relevantDonors = allDonors.filter(d => d.projectId === pid).sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
        
        if(relevantDonors.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:#777;">كن أول المبادرين بالخير!</td></tr>';
            return;
        }

        relevantDonors.forEach(d => {
            tbody.innerHTML += `
                <tr>
                    <td><i class="fas fa-user-circle" style="color:#ccc;"></i> ${d.name}</td>
                    <td style="color:var(--success-color); font-weight:bold;">${d.amount.toLocaleString()}</td>
                    <td style="font-size:0.8em; color:#777;">${d.date}</td>
                </tr>
            `;
        });
    }

    function renderExpenses(expenses) {
        const tbody = document.getElementById('expenditure-table-body');
        if(!tbody) return;
        tbody.innerHTML = '';
        
        if(!expenses || expenses.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">لا توجد مصروفات مسجلة بعد.</td></tr>';
            return;
        }

        expenses.forEach(exp => {
            const isVerified = exp.status === 'verified';
            const statusBadge = isVerified 
                ? '<span style="color:var(--success-color);"><i class="fas fa-check"></i> مؤكد</span>' 
                : '<span style="color:var(--secondary-color);">قيد المراجعة</span>';
                
            tbody.innerHTML += `
                <tr>
                    <td>${exp.date}</td>
                    <td>${exp.item}</td>
                    <td>${exp.amount.toLocaleString()}</td>
                    <td>${statusBadge}</td>
                    <td>${exp.invoiceUrl ? '<a href="#">عرض</a>' : '-'}</td>
                </tr>
            `;
        });
    }

    /* ----------------------------------------------------
       منطق النافذة المنبثقة والتبرع (Modal & Donation Logic)
    ---------------------------------------------------- */
    let selectedAmount = 5000; // القيمة الافتراضية

    // جعل الدوال متاحة عالمياً (Global) لاستخدامها في HTML onclick
    window.openDonationModal = function() {
        document.getElementById('donation-modal').style.display = 'flex';
    };

    window.closeDonationModal = function() {
        document.getElementById('donation-modal').style.display = 'none';
        // إعادة تعيين الشاشات
        document.getElementById('donation-step-1').style.display = 'block';
        document.getElementById('donation-processing').style.display = 'none';
        document.getElementById('donation-success').style.display = 'none';
    };

    window.selectAmount = function(amount) {
        selectedAmount = amount;
        document.getElementById('custom-amount').value = ''; // تصفير الحقل المخصص
        
        // تحديث الأزرار
        document.querySelectorAll('.amount-btn').forEach(btn => {
            btn.classList.remove('selected');
            if(btn.textContent.includes(amount.toLocaleString())) btn.classList.add('selected');
        });
    };

    window.selectMethod = function(card, type) {
        document.querySelectorAll('.payment-method-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
    };

    // الاستماع لإدخال مبلغ مخصص
    const customInput = document.getElementById('custom-amount');
    if(customInput) {
        customInput.addEventListener('input', (e) => {
            if(e.target.value) {
                selectedAmount = parseFloat(e.target.value);
                document.querySelectorAll('.amount-btn').forEach(btn => btn.classList.remove('selected'));
            }
        });
    }

    // التنفيذ الفعلي للتبرع (المحاكاة)
    window.processDonation = function() {
        if (!selectedAmount || selectedAmount <= 0) {
            alert('يرجى تحديد مبلغ صحيح للتبرع.');
            return;
        }

        // 1. إخفاء النموذج وإظهار التحميل
        document.getElementById('donation-step-1').style.display = 'none';
        document.getElementById('donation-processing').style.display = 'block';

        // 2. محاكاة انتظار (2 ثانية)
        setTimeout(() => {
            // حفظ البيانات فعلياً
            const nameInput = document.getElementById('donor-name-modal').value;
            const isAnon = document.getElementById('anonymous-check-modal').checked;
            const finalName = isAnon ? 'فاعل خير' : (nameInput.trim() || 'فاعل خير');

            // تحديث المشروع
            project.paid = (project.paid || 0) + selectedAmount;
            project.donorsCount = (project.donorsCount || 0) + 1;
            allProjectsObject[projectId] = project;
            window.saveData('projects', allProjectsObject);

            // إضافة سجل المتبرع
            const newDonor = {
                id: Date.now(),
                name: finalName,
                amount: selectedAmount,
                projectId: projectId,
                project: project.title,
                date: new Date().toISOString().slice(0, 10)
            };
            allDonorsArray.push(newDonor);
            window.saveData('donors', allDonorsArray);

            // 3. إظهار رسالة النجاح وتحديث الصفحة في الخلفية
            document.getElementById('donation-processing').style.display = 'none';
            document.getElementById('donation-success').style.display = 'block';
            
            // تحديث الواجهة الخلفية فوراً
            renderStats(project);
            renderDonors(projectId, allDonorsArray);

        }, 2000); // تأخير 2000 ميلي ثانية
    };
});