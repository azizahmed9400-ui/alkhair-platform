/* js/donors-logic.js - منطق عرض المتبرعين الديناميكي */

document.addEventListener('DOMContentLoaded', () => {
    // التحقق من وجود الدوال الأساسية اللازمة للعمل
    if (typeof window.getStoredData === 'undefined' || typeof donorsData === 'undefined' || typeof projectsData === 'undefined') {
        console.error('خطأ: لم يتم العثور على دوال LocalStorage أو ملف data.js. تأكد من ترتيب ملفات JS في donors.html.');
        return;
    }
    
    // سحب البيانات من LocalStorage، أو العودة إلى البيانات الافتراضية إذا لم توجد
    const allDonors = window.getStoredData('donors', donorsData);
    
    // سحب المشاريع لاستخدامها في فلتر المشاريع
    const allProjectsObject = window.getStoredData('projects', projectsData);
    const allProjectsArray = Object.values(allProjectsObject);

    // العناصر الأساسية في الصفحة
    const tableBody = document.getElementById('donors-table-body');
    const projectFilter = document.getElementById('project-filter');
    const prevPageBtn = document.getElementById('prev-page-btn');
    const nextPageBtn = document.getElementById('next-page-btn');
    const paginationInfo = document.getElementById('pagination-info');

    let currentPage = 1;
    const rowsPerPage = 10; // عدد الصفوف في كل صفحة

    /* =========================================
       1. تعبئة قائمة فلتر المشاريع
       ========================================= */
    function populateProjectFilter() {
        // تنظيف القائمة أولاً
        projectFilter.innerHTML = '<option value="all">عرض جميع المشاريع</option>';
        
        allProjectsArray.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            // استخدام عنوان المشروع كنص داخل القائمة المنسدلة
            option.textContent = project.title; 
            projectFilter.appendChild(option);
        });
    }

    /* =========================================
       2. دالة عرض المتبرعين في الجدول
       ========================================= */
    function displayDonors(donorsToDisplay) {
        // الفرز حسب التاريخ الأحدث أولاً
        const sortedDonors = donorsToDisplay.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // حساب بداية ونهاية البيانات للصفحة الحالية
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const pageDonors = sortedDonors.slice(start, end);
        
        tableBody.innerHTML = ''; // تنظيف الجدول

        if (pageDonors.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">لا توجد تبرعات لعرضها في هذه الصفحة.</td></tr>';
        } else {
            pageDonors.forEach(donor => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td data-label="الاسم">${donor.name}</td>
                    <td data-label="المبلغ">${donor.amount.toLocaleString()} ريال</td>
                    <td data-label="المشروع">${donor.project}</td>
                    <td data-label="التاريخ">${donor.date}</td>
                `;
                tableBody.appendChild(row);
            });
        }
        
        updatePaginationControls(donorsToDisplay.length);
    }

    /* =========================================
       3. دالة تحديث أدوات التحكم بالصفحات
       ========================================= */
    function updatePaginationControls(totalItems) {
        const totalPages = Math.ceil(totalItems / rowsPerPage);
        
        // تحديث رسالة المعلومات
        paginationInfo.textContent = `الصفحة ${currentPage} من ${totalPages} (${totalItems} تبرع)`;

        // تفعيل أو تعطيل الأزرار
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    }

    /* =========================================
       4. دالة الفلترة والعرض
       ========================================= */
    function filterAndDisplayDonors() {
        // العودة للصفحة الأولى عند كل فلترة جديدة
        if (event && event.type === 'change') {
             currentPage = 1;
        }

        const selectedProject = projectFilter.value;
        let filteredData = allDonors;

        if (selectedProject !== 'all') {
            filteredData = allDonors.filter(donor => donor.projectId === selectedProject);
        }
        
        displayDonors(filteredData);
    }

    /* =========================================
       5. تهيئة المستمعين للأحداث
       ========================================= */
    
    // الاستماع لتغيير الفلتر
    projectFilter.addEventListener('change', filterAndDisplayDonors);

    // الاستماع لأزرار التنقل بين الصفحات
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            filterAndDisplayDonors(); 
        }
    });

    nextPageBtn.addEventListener('click', () => {
        // نحتاج لحساب عدد الصفحات الإجمالي بناءً على الفلتر الحالي
        const selectedProject = projectFilter.value;
        let filteredData = allDonors;
        if (selectedProject !== 'all') {
            filteredData = allDonors.filter(donor => donor.projectId === selectedProject);
        }
        const totalPages = Math.ceil(filteredData.length / rowsPerPage);
        
        if (currentPage < totalPages) {
            currentPage++;
            filterAndDisplayDonors(); 
        }
    });

    // تشغيل الدوال عند تحميل الصفحة لأول مرة
    populateProjectFilter();
    filterAndDisplayDonors();
});