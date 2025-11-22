document.addEventListener('DOMContentLoaded', () => {
    // Get project ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    // Mock data for projects (in a real project, this would come from the backend)
    const projectsData = {
        'road-paving': {
            title: 'مشروع رصف طريق الحي',
            tagline: 'المساهمة في رصف الطرق الداخلية لتسهيل حركة المرور وتحسين البنية التحتية.',
            imageUrl: 'https://placehold.co/800x450/4CAF50/FFFFFF?text=Road+Paving+Project', // Placeholder image
            description: 'يهدف هذا المشروع إلى رصف الطرق الداخلية في حي [اسم الحي]، والتي تعاني حالياً من تدهور كبير يؤثر على حركة السير ويسبب تجمع المياه والأتربة. سيسهم المشروع في تحسين جودة الحياة للسكان، وتسهيل وصول الخدمات الأساسية، وتعزيز المظهر العام للمنطقة. نحن نسعى لجمع المبلغ المطلوب لإتمام هذا العمل الحيوي الذي سيخدم الآلاف من سكان الحي.',
            location: 'حي الروضة، تعز',
            goal: '500,000 ريال يمني',
            duration: '3 أشهر',
            totalCost: 500000,
            paid: 350000, // Increased paid amount for demonstration
            donorsCount: 150, // Increased donor count
            progress: 70, // Increased progress for demonstration
            galleryImages: [
                'https://placehold.co/300x200/4CAF50/FFFFFF?text=Road+Site+1',
                'https://placehold.co/300x200/4CAF50/FFFFFF?text=Road+Site+2',
                'https://placehold.co/300x200/4CAF50/FFFFFF?text=Road+Site+3',
                'https://placehold.co/300x200/4CAF50/FFFFFF?text=Road+Site+4'
            ],
            mapEmbedUrl: 'https://maps.google.com/maps?q=Taizz,Yemen&t=&z=13&ie=UTF8&iwloc=&output=embed',
            problem: 'تدهور الطرق في الحي يؤدي إلى صعوبة في التنقل، تلف المركبات، وتراكم المياه القذرة خلال موسم الأمطار مما يسبب انتشار الأمراض ويعيق حركة التجارة والخدمات الأساسية.',
            objectives: [
                'رصف 5 كيلومترات من الطرق الداخلية.',
                'تحسين سهولة الوصول للمنازل والمدارس والمرافق الصحية.',
                'تقليل تلوث الهواء الناتج عن الغبار.',
                'المساهمة في بيئة صحية وآمنة للسكان.'
            ],
            needsBudget: 'الميزانية التقديرية هي <span class="highlight-text">500,000 ريال يمني</span>.',
            budgetBreakdown: [
                { name: 'مواد البناء', percent: '60%' },
                { name: 'أجور العمالة', percent: '25%' },
                { name: 'إيجار المعدات', percent: '10%' },
                { name: 'مصاريف إدارية وتشغيلية', percent: '5%' }
            ],
            timeline: 'من المتوقع أن يستغرق المشروع 3 أشهر، بدءًا من 15 يوليو 2024 وحتى 15 أكتوبر 2024، مع تقسيم العمل على مراحل محددة.',
            impacts: [
                { title: 'تسهيل الحياة اليومية', description: 'سيستفيد حوالي 15,000 نسمة بشكل مباشر من الطرق المعبدة، مما يقلل من زمن التنقل ويزيد من سلامة المشاة والمركبات.' },
                { title: 'دعم الاقتصاد المحلي', description: 'سيوفر المشروع فرص عمل مؤقتة لسكان الحي، كما سيشجع على ازدهار الأعمال التجارية الصغيرة بسبب سهولة الوصول.' },
                { title: 'تحسين البيئة والصحة', description: 'تقليل الغبار والأتربة سيساهم في بيئة صحية أكثر، وتقليل تجمع المياه سيحد من انتشار الحشرات والأمراض.' },
                { title: 'تعزيز الانتماء المجتمعي', description: 'المشروع يمثل نموذجًا للتكافل المجتمعي، ويعزز شعور السكان بالانتماء والتكاتف لتحقيق التنمية.' }
            ],
            team: [
                { name: 'أ. أحمد الفهيدي', role: 'مدير المشروع', description: 'يشرف على جميع مراحل التنفيذ ويضمن جودة العمل.', imageUrl: 'https://placehold.co/150x150/FF9800/FFFFFF?text=Ahmed' },
                { name: 'م. سارة علي', role: 'مهندسة الموقع', description: 'مسؤولة عن الإشراف الهندسي والفني في الموقع.', imageUrl: 'https://placehold.co/150x150/FF9800/FFFFFF?text=Sarah' },
                { name: 'أ. فاطمة الزهراني', role: 'منسقة العلاقات المجتمعية', description: 'تتواصل مع السكان وتستقبل ملاحظاتهم ومقترحاتهم.', imageUrl: 'https://placehold.co/150x150/FF9800/FFFFFF?text=Fatima' }
            ],
            donors: [
                { name: 'فاعل خير', amount: '5000 ريال', date: '2024-07-01' },
                { name: 'خالد السعدي', amount: '10000 ريال', date: '2024-06-28' },
                { name: 'فاعل خير', amount: '1500 ريال', date: '2024-06-25' },
                { name: 'علياء محمد', amount: '7500 ريال', date: '2024-06-20' },
                { name: 'مجموعة الشباب', amount: '20000 ريال', date: '2024-06-18' }
            ],
            expenditures: [
                { id: 1, date: '2024-07-02', item: 'شراء 50 كيس أسمنت', amount: 100000, responsible: 'أحمد الفهيدي', recipient: 'محل مواد البناء', status: 'confirmed', invoiceUrl: 'https://example.com/invoice_cement_1.pdf', category: 'materials' },
                { id: 2, date: '2024-07-02', item: 'أجور عمال (يوم 1)', amount: 30000, responsible: 'سارة علي', recipient: 'محمد العامل', status: 'pending', invoiceUrl: null, category: 'labor' },
                { id: 3, date: '2024-07-03', item: 'نقل أحجار (10 طن)', amount: 50000, responsible: 'أحمد الفهيدي', recipient: 'شركة النقل السريع', status: 'confirmed', invoiceUrl: 'https://example.com/invoice_transport_1.pdf', category: 'transport' },
                { id: 4, date: '2024-07-03', item: 'وجبات غداء للعمال', amount: 5000, responsible: 'فاطمة الزهراني', recipient: 'مطعم القرية', status: 'pending', invoiceUrl: null, category: 'meals' },
                { id: 5, date: '2024-07-04', item: 'شراء ديزل للمعدات', amount: 15000, responsible: 'سارة علي', recipient: 'محطة الوقود', status: 'confirmed', invoiceUrl: 'https://example.com/invoice_fuel_1.pdf', category: 'fuel' },
                { id: 6, date: '2024-07-04', item: 'أجور عمال (يوم 2)', amount: 30000, responsible: 'سارة علي', recipient: 'علي العامل', status: 'pending', invoiceUrl: null, category: 'labor' },
                { id: 7, date: '2024-07-05', item: 'شراء رمل (5 متر مكعب)', amount: 20000, responsible: 'أحمد الفهيدي', recipient: 'مورد الرمل', status: 'pending', invoiceUrl: null, category: 'materials' },
                { id: 8, date: '2024-07-05', item: 'وجبات إفطار للعمال', amount: 3000, responsible: 'فاطمة الزهراني', recipient: 'مخبز القرية', status: 'confirmed', invoiceUrl: 'https://example.com/invoice_meals_2.pdf', category: 'meals' },
                { id: 9, date: '2024-07-06', item: 'صيانة معدات خفيفة', amount: 8000, responsible: 'سارة علي', recipient: 'ورشة الصيانة', status: 'pending', invoiceUrl: null, category: 'misc' },
                { id: 10, date: '2024-07-06', item: 'أجور عمال (يوم 3)', amount: 30000, responsible: 'سارة علي', recipient: 'فهد العامل', status: 'pending', invoiceUrl: null, category: 'labor' }
            ],
            updates: [
                { id: 1, date: '2024-07-05', title: 'بدء أعمال الرصف في المرحلة الأولى', description: 'تم اليوم البدء الفعلي في أعمال رصف الطريق، حيث قام فريق من المتطوعين والعمال المهرة بوضع الأساسات لأول 100 متر. نتقدم بالشكر الجزيل لكل من ساهم في هذه البداية الموفقة.', imageUrl: 'https://placehold.co/600x400/FF9800/FFFFFF?text=Update+Image+1' },
                { id: 2, date: '2024-07-03', title: 'وصول الدفعة الأولى من مواد البناء', description: 'وصلت اليوم شحنة كبيرة من الأحجار والأسمنت والرمل إلى موقع المشروع. هذا يمثل خطوة مهمة نحو بدء العمل الفعلي. شكراً لدعمكم المستمر.', imageUrl: 'https://placehold.co/600x400/FF9800/FFFFFF?text=Update+Image+2' },
                { id: 3, date: '2024-07-01', title: 'اجتماع تنسيقي مع فريق العمل والمتطوعين', description: 'عقد فريق إدارة المشروع اجتماعاً تنسيقياً مع المتطوعين وأصحاب المعدات لمناقشة خطة العمل وتوزيع المهام للمرحلة الأولى من المشروع.', imageUrl: 'https://placehold.co/600x400/FF9800/FFFFFF?text=Update+Image+3' }
            ]
        },
        'mosque-renovation': {
            title: 'مشروع ترميم مسجد النور',
            tagline: 'إعادة ترميم وتجديد مسجد النور ليكون مكانًا مناسبًا للعبادة والتجمع.',
            imageUrl: 'https://placehold.co/800x450/4CAF50/FFFFFF?text=Mosque+Renovation+Project',
            description: 'يواجه مسجد النور تحديات كبيرة بسبب قدم بنائه وتأثر أجزاء منه بالعوامل الجوية، مما يؤثر على سلامة المصلين وجمالية المكان. يهدف هذا المشروع إلى ترميم المسجد بالكامل، بما في ذلك الواجهات، الأسقف، الأرضيات، وتجديد أنظمة الصوت والإضاءة. سيساعد هذا في توفير بيئة روحية هادئة ومريحة للمصلين ويعيد للمسجد مكانته كمركز روحي للمجتمع.',
            location: 'حي الصفا، تعز',
            goal: '350,000 ريال يمني',
            duration: 'شهرين',
            totalCost: 350000,
            paid: 105000,
            donorsCount: 80,
            progress: 30,
            galleryImages: [
                'https://placehold.co/300x200/4CAF50/FFFFFF?text=Mosque+Site+1',
                'https://placehold.co/300x200/4CAF50/FFFFFF?text=Mosque+Site+2',
                'https://placehold.co/300x200/4CAF50/FFFFFF?text=Mosque+Site+3',
                'https://placehold.co/300x200/4CAF50/FFFFFF?text=Mosque+Site+4'
            ],
            mapEmbedUrl: 'https://maps.google.com/maps?q=Taizz,Yemen&t=&z=13&ie=UTF8&iwloc=&output=embed',
            problem: 'مسجد النور يعاني من التدهور مما يهدد سلامة المصلين ويؤثر على إقبالهم.',
            objectives: [
                'ترميم شامل لجدران وأسقف المسجد.',
                'تجديد أنظمة الصوت والإضاءة.',
                'تحسين مرافق الوضوء ودورات المياه.',
                'توفير سجود جديدة ومريحة.'
            ],
            needsBudget: 'الميزانية التقديرية لترميم المسجد هي <span class="highlight-text">350,000 ريال يمني</span> لتغطية تكاليف مواد البناء، أجور العمال، والمعدات اللازمة.',
            budgetBreakdown: [
                { name: 'مواد البناء', percent: '50%' },
                { name: 'أجور العمالة', percent: '30%' },
                { name: 'إيجار المعدات', percent: '10%' },
                { name: 'مصاريف إدارية وتشغيلية', percent: '10%' }
            ],
            timeline: 'يتوقع الانتهاء من أعمال الترميم خلال شهرين من تاريخ بدء المشروع.',
            impacts: [
                { title: 'بيئة عبادة آمنة', description: 'توفير مسجد آمن ونظيف وجذاب يشجع المزيد من الناس على أداء الصلوات.' },
                { title: 'مركز مجتمعي', description: 'إعادة إحياء دور المسجد كمركز للأنشطة الدينية والاجتماعية والثقافية.' },
                { title: 'فخر الحي', description: 'المساهمة في جمالية الحي وزيادة الفخر بالمرافق العامة.' }
            ],
            team: [
                { name: 'أ. علي الحمادي', role: 'مشرف المشروع', description: 'يتولى الإشراف العام على أعمال الترميم والتنسيق.', imageUrl: 'https://placehold.co/150x150/FF9800/FFFFFF?text=Ali' },
                { name: 'م. نور الهدى', role: 'مهندسة معمارية', description: 'مسؤولة عن التصميم المعماري وضمان الجودة.', imageUrl: 'https://placehold.co/150x150/FF9800/FFFFFF?text=Noor' }
            ],
            donors: [
                { name: 'فاعل خير', amount: '20000 ريال', date: '2024-06-30' },
                { name: 'عائلة الجمال', amount: '15000 ريال', date: '2024-06-27' },
                { name: 'فاعل خير', amount: '5000 ريال', date: '2024-06-24' }
            ],
            expenditures: [],
            updates: []
        },
        'school-renovation': {
            title: 'مشروع ترميم مدرسة الأمل',
            tagline: 'تجديد الفصول الدراسية وتوفير بيئة تعليمية أفضل لأطفالنا.',
            imageUrl: 'https://placehold.co/800x450/4CAF50/FFFFFF?text=School+Renovation+Project',
            description: 'مدرسة الأمل هي إحدى المدارس الأساسية في الحي وتخدم مئات الطلاب يومياً، لكنها تعاني من تهالك البنية التحتية، ونقص في التجهيزات الأساسية مثل المقاعد ووسائل الإيضاح. يهدف هذا المشروع إلى ترميم الفصول الدراسية، صيانة دورات المياه، توفير مقاعد دراسية جديدة، وتجهيز مختبر صغير. سيسهم هذا المشروع في خلق بيئة تعليمية محفزة وصحية للأطفال، مما ينعكس إيجابًا على أدائهم الأكاديمي وصحتهم النفسية.',
            location: 'حي النور، تعز',
            goal: '700,000 ريال يمني',
            duration: '4 أشهر',
            totalCost: 700000,
            paid: 490000,
            donorsCount: 200,
            progress: 70,
            galleryImages: [
                'https://placehold.co/300x200/4CAF50/FFFFFF?text=School+Site+1',
                'https://placehold.co/300x200/4CAF50/FFFFFF?text=School+Site+2',
                'https://placehold.co/300x200/4CAF50/FFFFFF?text=School+Site+3',
                'https://placehold.co/300x200/4CAF50/FFFFFF?text=School+Site+4'
            ],
            mapEmbedUrl: 'https://maps.google.com/maps?q=Taizz,Yemen&t=&z=13&ie=UTF8&iwloc=&output=embed',
            problem: 'تهالك مبنى المدرسة يؤثر على جودة التعليم وصحة الطلاب.',
            objectives: [
                'ترميم شامل لـ 10 فصول دراسية.',
                'صيانة وتجديد دورات المياه.',
                'توفير 200 مقعد دراسي جديد.',
                'إنشاء مختبر علوم صغير.'
            ],
            needsBudget: 'الميزانية المطلوبة لترميم المدرسة هي <span class="highlight-text">700,000 ريال يمني</span> لتغطية تكاليف الإصلاحات وشراء التجهيزات الجديدة.',
            budgetBreakdown: [
                { name: 'مواد البناء والصيانة', percent: '55%' },
                { name: 'تجهيزات ومقاعد دراسية', percent: '30%' },
                { name: 'أجور العمالة', percent: '10%' },
                { name: 'مصاريف إدارية', percent: '5%' }
            ],
            timeline: 'من المتوقع إنجاز المشروع خلال 4 أشهر، مع بدء الأعمال في بداية العطلة الصيفية.',
            impacts: [
                { title: 'تحسين التحصيل العلمي', description: 'توفير بيئة تعليمية أفضل ستعزز من تركيز الطلاب وتحصيلهم العلمي.' },
                { title: 'صحة وسلامة الطلاب', description: 'تحسين المرافق الصحية يقلل من مخاطر الأمراض بين الطلاب.' },
                { title: 'تقليل التسرب المدرسي', description: 'البيئة المدرسية المحفزة تشجع الطلاب على البقاء في المدرسة.' }
            ],
            team: [
                { name: 'أ. محمد سعيد', role: 'مدير برنامج التعليم', description: 'يشرف على الجوانب التعليمية للمشروع.', imageUrl: 'https://placehold.co/150x150/FF9800/FFFFFF?text=Mohammed' },
                { name: 'م. ليلى يوسف', role: 'مهندسة مدنية', description: 'مسؤولة عن الجودة الهندسية لأعمال الترميم.', imageUrl: 'https://placehold.co/150x150/FF9800/FFFFFF?text=Layla' },
                { name: 'د. خالد العمري', role: 'مستشار تربوي', description: 'يقدم المشورة حول أفضل الممارسات التعليمية.', imageUrl: 'https://placehold.co/150x150/FF9800/FFFFFF?text=Khaled' }
            ],
            donors: [
                { name: 'فاعل خير', amount: '10000 ريال', date: '2024-07-01' },
                { name: 'مؤسسة الأيادي الخضراء', amount: '50000 ريال', date: '2024-06-29' },
                { name: 'فاعل خير', amount: '2500 ريال', date: '2024-06-26' },
                { name: 'جيران الحي', amount: '30000 ريال', date: '2024-06-22' }
            ],
            expenditures: [],
            updates: []
        }
        // Add more mock projects here if needed for testing
    };

    const project = projectsData[projectId];

    if (project) {
        // Update main title and hero section
        document.title = `${project.title} | منصة الخير`;
        document.getElementById('project-title-hero').textContent = project.title;
        document.getElementById('project-tagline-hero').textContent = project.tagline;
        document.getElementById('project-main-image').src = project.imageUrl;
        document.getElementById('project-main-image').alt = project.title;
        document.getElementById('project-title-summary').textContent = project.title;
        document.getElementById('project-description-full').textContent = project.description;
        document.getElementById('project-location').textContent = project.location;
        document.getElementById('project-goal').textContent = project.goal;
        document.getElementById('project-duration').textContent = project.duration;

        // Update funding section
        document.getElementById('project-total-cost').textContent = `${project.totalCost.toLocaleString()} ريال`;
        document.getElementById('project-paid').textContent = `${project.paid.toLocaleString()} ريال`;
        document.getElementById('project-remaining').textContent = `${(project.totalCost - project.paid).toLocaleString()} ريال`;
        document.getElementById('project-donors-count').textContent = project.donorsCount;
        const progressBar = document.getElementById('project-progress-bar');
        progressBar.style.width = `${project.progress}%`;
        progressBar.textContent = `${project.progress}%`;
        document.getElementById('donate-project-name').textContent = project.title; // Update project name in donate form

        // Update gallery images
        const galleryGrid = document.getElementById('project-gallery-grid');
        galleryGrid.innerHTML = ''; // Clear default images
        project.galleryImages.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = 'صورة من موقع المشروع';
            galleryGrid.appendChild(img);
        });

        // Update map location
        document.querySelector('.project-map-section iframe').src = project.mapEmbedUrl;

        // Update feasibility study
        document.getElementById('feasibility-problem').textContent = project.problem;
        const objectivesList = document.getElementById('feasibility-objectives');
        objectivesList.innerHTML = '';
        project.objectives.forEach(obj => {
            const li = document.createElement('li');
            li.textContent = obj;
            objectivesList.appendChild(li);
        });
        document.getElementById('feasibility-needs-budget').innerHTML = project.needsBudget;

        const budgetBreakdownList = document.getElementById('budget-breakdown-list');
        budgetBreakdownList.innerHTML = '';
        project.budgetBreakdown.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="icon-${item.name.replace(/\s/g, '').toLowerCase()}"></i> ${item.name}: ${item.percent}`;
            budgetBreakdownList.appendChild(li);
        });

        document.getElementById('feasibility-timeline').textContent = project.timeline;

        // Update impacts section
        const impactSectionList = document.getElementById('project-impact-list');
        impactSectionList.innerHTML = ''; // Clear old content
        project.impacts.forEach(impact => {
            const div = document.createElement('div');
            div.classList.add('impact-item');
            div.innerHTML = `<h3>${impact.title}:</h3><p>${impact.description}</p>`;
            impactSectionList.appendChild(div);
        });

        // Update team members
        const teamMembersGrid = document.getElementById('project-team-grid');
        teamMembersGrid.innerHTML = '';
        project.team.forEach(member => {
            const card = document.createElement('div');
            card.classList.add('team-member-card');
            card.innerHTML = `
                <img src="${member.imageUrl}" alt="${member.name}">
                <h3>${member.name}</h3>
                <p>${member.role}</p>
                <p class="role-description">${member.description}</p>
            `;
            teamMembersGrid.appendChild(card);
        });

        // Update project-specific donors table
        const projectDonorsTableBody = document.getElementById('project-donors-table');
        projectDonorsTableBody.innerHTML = '';
        project.donors.forEach(donor => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${donor.name}</td><td>${donor.amount}</td><td>${donor.date}</td>`;
            projectDonorsTableBody.appendChild(tr);
        });

        // --- Logic for Expenditures Section ---

        const expenditureTableBody = document.getElementById('expenditure-table-body');
        const expenditureFilter = document.getElementById('expenditure-category-filter');
        const prevExpenditureBtn = document.getElementById('prev-expenditure-page');
        const nextExpenditureBtn = document.getElementById('next-expenditure-page');
        const currentExpenditurePageSpan = document.getElementById('current-expenditure-page');
        const totalExpenditurePagesSpan = document.getElementById('total-expenditure-pages');

        let currentExpenditurePage = 1;
        const expendituresPerPage = 5; // Number of rows per page for expenditures

        // Function to display expenditures
        function displayExpenditures(data) {
            expenditureTableBody.innerHTML = ''; // Clear current table content
            const start = (currentExpenditurePage - 1) * expendituresPerPage;
            const end = start + expendituresPerPage;
            const paginatedData = data.slice(start, end);

            if (paginatedData.length === 0) {
                expenditureTableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: #777;">لا توجد مصروفات لعرضها في هذه الفئة.</td></tr>';
            }

            paginatedData.forEach(exp => {
                const row = document.createElement('tr');
                const statusClass = exp.status === 'confirmed' ? 'status-confirmed' : 'status-pending';
                const statusText = exp.status === 'confirmed' ? 'مؤكد' : 'بانتظار التأكيد';
                const invoiceLink = exp.invoiceUrl ? `<a href="${exp.invoiceUrl}" target="_blank" class="invoice-link">عرض</a>` : 'لا يوجد';

                // Simulate confirmation button logic
                // In a real app, this button would only appear for authorized users (e.g., the recipient or an admin)
                const confirmButtonHtml = exp.status === 'pending' ?
                    `<button class="confirm-button button secondary" data-exp-id="${exp.id}">تأكيد</button>` :
                    `<button class="confirm-button button secondary" disabled>تم التأكيد</button>`;

                row.innerHTML = `
                    <td>${exp.date}</td>
                    <td>${exp.item}</td>
                    <td>${exp.amount.toLocaleString()} ريال</td>
                    <td>${exp.responsible}</td>
                    <td>${exp.recipient}</td>
                    <td class="${statusClass}">${statusText}</td>
                    <td>${invoiceLink}</td>
                    <td>${confirmButtonHtml}</td>
                `;
                expenditureTableBody.appendChild(row);
            });

            updateExpenditurePaginationControls(data.length);
            addConfirmationListeners(); // Add listeners after rendering
        }

        // Function to filter and display expenditures
        function filterAndDisplayExpenditures() {
            const selectedCategory = expenditureFilter.value;
            let filteredData = project.expenditures;

            if (selectedCategory !== 'all') {
                filteredData = project.expenditures.filter(exp => exp.category === selectedCategory);
            }

            // Sort by date descending
            filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));

            currentExpenditurePage = 1; // Reset page on filter change
            displayExpenditures(filteredData);
        }

        // Function to update expenditure pagination controls
        function updateExpenditurePaginationControls(totalRows) {
            const totalPages = Math.ceil(totalRows / expendituresPerPage);
            currentExpenditurePageSpan.textContent = currentExpenditurePage;
            totalExpenditurePagesSpan.textContent = totalPages;

            prevExpenditureBtn.disabled = currentExpenditurePage === 1;
            nextExpenditureBtn.disabled = currentExpenditurePage === totalPages || totalPages === 0;
        }

        // Function to add event listeners to confirmation buttons
        function addConfirmationListeners() {
            document.querySelectorAll('.confirm-button[data-exp-id]').forEach(button => {
                // Remove existing listener to prevent duplicates
                button.removeEventListener('click', handleConfirmationClick);
                // Add new listener
                button.addEventListener('click', handleConfirmationClick);
            });
        }

        // Handler for confirmation button click
        function handleConfirmationClick(event) {
            const button = event.target;
            const expenditureId = parseInt(button.dataset.expId); // Get the ID

            // In a real application, you would send an API request here
            // For now, we'll simulate the confirmation
            simulateConfirmation(expenditureId, button);
        }

        // Simulate confirmation (replace with actual API call later)
        function simulateConfirmation(expenditureId, button) {
            console.log(`Simulating confirmation for expenditure ID: ${expenditureId}`);

            // Find the expenditure in the mock data and update its status
            const exp = project.expenditures.find(e => e.id === expenditureId);
            if (exp) {
                exp.status = 'confirmed';
                console.log(`Expenditure ${expenditureId} status updated to confirmed (mock).`);

                // Update the UI
                const row = button.closest('tr');
                const statusCell = row.querySelector(`td:nth-child(6)`); // Assuming status is the 6th cell
                if (statusCell) {
                    statusCell.textContent = 'مؤكد';
                    statusCell.classList.remove('status-pending');
                    statusCell.classList.add('status-confirmed');
                }
                button.textContent = 'تم التأكيد';
                button.disabled = true;
                showMessageBox('تم تأكيد استلام المصروف بنجاح!', 'success');
            } else {
                showMessageBox('حدث خطأ: لم يتم العثور على المصروف لتأكيده.', 'error');
            }
        }

        // Event listeners for expenditure section
        expenditureFilter.addEventListener('change', filterAndDisplayExpenditures);
        prevExpenditureBtn.addEventListener('click', () => {
            const selectedCategory = expenditureFilter.value;
            let filteredData = project.expenditures;
            if (selectedCategory !== 'all') {
                filteredData = project.expenditures.filter(exp => exp.category === selectedCategory);
            }
            filteredData.sort((a, b) => new Date(b.date) - new Date(a.date)); // Re-sort after filter
            if (currentExpenditurePage > 1) {
                currentExpenditurePage--;
                displayExpenditures(filteredData);
            }
        });
        nextExpenditureBtn.addEventListener('click', () => {
            const selectedCategory = expenditureFilter.value;
            let filteredData = project.expenditures;
            if (selectedCategory !== 'all') {
                filteredData = project.expenditures.filter(exp => exp.category === selectedCategory);
            }
            filteredData.sort((a, b) => new Date(b.date) - new Date(a.date)); // Re-sort after filter
            const totalPages = Math.ceil(filteredData.length / expendituresPerPage);
            if (currentExpenditurePage < totalPages) {
                currentExpenditurePage++;
                displayExpenditures(filteredData);
            }
        });

        // --- Logic for Project Updates Section ---

        // Function to display project updates
        function displayUpdates(updatesData) {
            const projectUpdatesList = document.getElementById('project-updates-list');
            projectUpdatesList.innerHTML = ''; // Clear current content

            if (updatesData.length === 0) {
                projectUpdatesList.innerHTML = '<p style="text-align: center; color: #777;">لا توجد تحديثات حالياً لهذا المشروع.</p>';
                return;
            }

            // Sort updates by date descending
            updatesData.sort((a, b) => new Date(b.date) - new Date(a.date));

            updatesData.forEach(update => {
                const updateCard = document.createElement('div');
                updateCard.classList.add('update-card');
                updateCard.innerHTML = `
                    <img src="${update.imageUrl}" alt="صورة تحديث" class="update-image">
                    <div class="update-content">
                        <h3>${update.title}</h3>
                        <p class="update-date">${update.date}</p>
                        <p class="update-description">${update.description}</p>
                        <a href="#" class="button secondary">مشاهدة التفاصيل</a>
                    </div>
                `;
                projectUpdatesList.appendChild(updateCard);
            });
        }

        // Initial display calls
        filterAndDisplayExpenditures(); // Display expenditures on page load
        displayUpdates(project.updates); // Display updates on page load

    } else {
        // Redirect to 404 page or show error if project not found
        document.getElementById('project-title-hero').textContent = 'المشروع غير موجود!';
        document.getElementById('project-tagline-hero').textContent = 'الرجاء التحقق من الرابط أو العودة إلى صفحة المشاريع.';
        document.querySelector('main').innerHTML = '<section style="text-align: center; padding: 50px;"><h2>عذراً، هذا المشروع غير موجود.</h2><p>يرجى العودة إلى <a href="projects.html">صفحة المشاريع</a>.</p></section>';
    }

    // Handle donate form submission (mock)
    const donateForm = document.getElementById('donate-form');
    if (donateForm) {
        donateForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const amount = document.getElementById('amount').value;
            const isAnonymous = document.getElementById('anonymous').checked;

            // In a real app, send donation data to backend
            console.log(`Donation received: ${amount} ريال. Anonymous: ${isAnonymous}`);

            // Show a mock success message using the custom message box
            showMessageBox(`شكراً لك على تبرعك بمبلغ ${amount.toLocaleString()} ريال! لقد تم استلام تبرعك بنجاح.`, 'success');
            this.reset(); // Clear the form

            // Optionally, update project progress mock data
            if (project) {
                project.paid += parseFloat(amount);
                project.donorsCount += 1;
                project.progress = Math.min(100, (project.paid / project.totalCost) * 100);

                // Re-render the funding section to reflect changes
                document.getElementById('project-total-cost').textContent = `${project.totalCost.toLocaleString()} ريال`;
                document.getElementById('project-paid').textContent = `${project.paid.toLocaleString()} ريال`;
                document.getElementById('project-remaining').textContent = `${(project.totalCost - project.paid).toLocaleString()} ريال`;
                document.getElementById('project-donors-count').textContent = project.donorsCount;
                const progressBar = document.getElementById('project-progress-bar');
                progressBar.style.width = `${project.progress}%`;
                progressBar.textContent = `${project.progress.toFixed(0)}%`;
            }
        });
    }
});
