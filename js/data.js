/* js/data.js */

// 1. قاعدة بيانات المشاريع
const projectsData = {
    'road-paving': {
        id: 'road-paving',
        title: 'مشروع رصف طريق الحي',
        category: 'بنية تحتية',
        tagline: 'المساهمة في رصف الطرق الداخلية لتسهيل حركة المرور.',
        imageUrl: 'https://placehold.co/800x450/4CAF50/FFFFFF?text=Road+Paving',
        description: 'يهدف هذا المشروع إلى رصف الطرق الداخلية في حي الروضة، والتي تعاني حالياً من تدهور كبير...',
        location: 'حي الروضة، تعز',
        goal: 500000,
        paid: 350000,
        donorsCount: 150,
        startDate: '2024-07-01',
        duration: '3 أشهر',
        progress: 70,
        mapEmbedUrl: 'https://maps.google.com/maps?q=Taizz,Yemen&t=&z=13&ie=UTF8&iwloc=&output=embed',
        problem: 'تدهور الطرق يؤدي إلى صعوبة التنقل.',
        objectives: ['رصف 5 كم', 'تحسين الوصول'],
        needsBudget: 'الميزانية التقديرية 500,000 ريال.',
        budgetBreakdown: [
             { name: 'مواد البناء', percent: '60%' },
             { name: 'أجور العمالة', percent: '25%' }
        ],
        timeline: '3 أشهر.',
        impacts: [
            { title: 'تسهيل الحياة', description: 'يستفيد منه 15,000 نسمة.' }
        ],
        team: [
            { name: 'أ. أحمد الفهيدي', role: 'مدير المشروع', imageUrl: 'https://placehold.co/150x150/FF9800/FFFFFF?text=Ahmed' }
        ],
        updates: [],
        expenditures: [],
        donors: [] // متبرعون خاصون بهذا المشروع فقط
    },
    'mosque-renovation': {
        id: 'mosque-renovation',
        title: 'مشروع ترميم مسجد النور',
        category: 'بناء وتعمير',
        tagline: 'إعادة ترميم وتجديد مسجد النور.',
        imageUrl: 'https://placehold.co/800x450/2196F3/FFFFFF?text=Mosque+Renovation',
        description: 'ترميم شامل للمسجد يشمل السقف والفرش.',
        location: 'حي الصفا',
        goal: 350000,
        paid: 105000,
        donorsCount: 80,
        progress: 30,
        duration: 'شهرين',
        team: [],
        donors: []
    },
    'school-renovation': {
        id: 'school-renovation',
        title: 'مشروع ترميم مدرسة الأمل',
        category: 'تعليم',
        tagline: 'تجديد الفصول الدراسية.',
        imageUrl: 'https://placehold.co/800x450/9C27B0/FFFFFF?text=School+Renovation',
        description: 'صيانة الفصول وتوفير مقاعد.',
        location: 'حي الأمل',
        goal: 700000,
        paid: 490000,
        progress: 70,
        duration: '4 أشهر',
        team: [],
        donors: []
    }
};

// 2. قاعدة بيانات المتبرعين العامة (لكل الموقع)
// هذا الجزء كان ناقصاً ويسبب المشكلة في الصفحة الرئيسية
const donorsData = [
    { id: 1, name: 'فاعل خير', amount: 5000, project: 'مشروع رصف طريق الحي', projectId: 'road-paving', date: '2024-07-01' },
    { id: 2, name: 'خالد السعدي', amount: 10000, project: 'مشروع رصف طريق الحي', projectId: 'road-paving', date: '2024-06-28' },
    { id: 3, name: 'فاعل خير', amount: 20000, project: 'مشروع ترميم مسجد النور', projectId: 'mosque-renovation', date: '2024-06-30' },
    { id: 4, name: 'علياء محمد', amount: 7500, project: 'مشروع رصف طريق الحي', projectId: 'road-paving', date: '2024-06-20' },
    { id: 5, name: 'مجموعة الشباب', amount: 20000, project: 'مشروع رصف طريق الحي', projectId: 'road-paving', date: '2024-06-18' }
];

// 3. قاعدة بيانات الفريق (سنحتاجها لاحقاً لصفحة الفريق الديناميكية)
const teamData = [
    { name: 'أ. محمد اليوسفي', role: 'المدير التنفيذي', image: 'https://placehold.co/150x150/FF9800/FFFFFF?text=Member+1' },
    { name: 'م. نور أحمد', role: 'مسؤولة المشاريع', image: 'https://placehold.co/150x150/FF9800/FFFFFF?text=Member+2' }
];
/* js/data.js - الجزء المضاف لبيانات الفريق */

