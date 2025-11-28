/* js/message-box.js - نظام الإشعارات المنبثقة */

/**
 * دالة لإظهار رسالة للمستخدم
 * @param {string} message - نص الرسالة
 * @param {string} type - نوع الرسالة ('success', 'error', 'info')
 */
function showMessageBox(message, type = 'success') {
    // 1. البحث عن الحاوية، أو إنشاؤها إذا لم تكن موجودة
    let container = document.getElementById('message-box-container');
    
    if (!container) {
        container = document.createElement('div');
        container.id = 'message-box-container';
        document.body.appendChild(container);
    }

    // 2. تحديد الأيقونة المناسبة حسب نوع الرسالة
    let icon = '';
    if (type === 'success') {
        icon = '<i class="fas fa-check-circle"></i>';
    } else if (type === 'error') {
        icon = '<i class="fas fa-times-circle"></i>';
    } else {
        icon = '<i class="fas fa-info-circle"></i>';
    }

    // 3. بناء محتوى الرسالة
    // نقوم بتنظيف الكلاسات القديمة وإضافة الجديدة
    container.className = `message-box ${type}`;
    
    container.innerHTML = `
        <span class="message-icon">${icon}</span>
        <span class="message-text">${message}</span>
        <button class="close-btn" onclick="closeMessageBox()">&times;</button>
    `;

    // 4. إظهار الرسالة (إضافة كلاس show لتفعيل الانيميشن في CSS)
    // نستخدم setTimeout بسيط لضمان تطبيق الانتقال الحركي
    setTimeout(() => {
        container.classList.add('show');
    }, 10);

    // 5. إخفاء الرسالة تلقائياً بعد 4 ثوانٍ
    setTimeout(() => {
        closeMessageBox();
    }, 4000);
}

// دالة لإغلاق الرسالة يدوياً
function closeMessageBox() {
    const container = document.getElementById('message-box-container');
    if (container) {
        container.classList.remove('show');
    }
}