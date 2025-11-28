/* js/team-logic.js - منطق عرض أعضاء الفريق */

document.addEventListener('DOMContentLoaded', () => {
    
    // التحقق من تحميل بيانات الفريق
    if (typeof platformTeamData === 'undefined') {
         console.error('خطأ: لم يتم العثور على بيانات الفريق (platformTeamData).');
         // في حالة فشل التحميل، نستخدم ID الحاوية لعرض رسالة خطأ
         const fallbackGrid = document.getElementById('platform-team-grid');
         if(fallbackGrid) fallbackGrid.innerHTML = '<p style="text-align:center;">تعذر تحميل بيانات الفريق. يرجى التأكد من ملف data.js.</p>';
         return;
    }
    
    const teamGrid = document.getElementById('platform-team-grid');
    
    if (teamGrid) {
        teamGrid.innerHTML = ''; // تنظيف المحتوى الثابت القديم
        
        platformTeamData.forEach(member => {
            const memberCard = document.createElement('div');
            memberCard.className = 'team-member-card';
            
            const description = member.description || 'لا يوجد وصف متاح.';
            
            memberCard.innerHTML = `
                <img src="${member.imageUrl || 'https://placehold.co/150x150/FF9800/FFFFFF?text=No+Image'}" alt="صورة ${member.name}">
                <h3>${member.name}</h3>
                <p class="member-role">${member.role}</p>
                <p class="role-description">${description}</p>
            `;
            
            teamGrid.appendChild(memberCard);
        });
    }
});