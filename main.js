// أضف هذه الأسطر في بداية main.js
console.log('🚀 بدء تحميل main.js');

// ========== تهيئة النظام ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 تم تحميل الصفحة:', document.title);
    
    // تهيئة البيانات
    initializeData();
    
    // تحميل الشركات إذا كانت الصفحة تحتوي على العنصر
    if (document.getElementById('companiesList')) {
        console.log('🏢 تحميل قائمة الشركات...');
        loadCompanies();
    }
    
    // إصلاح الروابط
    fixDisabledLinks();
    fixRegisterButton();
    
    // فحص النظام
    checkSystemStatus();
    
    // إضافة event listeners للأزرار
    setupEventListeners();
});

// ========== إعداد event listeners ==========
function setupEventListeners() {
    // البحث في الصفحة الرئيسية
    document.querySelector('.search-box button')?.addEventListener('click', function() {
        const query = document.querySelector('.search-box input').value;
        const category = document.querySelector('.search-box select').value;
        
        if (query) {
            alert(`جار البحث عن "${query}" في ${category}`);
        } else {
            alert('يرجى إدخال كلمة للبحث');
        }
    });
    
    // إغلاق النافذة عند النقر خارجها
    document.getElementById('registerModal')?.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // إضافة event listener لزر تسجيل الشركة في الشركات
    document.querySelectorAll('.auth-buttons .btn-primary').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.textContent.includes('شركة')) {
                showRegisterModal('company');
            }
        });
    });
}

// باقي الدوال كما هي...
