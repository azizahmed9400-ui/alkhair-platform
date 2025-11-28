/* js/news-logic.js - منطق عرض الأخبار الديناميكي */

document.addEventListener('DOMContentLoaded', () => {
    
    // التحقق من الدوال الأساسية
    if (typeof window.getStoredData === 'undefined' || typeof window.newsData === 'undefined') {
        console.error('خطأ: لم يتم العثور على دوال LocalStorage أو ملف data.js.');
        return;
    }

    const newsGrid = document.getElementById('news-grid-container');
    if (!newsGrid) return;
    
    // سحب الأخبار من LocalStorage، أو العودة إلى البيانات الافتراضية
    const allNewsObject = window.getStoredData('news', window.newsData);
    const allNewsArray = Object.values(allNewsObject);
    
    // فرز الأخبار حسب التاريخ (الأحدث أولاً)
    const sortedNews = allNewsArray.sort((a, b) => new Date(b.date) - new Date(a.date));

    newsGrid.innerHTML = ''; // تنظيف المحتوى القديم

    sortedNews.forEach(news => {
        const newsCard = document.createElement('div');
        newsCard.className = 'news-card';
        
        // بناء بطاقة الخبر
        newsCard.innerHTML = `
            <img src="${news.imageUrl}" alt="${news.title}">
            <div class="news-content">
                <h3>${news.title}</h3>
                <p class="news-date">${news.date} - ${news.author}</p>
                <p class="news-summary">${news.summary}</p>
                <a href="news-details.html?id=${news.id}" class="button secondary">اقرأ المزيد</a>
            </div>
        `;
        newsGrid.appendChild(newsCard);
    });

});