// 3. بيانات الكادر المسؤول عن المنصة (Platform Team)
const platformTeamData = [
    { name: 'أ. عبد الله الحميدي', role: 'المدير التنفيذي', description: 'مسؤول عن الإشراف العام على جميع عمليات المنصة وضمان تحقيق الأهداف الإستراتيجية.', imageUrl: 'https://placehold.co/150x150/4CAF50/FFFFFF?text=CEO' },
    { name: 'م. سارة علي', role: 'مهندسة الموقع', description: 'مسؤولة عن تطوير وصيانة المنصة الإلكترونية لتحسين تجربة المستخدم.', imageUrl: 'https://placehold.co/150x150/FF9800/FFFFFF?text=Sarah' },
    { name: 'أ. محمد السقاف', role: 'المدير المالي', description: 'إدارة الموارد المالية للمنصة وضمان الشفافية في كل المعاملات.', imageUrl: 'https://placehold.co/150x150/3498db/FFFFFF?text=Mohamed' },
    { name: 'أ. فاطمة الزهراني', role: 'منسقة العلاقات المجتمعية', description: 'بناء وتعزيز الشراكات مع المؤسسات الخيرية والمجتمعات المستفيدة.', imageUrl: 'https://placehold.co/150x150/e74c3c/FFFFFF?text=Fatima' },
    { name: 'م. يوسف العبسي', role: 'دعم فني', description: 'يعمل على تطوير وصيانة المنصة الإلكترونية لتحسين تجربة المستخدم.', imageUrl: 'https://placehold.co/150x150/9b59b6/FFFFFF?text=Yousef' }
];
// 4. قاعدة بيانات الأخبار والتحديثات
const newsData = {
    'news-1': {
        id: 'news-1',
        title: 'تقرير ربع سنوي: أثر تبرعاتكم لعام 2024',
        summary: 'نقدم لكم تقريرنا المفصل عن المشاريع التي تم دعمها خلال الربع الثاني من العام، وكيف ساهمت تبرعاتكم في إحداث تغيير إيجابي...',
        imageUrl: 'https://placehold.co/800x450/3498db/FFFFFF?text=Quarterly+Report',
        content: 'تفاصيل التقرير: لقد تجاوزنا التوقعات في جمع التبرعات هذا الربع، مما سمح لنا بتمويل 5 مشاريع جديدة كبرى تركز على التعليم والبنية التحتية. نشكر كل من ساهم في تحقيق هذا الإنجاز...',
        date: '2024-06-15',
        author: 'فريق التحرير',
        comments: [
            { id: 1, name: 'سارة خالد', text: 'عمل رائع! الشفافية في عرض التقارير أمر يحسب لكم.', date: '2024-06-16' },
            { id: 2, name: 'متبرع كريم', text: 'ما هو المشروع الذي يحتاج للدعم الأكبر حالياً؟', date: '2024-06-17' }
        ]
    },
    'news-2': {
        id: 'news-2',
        title: 'حملة "إفطار صائم" في رمضان تحقق نجاحاً باهراً',
        summary: 'بفضل كرمكم، تمكنا من توزيع آلاف الوجبات على الأسر المحتاجة خلال شهر رمضان المبارك، مما أدخل الفرحة إلى قلوب الكثيرين...',
        imageUrl: 'https://placehold.co/800x450/e67e22/FFFFFF?text=Ramadan+Iftar',
        content: 'أقيمت الحملة في 10 مناطق مختلفة، وتم توزيع 15,000 وجبة إفطار. نثمن جهود المتطوعين الباسلة التي ساهمت في إنجاح هذه المبادرة الإنسانية الكبيرة.',
        date: '2024-04-10',
        author: 'قسم العلاقات العامة',
        comments: []
    }
    // يمكن إضافة المزيد من الأخبار هنا
};
/* --- 5. قاعدة بيانات المستخدمين والصلاحيات (محاكاة) --- */
const usersData = [
    { 
        id: 'u1', 
        username: 'admin', 
        password: '123', // في الواقع يجب أن تكون مشفرة (Hashed)
        name: 'أ. عبد الله (المدير)', 
        role: 'admin', // صلاحيات كاملة
        avatar: 'https://placehold.co/100x100/4CAF50/FFFFFF?text=A'
    },
    { 
        id: 'u2', 
        username: 'manager', 
        password: '123', 
        name: 'م. سارة (مديرة مشروع)', 
        role: 'manager', // إدارة مشاريع محددة فقط
        avatar: 'https://placehold.co/100x100/FF9800/FFFFFF?text=M'
    },
    { 
        id: 'u3', 
        username: 'donor', 
        password: '123', 
        name: 'فاعل خير (متبرع)', 
        role: 'donor', // تبرع ومشاهدة سجلات خاصة
        avatar: 'https://placehold.co/100x100/2196F3/FFFFFF?text=D'
    }
];