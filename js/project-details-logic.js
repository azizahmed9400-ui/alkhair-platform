/* js/project-details-logic.js - منطق عرض وتحديث بيانات تفاصيل المشروع */

document.addEventListener('DOMContentLoaded', () => {
    // 1. الحصول على ID المشروع من رابط الصفحة
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    // 2. التحقق من تحميل الدوال الأساسية والبيانات
    if (typeof window.getStoredData === 'undefined' || typeof projectsData === 'undefined' || typeof donorsData === 'undefined') {
         console.error('خطأ: لم يتم العثور على دوال LocalStorage أو ملف data.js. تأكد من ترتيب ملفات JS.');
         document.querySelector('main').innerHTML = '<h2 style="text-align:center; padding:50px;">حدث خطأ في تحميل البيانات الأساسية.</h2>';
         return;
    }
    
    // سحب جميع المشاريع والتبرعات من LocalStorage أو العودة للبيانات الافتراضية
    const allProjectsObject = window.getStoredData('projects', projectsData);
    const allDonorsArray = window.getStoredData('donors', donorsData);
    
    // البحث عن المشروع المطلوب
    const project = allProjectsObject[projectId];
    
    // -----------------------------------------------------------
    // دوال مساعدة لإعادة رسم أجزاء محددة بعد التبرع
    // -----------------------------------------------------------
    
    // دالة لرسم إحصائيات التمويل
    const renderProjectStats = (p) => {
        const goal = p.goal || 1;
        const paid = p.paid || 0;
        const remaining = Math.max(0, goal - paid);
        let progressPercent = Math.round((paid / goal) * 100);
        if (progressPercent > 100) progressPercent = 100;
        
        document.getElementById('project-total-cost').textContent = `${goal.toLocaleString()} ريال`;
        document.getElementById('project-paid').textContent = `${paid.toLocaleString()} ريال`;
        document.getElementById('project-remaining').textContent = `${remaining.toLocaleString()} ريال`;
        document.getElementById('project-donors-count').textContent = (p.donorsCount || 0).toLocaleString();
        
        const progressBar = document.getElementById('project-progress-bar');
        progressBar.style.width = `${progressPercent}%`;
        progressBar.textContent = `${progressPercent.toFixed(0)}%`;
        progressBar.setAttribute('aria-valuenow', progressPercent);
    };

    // دالة لرسم جدول المتبرعين الخاص بالمشروع
    const renderProjectDonors = (id, allDonors) => {
        const donorsTableBody = document.getElementById('project-donors-table');
        donorsTableBody.innerHTML = '';
        
        const projectDonors = allDonors.filter(donor => donor.projectId === id)
                                       .sort((a, b) => new Date(b.date) - new Date(a.date)) // الأحدث أولاً
                                       .slice(0, 5); // عرض آخر 5 فقط
        
        if (projectDonors.length === 0) {
            donorsTableBody.innerHTML = '<tr><td colspan="3" style="text-align:center;">كن أول متبرع لهذا المشروع!</td></tr>';
            return;
        }

        projectDonors.forEach(donor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${donor.isAnonymous ? 'متبرع كريم' : donor.name}</td>
                <td>${parseInt(donor.amount).toLocaleString()} ريال</td>
                <td>${donor.date}</td>
            `;
            donorsTableBody.appendChild(row);
        });
    };

    // ----------------------------------------------------------
    // المنطق الرئيسي: هل المشروع موجود؟
    // ----------------------------------------------------------
    if (project) {
        
        // أ. تحديث محتوى الـ Hero والـ Meta
        document.getElementById('project-title-hero').textContent = project.title || 'مشروع خيري';
        document.getElementById('project-tagline-hero').textContent = project.tagline || '';
        document.getElementById('project-main-image').src = project.imageUrl || 'https://placehold.co/800x450?text=No+Image';
        document.getElementById('project-description').textContent = project.description || 'لا يوجد وصف متاح.';
        document.getElementById('project-location').textContent = project.location || 'غير محدد';
        document.getElementById('project-duration').textContent = project.duration || 'غير محدد';
        
        // ب. عرض إحصائيات التمويل وجدول المتبرعين
        renderProjectStats(project);
        renderProjectDonors(projectId, allDonorsArray);

        // ج. التعامل مع نموذج التبرع (Donation Form)
        const donationForm = document.getElementById('donation-form');
        if (donationForm) {
            donationForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const amount = parseFloat(document.getElementById('donation-amount').value);
                const donorName = document.getElementById('donor-name').value.trim();
                const isAnonymous = document.getElementById('anonymous-check').checked;
                
                if (isNaN(amount) || amount <= 0) {
                    showMessageBox('يرجى إدخال مبلغ تبرع صحيح.', 'error');
                    return;
                }
                
                // 1. تحديث بيانات المشروع في LocalStorage
                const targetProject = allProjectsObject[projectId];
                targetProject.paid = (targetProject.paid || 0) + amount;
                targetProject.donorsCount = (targetProject.donorsCount || 0) + 1;
                
                window.saveData('projects', allProjectsObject);
                
                // 2. تحديث سجل المتبرعين في LocalStorage
                const updatedDonors = window.getStoredData('donors', donorsData);
                const newDonor = {
                    id: 'donor-' + Date.now(),
                    name: isAnonymous ? 'متبرع كريم' : donorName || 'متبرع باسم مجهول',
                    amount: amount,
                    projectId: projectId,
                    project: project.title, // حفظ اسم المشروع للتسهيل
                    isAnonymous: isAnonymous,
                    date: new Date().toISOString().slice(0, 10) // تاريخ اليوم (YYYY-MM-DD)
                };

                updatedDonors.push(newDonor);
                window.saveData('donors', updatedDonors);

                // 3. تحديث واجهة المستخدم (Re-render)
                if (targetProject) {
                   project.paid = targetProject.paid; // تحديث الكائن المحلي
                   project.donorsCount = targetProject.donorsCount;
                   renderProjectStats(project); // تحديث الإحصائيات
                   renderProjectDonors(projectId, updatedDonors); // تحديث جدول المتبرعين
                }

                // عرض رسالة النجاح ومسح النموذج
                if (typeof showMessageBox === 'function') {
                    showMessageBox(`✅ شكراً لك! تم استلام تبرعك بمبلغ ${amount.toLocaleString()} ريال بنجاح.`, 'success');
                } else {
                    alert('تم استلام تبرعك بنجاح!');
                }
                
                donationForm.reset(); 
            });
        }

    } else {
        // إذا كان رقم المشروع غير موجود أو خاطئ
        document.querySelector('main').innerHTML = `
            <section style="text-align: center; padding: 50px;">
                <h2>عذراً، المشروع غير موجود!</h2>
                <p>يرجى العودة إلى <a href="projects.html" class="button primary">صفحة المشاريع</a> لاختيار مشروع آخر.</p>
            </section>
        `;
    }
});