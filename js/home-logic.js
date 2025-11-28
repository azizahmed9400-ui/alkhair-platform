/* js/home-logic.js - منطق عرض البيانات الديناميكية في الصفحة الرئيسية */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. التحقق من التبعيات الأساسية ---
    if (typeof window.getStoredData === 'undefined' || typeof window.formatCurrency === 'undefined' || 
        typeof projectsData === 'undefined' || typeof donorsData === 'undefined' || typeof newsData === 'undefined') 
    {
        console.error('خطأ: تعذر تحميل دوال LocalStorage أو ملف data.js. تأكد من ترتيب ملفات JS في index.html.');
        return;
    }

    // --- 2. سحب جميع البيانات من LocalStorage أو البيانات الافتراضية ---
    const allProjectsObject = window.getStoredData('projects', projectsData);
    const allProjectsArray = Object.values(allProjectsObject);
    const allDonorsArray = window.getStoredData('donors', donorsData);
    const allNewsObject = window.getStoredData('news', newsData);
    const allNewsArray = Object.values(allNewsObject);
    
    // -----------------------------------------------------------
    // 3. عرض الإحصائيات العامة (قسم التقديرات/Stats)
    // -----------------------------------------------------------
    function renderStats() {
        const totalDonated = allDonorsArray.reduce((sum, donor) => sum + (donor.amount || 0), 0);
        const projectsInNeed = allProjectsArray.filter(p => p.progress < 100).length;

        document.getElementById('donated-amount').textContent = window.formatCurrency(totalDonated);
        document.getElementById('donors-count').textContent = allDonorsArray.length.toLocaleString();
        document.getElementById('projects-count').textContent = allProjectsArray.length.toLocaleString();
        document.getElementById('projects-in-need').textContent = projectsInNeed.toLocaleString();
    }


    // -----------------------------------------------------------
    // 4. عرض أحدث المشاريع (أحدث 3)
    // -----------------------------------------------------------
    function renderFeaturedProjects() {
        const projectsGrid = document.getElementById('featured-projects-grid');
        if (!projectsGrid) return;
        function renderFeaturedProjects() {
    // ...
    // فلترة المشاريع النشطة فقط
    const activeProjects = allProjectsArray.filter(p => !p.status || p.status === 'active');
    
    // فرز المشاريع النشطة
    const sortedProjects = activeProjects.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    // ...
}
        
        // فرز المشاريع حسب تاريخ البداية (الأحدث أولاً)
        const sortedProjects = allProjectsArray.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        const featuredProjects = sortedProjects.slice(0, 3); // عرض أول 3 فقط
        
        projectsGrid.innerHTML = ''; // تنظيف المحتوى

        featuredProjects.forEach(project => {
            const paid = project.paid || 0;
            const goal = project.goal || 1;
            const progress = Math.min(100, Math.round((paid / goal) * 100));
            const remaining = goal - paid;

            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            
            projectCard.innerHTML = `
                <img src="${project.imageUrl || window.APP_CONFIG.defaultImage}" alt="${project.title}">
                <div class="project-content">
                    <span class="project-category">${project.category}</span>
                    <h3>${project.title}</h3>
                    <p class="tagline">${project.tagline}</p>
                    
                    <div class="progress-container">
                        <div class="progress-bar" style="width: ${progress}%;"></div>
                    </div>

                    <div class="project-stats">
                        <div>
                            <span class="stat-label">الهدف:</span>
                            <span class="stat-value">${window.formatCurrency(goal)}</span>
                        </div>
                        <div>
                            <span class="stat-label">المتبقي:</span>
                            <span class="stat-value text-error">${window.formatCurrency(remaining)}</span>
                        </div>
                    </div>
                    
                    <div class="card-footer">
                        <a href="project-details.html?id=${project.id}" class="button primary small">تبرع الآن</a>
                        <a href="project-details.html?id=${project.id}" class="button secondary small">التفاصيل</a>
                    </div>
                </div>
            `;
            projectsGrid.appendChild(projectCard);
        });
    }

    // -----------------------------------------------------------
    // 5. عرض آخر المتبرعين (آخر 5)
    // -----------------------------------------------------------
    function renderLatestDonors() {
        const donorsTableBody = document.getElementById('latest-donors-table-body');
        if (!donorsTableBody) return;
        
        // فرز المتبرعين حسب التاريخ (الأحدث أولاً)
        const sortedDonors = allDonorsArray.sort((a, b) => new Date(b.date) - new Date(a.date));
        const latestDonors = sortedDonors.slice(0, 5); // عرض أول 5 فقط
        
        donorsTableBody.innerHTML = ''; // تنظيف المحتوى

        latestDonors.forEach(donor => {
            const projectName = allProjectsObject[donor.projectId] ? allProjectsObject[donor.projectId].title : 'مشروع محذوف';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${donor.name}</td>
                <td class="amount">${window.formatCurrency(donor.amount)}</td>
                <td>${projectName}</td>
                <td>${donor.date}</td>
            `;
            donorsTableBody.appendChild(row);
        });
    }
    
    // -----------------------------------------------------------
    // 6. عرض آخر الأخبار (أحدث 3)
    // -----------------------------------------------------------
    function renderLatestNews() {
        const newsGridHome = document.getElementById('latest-news-grid');
        if (!newsGridHome) return;
        
        // فرز الأخبار حسب التاريخ (الأحدث أولاً)
        const sortedNews = allNewsArray.sort((a, b) => new Date(b.date) - new Date(a.date));
        const latestNews = sortedNews.slice(0, 3); // عرض أول 3 فقط
        
        newsGridHome.innerHTML = ''; // تنظيف المحتوى

        latestNews.forEach(news => {
            const newsCard = document.createElement('div');
            newsCard.className = 'news-card-home'; 
            
            newsCard.innerHTML = `
                <img src="${news.imageUrl || window.APP_CONFIG.defaultImage}" alt="${news.title}">
                <div class="news-content-home">
                    <h4>${news.title}</h4>
                    <p class="news-date-home">${news.date} - ${news.author}</p>
                    <p class="news-summary-home">${news.summary.substring(0, 80)}...</p>
                    <a href="news-details.html?id=${news.id}" class="button secondary small">اقرأ المزيد</a>
                </div>
            `;
            newsGridHome.appendChild(newsCard);
        });
    }

    // -----------------------------------------------------------
    // 7. تشغيل الدوال عند التحميل
    // -----------------------------------------------------------
    renderStats();
    renderFeaturedProjects();
    renderLatestDonors();
    renderLatestNews();

    // ربط الحدث 'dataUpdated' لإعادة تحميل الإحصائيات عند حفظ أي بيانات جديدة (مثل التبرع)
    window.addEventListener('dataUpdated', () => {
        renderStats();
        // يمكن إضافة renderLatestDonors() و renderFeaturedProjects() هنا أيضاً
    });
});