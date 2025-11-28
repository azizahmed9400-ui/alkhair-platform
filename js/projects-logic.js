document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('all-projects-grid');
    
    if (grid && window.getStoredData && typeof projectsData !== 'undefined') {
        const allProjects = Object.values(window.getStoredData('projects', projectsData));
        
        grid.innerHTML = '';
        
        if (allProjects.length === 0) {
            grid.innerHTML = '<p class="no-data">لا توجد مشاريع حالياً.</p>';
            return;
        }

        allProjects.forEach(project => {
            // ... داخل الدالة ...
            const rawProjects = Object.values(window.getStoredData('projects', projectsData));
         // عرض فقط المشاريع النشطة (active) أو التي ليس لها حالة (للمشاريع القديمة)
            const allProjects = rawProjects.filter(p => !p.status || p.status === 'active');
         // ... أكمل باقي الكود ...
                   
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <img src="${project.imageUrl}" alt="${project.title}">
                <h3>${project.title}</h3>
                <p class="project-description">${project.tagline || project.description.substring(0, 100) + '...'}</p>
                <div class="progress-bar">
                    <div class="progress" style="width: ${progress}%"></div>
                </div>
                <div class="project-meta-summary">
                    <span>الهدف: ${Number(project.goal).toLocaleString()}</span>
                    <span>تم جمع: ${Number(project.paid).toLocaleString()}</span>
                </div>
                <a href="project-details.html?id=${project.id}" class="button primary">تفاصيل وتبرع</a>
            `;
            grid.appendChild(card);
        });
    }
});