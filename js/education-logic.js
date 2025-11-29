/* js/education-logic.js - منطق عرض وتشغيل الكورسات */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. البيانات الافتراضية (في حال لم يرفع الفريق شيئاً بعد)
    const defaultCourses = [
        {
            id: 'c1',
            title: 'أساسيات تصوير المشاريع الخيرية',
            instructor: 'أ. سارة أحمد',
            category: 'media',
            thumbnail: 'https://img.youtube.com/vi/aqz-KE-bpKQ/hqdefault.jpg', // صورة وهمية
            videoId: 'aqz-KE-bpKQ', // فيديو يوتيوب تجريبي (Big Buck Bunny كمثال)
            duration: '10 دقيقة',
            description: 'تعلم كيف توثق لحظات الفرح وتأثير المساعدات باحترافية باستخدام هاتفك فقط.'
        },
        {
            id: 'c2',
            title: 'إدارة فرق التطوع الميداني',
            instructor: 'م. خالد علي',
            category: 'management',
            thumbnail: 'https://img.youtube.com/vi/Ye8mB6VsUHw/hqdefault.jpg',
            videoId: 'Ye8mB6VsUHw',
            duration: '25 دقيقة',
            description: 'دليل شامل لقادة الفرق الميدانية لضمان سير العمليات بسلاسة وأمان.'
        }
    ];

    // جلب البيانات من التخزين أو استخدام الافتراضي
    const courses = window.getStoredData('courses', defaultCourses);
    const grid = document.getElementById('courses-grid');
    const filterSelect = document.getElementById('course-filter');

    // 2. دالة العرض (Rendering)
    function renderCourses(filter = 'all') {
        grid.innerHTML = '';
        
        const filteredCourses = (filter === 'all') 
            ? courses 
            : courses.filter(c => c.category === filter);

        if (filteredCourses.length === 0) {
            grid.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">لا توجد دورات في هذا القسم حالياً.</p>';
            return;
        }

        filteredCourses.forEach(course => {
            const card = document.createElement('div');
            card.className = 'course-card'; // سنضيف التنسيق في CSS
            // صورة الغلاف: إما المدخلة أو تلقائية من يوتيوب
            const thumb = course.thumbnail || `https://img.youtube.com/vi/${course.videoId}/hqdefault.jpg`;
            
            card.innerHTML = `
                <div class="card-image-wrapper" style="position:relative; cursor:pointer;" onclick="playVideo('${course.videoId}', '${course.title}', '${course.description}')">
                    <img src="${thumb}" alt="${course.title}" style="width:100%; height:200px; object-fit:cover; border-radius:10px 10px 0 0;">
                    <div class="play-icon-overlay"><i class="fas fa-play-circle"></i></div>
                </div>
                <div class="course-content" style="padding:20px; background:white; border:1px solid #eee; border-radius:0 0 10px 10px;">
                    <span class="badge" style="background:#e0f2f1; color:var(--primary-color); padding:4px 8px; border-radius:4px; font-size:0.8em;">${getCategoryName(course.category)}</span>
                    <h3 style="margin:10px 0; font-size:1.1em;">${course.title}</h3>
                    <div style="display:flex; justify-content:space-between; color:#777; font-size:0.9em; margin-bottom:15px;">
                        <span><i class="fas fa-user-tie"></i> ${course.instructor}</span>
                        <span><i class="fas fa-clock"></i> ${course.duration}</span>
                    </div>
                    <button onclick="playVideo('${course.videoId}', '${course.title}', '${course.description}')" class="button secondary small" style="width:100%;">مشاهدة الآن</button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // ترجمة التصنيفات
    function getCategoryName(cat) {
        const names = {
            'media': 'إعلام وتوثيق',
            'management': 'إدارة',
            'tech': 'تقنية',
            'field': 'ميداني'
        };
        return names[cat] || cat;
    }

    // 3. فلترة
    filterSelect.addEventListener('change', (e) => {
        renderCourses(e.target.value);
    });

    // 4. تشغيل الفيديو (Modal Logic)
    window.playVideo = function(videoId, title, desc) {
        if(!videoId) { alert('رابط الفيديو غير صالح'); return; }
        
        const modal = document.getElementById('video-modal');
        const iframe = document.getElementById('video-iframe');
        
        // رابط التضمين (Embed)
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        
        document.getElementById('modal-video-title').textContent = title;
        document.getElementById('modal-video-desc').textContent = desc || ''; // منع ظهور undefined
        
        modal.style.display = 'flex';
    };

    window.closeVideoModal = function() {
        const modal = document.getElementById('video-modal');
        const iframe = document.getElementById('video-iframe');
        
        iframe.src = ''; // إيقاف الفيديو
        modal.style.display = 'none';
    };

    // التشغيل الأولي
    renderCourses();
});