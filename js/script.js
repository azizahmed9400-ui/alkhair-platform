/* js/script.js - العقل المدبر والخدمات المشتركة */

/* =========================================
   1. إعدادات النظام والمتغيرات العامة
   ========================================= */
const APP_CONFIG = {
    currency: 'ريال',
    defaultImage: 'https://placehold.co/600x400?text=No+Image'
};

/* =========================================
   2. دوال التعامل مع LocalStorage (Core)
   ========================================= */

// جلب البيانات
window.getStoredData = function(key, fallbackData) {
    const stored = localStorage.getItem(key);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error(`خطأ في قراءة البيانات (${key}):`, e);
            return fallbackData;
        }
    }
    if (fallbackData) {
        window.saveData(key, fallbackData);
        return fallbackData;
    }
    return null;
};

// حفظ البيانات
window.saveData = function(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        window.dispatchEvent(new Event('dataUpdated'));
    } catch (e) {
        console.error(`خطأ في حفظ البيانات (${key}):`, e);
        if (typeof showMessageBox === 'function') {
            showMessageBox('عذراً، الذاكرة ممتلئة أو حدث خطأ في الحفظ.', 'error');
        }
    }
};

// تنسيق العملة
window.formatCurrency = function(amount) {
    return Number(amount).toLocaleString() + ' ' + APP_CONFIG.currency;
};

/* =========================================
   3. عند تحميل الصفحة (تنفيذ الواجهات)
   ========================================= */
document.addEventListener('DOMContentLoaded', function () {
    
    // --- أ. إعدادات الوضع الليلي/النهاري ---
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle-btn';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.title = "تبديل الوضع";
    
    const navContainer = document.querySelector('.main-nav');
    if (navContainer) {
        navContainer.insertBefore(themeToggle, document.getElementById('menu-toggle-btn'));
    }

    // تطبيق الوضع المحفوظ
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    });

    // --- ب. القائمة الجانبية (Mobile Menu) ---
    const menuToggle = document.getElementById('menu-toggle-btn');
    const navList = document.getElementById('main-menu-list');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            navList.classList.toggle('active');
            
            const icon = menuToggle.querySelector('i');
            if (navList.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        document.addEventListener('click', function(e) {
            if (!navList.contains(e.target) && !menuToggle.contains(e.target) && navList.classList.contains('active')) {
                navList.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // --- ج. تحديث القائمة العلوية بناءً على المستخدم ---
    function updateNavigationMenu() {
        const currentUser = window.getStoredData('currentUser', null);
        const navList = document.getElementById('main-menu-list');
        
        if (!navList) return;

        // تنظيف القائمة من العناصر المضافة سابقاً (لتجنب التكرار)
        // نقوم بحذف زر الدخول القديم أو أي عنصر مستخدم مضاف
        const oldUserItems = navList.querySelectorAll('.dynamic-nav-item');
        oldUserItems.forEach(el => el.remove());

        if (currentUser) {
            let extraLinks = '';
            
            if (currentUser.role === 'admin') {
                extraLinks += `<li class="dynamic-nav-item"><a href="admin.html" style="color:var(--secondary-color); font-weight:bold;">لوحة التحكم</a></li>`;
            }
            if (currentUser.role === 'manager') {
                extraLinks += `<li class="dynamic-nav-item"><a href="add-project.html">إضافة مشروع</a></li>`;
            }

            const userMenuHtml = `
                ${extraLinks}
                <li class="user-dropdown dynamic-nav-item">
                    <a href="#" onclick="return false;" style="display:flex; align-items:center; gap:5px;">
                        <img src="${currentUser.avatar || 'https://placehold.co/100x100'}" style="width:25px; height:25px; border-radius:50%;">
                        <span>${currentUser.name.split(' ')[0]}</span>
                    </a>
                </li>
                <li class="dynamic-nav-item"><a href="#" id="logout-btn" style="color:#ff6b6b;"><i class="fas fa-sign-out-alt"></i> خروج</a></li>
            `;
            
            navList.insertAdjacentHTML('beforeend', userMenuHtml);

            // تفعيل زر الخروج
            const logoutBtn = document.getElementById('logout-btn');
            if(logoutBtn){
                logoutBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    localStorage.removeItem('currentUser');
                    if(typeof showMessageBox === 'function') showMessageBox('تم تسجيل الخروج.', 'info');
                    setTimeout(() => window.location.href = 'index.html', 1000);
                });
            }

        } else {
            const loginLink = `<li class="dynamic-nav-item"><a href="login.html" class="button secondary small" style="border:1px solid white; color:white; padding:5px 15px;">دخول</a></li>`;
            navList.insertAdjacentHTML('beforeend', loginLink);
        }
    }

    // استدعاء دالة تحديث القائمة
    updateNavigationMenu();

    // التحقق من ملف البيانات
    if (typeof projectsData === 'undefined' || typeof donorsData === 'undefined') {
        console.warn('تنبيه: تأكد من تحميل js/data.js قبل هذا الملف.');
    }
});
/* إضافة في نهاية js/script.js لتشغيل نموذج الاتصال */
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // جمع البيانات
            const inputs = this.querySelectorAll('input, textarea');
            const newMessage = {
                name: inputs[0].value,
                email: inputs[1].value,
                message: inputs[2].value,
                date: new Date().toLocaleDateString('ar-YE')
            };

            // حفظ الرسالة في LocalStorage ليراها الأدمن
            const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
            messages.push(newMessage);
            localStorage.setItem('contactMessages', JSON.stringify(messages));

            // عرض نجاح
            if(typeof showMessageBox === 'function') {
                showMessageBox('تم إرسال رسالتك بنجاح! سنرد عليك قريباً.', 'success');
            } else {
                alert('تم الإرسال بنجاح!');
            }
            this.reset();
        });
    }
});