/* js/add-project-logic.js */

document.addEventListener('DOMContentLoaded', () => {
    
    // تعريف العناصر
    const form = document.getElementById('project-wizard-form');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const submitBtn = document.getElementById('submit-btn');
    const successMsg = document.getElementById('success-message');
    const wizardContainer = document.getElementById('wizard-container');

    let currentStep = 1;
    const totalSteps = 4;

    // إضافة صفوف أولية للميزانية والفريق عند التحميل
    if(typeof window.addBudgetRow === 'function') window.addBudgetRow();
    else addBudgetRowInternal(); // استخدام دالة داخلية إذا لم تكن موجودة

    if(typeof window.addTeamRow === 'function') window.addTeamRow();
    else addTeamRowInternal();

    // --- زر التالي ---
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault(); // منع أي سلوك افتراضي
            console.log("تم الضغط على التالي. الخطوة الحالية:", currentStep);

            if (validateStep(currentStep)) {
                changeStep(currentStep + 1);
            } else {
                alert('يرجى ملء جميع الحقول المطلوبة (المحاطة بالأحمر) قبل المتابعة.');
            }
        });
    }

    // --- زر السابق ---
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            changeStep(currentStep - 1);
        });
    }

    // --- دالة تغيير الخطوة ---
    function changeStep(newStep) {
        // إخفاء الخطوة القديمة
        const currentStepDiv = document.getElementById(`step-${currentStep}`);
        const currentIndicator = document.querySelector(`.step-indicator[data-step="${currentStep}"]`);
        
        if(currentStepDiv) currentStepDiv.classList.remove('active');
        if(currentIndicator) currentIndicator.classList.remove('active');

        // إذا تقدمنا للأمام، نضع علامة "مكتمل" على الخطوة السابقة
        if (newStep > currentStep && currentIndicator) {
            currentIndicator.classList.add('completed');
        }

        // إظهار الخطوة الجديدة
        currentStep = newStep;
        const newStepDiv = document.getElementById(`step-${currentStep}`);
        const newIndicator = document.querySelector(`.step-indicator[data-step="${currentStep}"]`);

        if(newStepDiv) newStepDiv.classList.add('active');
        if(newIndicator) newIndicator.classList.add('active');

        // التحكم بالأزرار
        if (prevBtn) prevBtn.style.visibility = (currentStep === 1) ? 'hidden' : 'visible';
        
        if (currentStep === totalSteps) {
            if(nextBtn) nextBtn.style.display = 'none';
            if(submitBtn) submitBtn.style.display = 'inline-block';
        } else {
            if(nextBtn) nextBtn.style.display = 'inline-block';
            if(submitBtn) submitBtn.style.display = 'none';
        }

        // التمرير للأعلى
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // --- دالة التحقق من الحقول ---
    function validateStep(step) {
        const stepDiv = document.getElementById(`step-${step}`);
        if (!stepDiv) return true;

        // البحث عن كل الحقول المطلوبة داخل الخطوة الحالية
        const inputs = stepDiv.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = 'red'; // تلوين الحقل بالأحمر
                input.style.backgroundColor = '#fff0f0'; // خلفية حمراء فاتحة
            } else {
                input.style.borderColor = '#e0e0e0';
                input.style.backgroundColor = '#ffffff';
            }
        });

        return isValid;
    }

    // --- دوال الصفوف الديناميكية (داخلية لضمان العمل) ---
    function addBudgetRowInternal() {
        const container = document.getElementById('budget-container');
        if(!container) return;
        const div = document.createElement('div');
        div.className = 'dynamic-row';
        div.innerHTML = `
            <input type="text" class="budget-name" placeholder="البند" required>
            <input type="number" class="budget-cost" placeholder="التكلفة" required>
            <button type="button" class="remove-row-btn" onclick="this.parentElement.remove()">x</button>
        `;
        container.appendChild(div);
    }

    function addTeamRowInternal() {
        const container = document.getElementById('team-container');
        if(!container) return;
        const div = document.createElement('div');
        div.className = 'dynamic-row';
        div.innerHTML = `
            <input type="text" class="team-name" placeholder="الاسم" required>
            <input type="text" class="team-role" placeholder="الدور" required>
            <button type="button" class="remove-row-btn" onclick="this.parentElement.remove()">x</button>
        `;
        container.appendChild(div);
    }
    
    // جعل الدوال متاحة للـ HTML (onclick)
    window.addBudgetRow = addBudgetRowInternal;
    window.addTeamRow = addTeamRowInternal;


    // --- إرسال النموذج (الحفظ) ---
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // تجميع البيانات وحفظها
            const newProject = {
                id: 'proj-' + Date.now(),
                title: document.getElementById('p-title').value,
                category: document.getElementById('p-category').value,
                goal: parseFloat(document.getElementById('p-goal').value),
                paid: 0,
                status: 'pending_approval', // حالة الانتظار
                imageUrl: document.getElementById('p-image').value,
                description: document.getElementById('p-description').value,
                startDate: new Date().toISOString().slice(0, 10),
                donorsCount: 0
            };

            // الحفظ في LocalStorage
            if (typeof window.getStoredData === 'function') {
                const allProjects = window.getStoredData('projects', {});
                allProjects[newProject.id] = newProject;
                window.saveData('projects', allProjects);
            }

            // إظهار رسالة النجاح
            form.style.display = 'none';
            document.querySelector('.wizard-progress').style.display = 'none';
            if(successMsg) successMsg.style.display = 'block';
            window.scrollTo(0,0);
        });
    }
});