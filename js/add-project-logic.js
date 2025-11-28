
        document.addEventListener('DOMContentLoaded', () => {
            
            /* --- التهيئة --- */
            let currentStep = 1;
            const totalSteps = 4;
            
            const form = document.getElementById('project-wizard-form');
            const nextBtn = document.getElementById('next-btn');
            const prevBtn = document.getElementById('prev-btn');
            const submitBtn = document.getElementById('submit-btn');
            const wizardContainer = document.getElementById('wizard-container');
            const successMsg = document.getElementById('success-message');

            // 1. إضافة صفوف أولية عند التحميل
            addBudgetRow();
            addTeamRow();

            /* --- التنقل بين الخطوات --- */
            nextBtn.addEventListener('click', () => {
                if(validateStep(currentStep)) {
                    changeStep(currentStep + 1);
                }
            });

            prevBtn.addEventListener('click', () => {
                changeStep(currentStep - 1);
            });

            function changeStep(step) {
                // إخفاء الخطوة الحالية
                document.getElementById(`step-${currentStep}`).classList.remove('active');
                document.querySelector(`.step-indicator[data-step="${currentStep}"]`).classList.remove('active');
                
                // تلوين الخطوة السابقة كـ "مكتملة"
                if(step > currentStep) {
                    document.querySelector(`.step-indicator[data-step="${currentStep}"]`).classList.add('completed');
                }

                // إظهار الخطوة الجديدة
                currentStep = step;
                document.getElementById(`step-${currentStep}`).classList.add('active');
                document.querySelector(`.step-indicator[data-step="${currentStep}"]`).classList.add('active');

                // تحديث الأزرار
                prevBtn.style.visibility = (currentStep === 1) ? 'hidden' : 'visible';
                
                if (currentStep === totalSteps) {
                    nextBtn.style.display = 'none';
                    submitBtn.style.display = 'inline-block';
                } else {
                    nextBtn.style.display = 'inline-block';
                    nextBtn.textContent = 'التالي';
                    submitBtn.style.display = 'none';
                }
                
                // التمرير لأعلى الصفحة
                window.scrollTo(0, 100);
            }

            /* --- التحقق من صحة البيانات --- */
            function validateStep(step) {
                const activeStepDiv = document.getElementById(`step-${step}`);
                const inputs = activeStepDiv.querySelectorAll('input[required], select[required], textarea[required]');
                let isValid = true;
                let firstInvalidInput = null;
                
                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        input.style.borderColor = 'red';
                        isValid = false;
                        if (!firstInvalidInput) firstInvalidInput = input;
                    } else {
                        input.style.borderColor = '#ddd';
                    }
                });

                if (!isValid) {
                    if(typeof showMessageBox === 'function') {
                        showMessageBox('يرجى تعبئة جميع الحقول المطلوبة للمتابعة.', 'error');
                    } else {
                        alert('يرجى تعبئة الحقول المطلوبة');
                    }
                    if(firstInvalidInput) firstInvalidInput.focus();
                }
                return isValid;
            }

       /* js/add-project-logic.js - الجزء الخاص بالحفظ */

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // التحقق من الخطوة الأخيرة
    if(!validateStep(totalSteps)) return;

    // جلب المستخدم الحالي لربط المشروع به
    const currentUser = window.getStoredData('currentUser', null);
    
    // تجميع البيانات
    const projectData = {
        id: 'proj-' + Date.now(),
        // ربط المشروع بصاحبه (إذا لم يكن مسجلاً، نضعه كـ anonymous مؤقتاً)
        ownerId: currentUser ? currentUser.id : 'anonymous', 
        
        // --- التغيير الجوهري هنا: الحالة الافتراضية ---
        status: 'pending_approval', // قيد المراجعة
        
        title: document.getElementById('p-title').value,
        tagline: document.getElementById('p-tagline').value,
        category: document.getElementById('p-category').value,
        goal: parseFloat(document.getElementById('p-goal').value),
        paid: 0,
        imageUrl: document.getElementById('p-image').value,
        description: document.getElementById('p-description').value,
        problem: document.getElementById('p-problem').value,
        location: document.getElementById('p-location').value,
        duration: document.getElementById('p-duration').value,
        mapEmbedUrl: document.getElementById('p-map').value,
        impacts: [{title: 'الأثر المجتمعي', description: document.getElementById('p-impact').value}],
        budgetBreakdown: getBudgetArray(),
        team: getTeamArray(),
        donorsCount: 0,
        progress: 0,
        startDate: new Date().toISOString().slice(0, 10),
        updates: [],
        expenditures: [],
        donors: []
    };

    if (typeof window.saveData !== 'undefined') {
        const allProjects = window.getStoredData('projects', projectsData || {});
        allProjects[projectData.id] = projectData;
        window.saveData('projects', allProjects);
        
        // إخفاء النموذج وعرض رسالة النجاح المعدلة
        form.style.display = 'none';
        document.querySelector('.wizard-progress').style.display = 'none';
        
        // تحديث رسالة النجاح لتوضح أن المشروع قيد المراجعة
        const successTitle = document.querySelector('#success-message h2');
        const successDesc = document.querySelector('#success-message p');
        
        if(successTitle) successTitle.textContent = "تم إرسال المشروع للمراجعة!";
        if(successDesc) successDesc.innerHTML = "شكراً لمبادرتك. مشروعك الآن <strong>قيد المراجعة</strong> من قبل إدارة المنصة.<br>سيصلك إشعار فور الموافقة عليه ونشره للجمهور.";
        
        // إخفاء أزرار الإدارة الفورية لأن المشروع لم يُعتمد بعد
        const manageBtn = document.getElementById('go-to-manage-btn');
        if(manageBtn) manageBtn.style.display = 'none';

        successMsg.style.display = 'block';
        window.scrollTo(0,0);
    }
});

        });

        /* ------------------------------------------------
           دوال مساعدة (خارج الـ Event Listener لتكون متاحة للـ onclick في HTML)
           ------------------------------------------------ */

        // 1. منطق الميزانية
        function addBudgetRow() {
            const container = document.getElementById('budget-container');
            const row = document.createElement('div');
            row.className = 'dynamic-row';
            row.innerHTML = `
                <input type="text" placeholder="اسم البند (مثلاً: حديد تسليح)" class="budget-name" style="flex:2" required>
                <input type="number" placeholder="التكلفة (ريال)" class="budget-cost" style="flex:1" oninput="calculateTotal()" required>
                <button type="button" class="remove-row-btn" onclick="removeRow(this); calculateTotal()" title="حذف">&times;</button>
            `;
            container.appendChild(row);
        }

        function calculateTotal() {
            const costs = document.querySelectorAll('.budget-cost');
            let total = 0;
            costs.forEach(input => {
                const val = parseFloat(input.value);
                if(!isNaN(val)) total += val;
            });
            document.getElementById('budget-total-calc').textContent = total.toLocaleString();
        }

        function getBudgetArray() {
            const rows = document.querySelectorAll('#budget-container .dynamic-row');
            return Array.from(rows).map(row => ({
                name: row.querySelector('.budget-name').value,
                cost: row.querySelector('.budget-cost').value // يمكن تحويلها لنسبة لاحقاً
            }));
        }

        // 2. منطق الفريق
        function addTeamRow() {
            const container = document.getElementById('team-container');
            const row = document.createElement('div');
            row.className = 'dynamic-row';
            row.innerHTML = `
                <input type="text" placeholder="الاسم الكامل" class="team-name" style="flex:2" required>
                <input type="text" placeholder="الدور (مثلاً: مشرف مالي)" class="team-role" style="flex:2" required>
                <button type="button" class="remove-row-btn" onclick="removeRow(this)" title="حذف">&times;</button>
            `;
            container.appendChild(row);
        }

        function getTeamArray() {
            const rows = document.querySelectorAll('#team-container .dynamic-row');
            return Array.from(rows).map(row => ({
                name: row.querySelector('.team-name').value,
                role: row.querySelector('.team-role').value,
                imageUrl: 'https://placehold.co/150x150/ccc/fff?text=User' // صورة افتراضية
            }));
        }

        // دالة عامة للحذف
        function removeRow(btn) {
            btn.parentElement.remove();
        }

