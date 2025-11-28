/* js/news-details-logic.js - منطق عرض تفاصيل الخبر والتعليقات */

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = urlParams.get('id');

    // التحقق من الدوال الأساسية والبيانات
    if (typeof window.getStoredData === 'undefined' || typeof window.newsData === 'undefined') {
        // ... (رسالة خطأ) ...
        return;
    }
    
    // سحب الأخبار من LocalStorage
    const allNewsObject = window.getStoredData('news', window.newsData);
    const newsItem = allNewsObject[newsId];

    const commentsList = document.getElementById('comments-list');
    const addCommentForm = document.getElementById('add-comment-form');
    const inquiryForm = document.getElementById('inquiry-form');

    // =========================================
    // 1. عرض تفاصيل الخبر
    // =========================================
    if (newsItem) {
        document.getElementById('page-title').textContent = `${newsItem.title} | منصة الخير`;
        document.getElementById('news-title-hero').textContent = newsItem.title;
        document.getElementById('news-meta-hero').textContent = `${newsItem.date} - الناشر: ${newsItem.author}`;
        document.getElementById('news-main-image').src = newsItem.imageUrl;
        document.getElementById('news-full-content').innerHTML = `<p>${newsItem.content.replace(/\n/g, '</p><p>')}</p>`; // لتقسيم المحتوى إلى فقرات

        // =========================================
        // 2. دالة عرض التعليقات
        // =========================================
        function renderComments(commentsArray) {
            commentsList.innerHTML = '';
            if (commentsArray.length === 0) {
                commentsList.innerHTML = '<p class="no-data">لا توجد تعليقات حتى الآن. كن أول من يعلق!</p>';
                return;
            }
            
            // عرض التعليقات الأحدث أولاً
            const sortedComments = commentsArray.sort((a, b) => new Date(b.date) - new Date(a.date));

            sortedComments.forEach(comment => {
                const commentDiv = document.createElement('div');
                commentDiv.className = 'comment-item';
                commentDiv.innerHTML = `
                    <p class="comment-header">
                        <strong><i class="fas fa-user-circle"></i> ${comment.name}</strong> 
                        <span class="comment-date">${comment.date}</span>
                    </p>
                    <p class="comment-text">${comment.text}</p>
                `;
                commentsList.appendChild(commentDiv);
            });
        }
        
        // عرض التعليقات عند التحميل
        renderComments(newsItem.comments);

        // =========================================
        // 3. منطق إضافة تعليق
        // =========================================
        addCommentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('comment-name').value.trim() || 'متبرع كريم';
            const text = document.getElementById('comment-text').value.trim();

            if (!text) {
                 showMessageBox('يرجى كتابة نص التعليق أولاً.', 'error');
                 return;
            }

            // إنشاء التعليق الجديد
            const newComment = {
                id: newsItem.comments.length + 1,
                name: name,
                text: text,
                date: new Date().toISOString().slice(0, 10)
            };
            
            // تحديث بيانات LocalStorage
            newsItem.comments.push(newComment);
            allNewsObject[newsId] = newsItem; // تحديث الكائن الرئيسي
            window.saveData('news', allNewsObject);
            
            // إعادة رسم قائمة التعليقات وعرض رسالة نجاح
            renderComments(newsItem.comments);
            showMessageBox('✅ تم إضافة تعليقك بنجاح!', 'success');
            addCommentForm.reset();
        });

    } else {
        // رسالة خطأ إذا لم يتم العثور على الخبر
        document.querySelector('main').innerHTML = `<section style="text-align: center; padding: 50px;">
                <h2>عذراً، الخبر غير موجود!</h2>
                <p>يرجى العودة إلى <a href="news.html">صفحة الأخبار</a>.</p>
            </section>`;
    }
    
    // =========================================
    // 4. منطق نموذج الاستفسارات الخاصة
    // =========================================
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // هذا القسم يحاكي إرسال رسالة بريد إلكتروني أو رسالة خاصة للمسؤولين
            showMessageBox('شكراً لك! لقد تم إرسال استفسارك الخاص بنجاح. سيتم التواصل معك عبر البريد الإلكتروني.', 'success');
            this.reset();
        });
    }
});