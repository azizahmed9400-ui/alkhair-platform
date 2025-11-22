document.addEventListener('DOMContentLoaded', function () {
    
    // 1. كود القائمة الجانبية (الهمبرغر)
    // ---------------------------------------------
    const menuToggle = document.getElementById('menu-toggle-btn');
    const navList = document.getElementById('main-menu-list');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function () {
            // التبديل بين إظهار وإخفاء القائمة
            navList.classList.toggle('active');
        });
    }

    // 2. كود نموذج الاتصال (Contact Form)
    // ---------------------------------------------
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // التأكد من وجود دالة showMessageBox (من ملف message-box.js)
            if (typeof showMessageBox === 'function') {
                showMessageBox('شكراً لك! لقد تم استلام رسالتك بنجاح. سنتواصل معك قريباً.', 'success');
            } else {
                alert('شكراً لك! تم استلام رسالتك.');
            }
            this.reset(); // مسح النموذج
        });
    }

});