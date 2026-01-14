// ========== تهيئة النظام ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 وظفني - تم تحميل الصفحة بنجاح');
    
    // تهيئة الهيدر الذكي
    initSmartHeader();
    
    // تهيئة البيانات
    initializeData();
    
    // تحميل الشركات إذا كانت الصفحة تحتوي على العنصر
    if (document.getElementById('companiesList')) {
        console.log('🏢 تحميل قائمة الشركات...');
        loadCompanies();
        setupFilterTags();
    }
    
    // إعداد المستمعين للأحداث
    setupEventListeners();
    
    // فحص حالة النظام
    checkSystemStatus();
});

// ========== الهيدر الذكي ==========
function initSmartHeader() {
    const header = document.querySelector('.header');
    
    // التحقق من وجود الهيدر
    if (!header) return;
    
    // إضافة مستمع للتمرير
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // إضافة تأثير للشعار
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ========== إعداد event listeners ==========
function setupEventListeners() {
    // البحث في صفحة الشركات
    const searchInput = document.getElementById('companySearch');
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchCompanies();
            }
        });
    }
    
    // البحث في الصفحة الرئيسية
    document.querySelector('.search-box button')?.addEventListener('click', searchCompanies);
    
    // إغلاق النافذة المنبثقة عند النقر خارجها
    const modal = document.getElementById('registerModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
        
        // إغلاق النافذة عند الضغط على زر الهروب
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    }
    
    // أزرار التسجيل
    document.querySelectorAll('.btn-primary').forEach(btn => {
        if (btn.textContent.includes('تسجيل كشركة')) {
            btn.addEventListener('click', function() {
                showRegisterModal('company');
            });
        }
    });
    
    document.querySelectorAll('.btn-outline').forEach(btn => {
        if (btn.textContent.includes('تسجيل كمرشح')) {
            btn.addEventListener('click', function() {
                showRegisterModal('candidate');
            });
        }
    });
}

// ========== تهيئة البيانات ==========
function initializeData() {
    // بيانات الشركات الافتراضية
    const defaultCompanies = [
        {
            id: 1,
            name: "تكنو سوفت العراق",
            category: "tech",
            description: "شركة رائدة في مجال تطوير البرمجيات والحلول التقنية في العراق",
            logo: "💻",
            jobs: 12,
            rating: 4.8,
            location: "بغداد",
            established: 2010
        },
        {
            id: 2,
            name: "بنك الرافدين",
            category: "finance",
            description: "أحد أكبر البنوك العراقية يقدم خدمات مصرفية متكاملة",
            logo: "🏦",
            jobs: 24,
            rating: 4.6,
            location: "كافة المحافظات",
            established: 1941
        },
        {
            id: 3,
            name: "شركة نفط الجنوب",
            category: "energy",
            description: "الشركة الرائدة في مجال استخراج وتصنيع النفط والغاز",
            logo: "⛽",
            jobs: 45,
            rating: 4.9,
            location: "البصرة",
            established: 1972
        },
        {
            id: 4,
            name: "مستشفى الكفيل التخصصي",
            category: "health",
            description: "مستشفى متخصص يقدم خدمات طبية متطورة في كافة التخصصات",
            logo: "🏥",
            jobs: 18,
            rating: 4.7,
            location: "كربلاء",
            established: 2003
        },
        {
            id: 5,
            name: "زين العراق",
            category: "tech",
            description: "شركة اتصالات رائدة في العراق تقدم خدمات الجيل الرابع",
            logo: "📱",
            jobs: 32,
            rating: 4.5,
            location: "كافة المحافظات",
            established: 2003
        },
        {
            id: 6,
            name: "مجموعة الناصر",
            category: "finance",
            description: "مجموعة استثمارية متنوعة الأنشطة في القطاع المالي والتجاري",
            logo: "📊",
            jobs: 15,
            rating: 4.4,
            location: "بغداد",
            established: 1998
        },
        {
            id: 7,
            name: "أسياد للإنشاءات",
            category: "construction",
            description: "شركة متخصصة في الإنشاءات والبنية التحتية",
            logo: "🏗️",
            jobs: 22,
            rating: 4.3,
            location: "أربيل",
            established: 2005
        },
        {
            id: 8,
            name: "أكاديمية العراق الرقمية",
            category: "education",
            description: "مؤسسة تعليمية رائدة في مجال التدريب التقني",
            logo: "🎓",
            jobs: 8,
            rating: 4.8,
            location: "بغداد",
            established: 2015
        }
    ];
    
    // حفظ البيانات في localStorage إذا لم تكن موجودة
    if (!localStorage.getItem('wathafni_companies')) {
        localStorage.setItem('wathafni_companies', JSON.stringify(defaultCompanies));
    }
}

// ========== تحميل الشركات ==========
function loadCompanies() {
    const container = document.getElementById('companiesList');
    if (!container) return;
    
    // جلب البيانات من localStorage
    const companies = JSON.parse(localStorage.getItem('wathafni_companies')) || [];
    
    // مسح المحتوى القديم
    container.innerHTML = '';
    
    // التحقق من وجود شركات
    if (companies.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-building" style="font-size: 60px; color: #9ca3af; margin-bottom: 20px;"></i>
                <h3 style="color: #6b7280;">لا توجد شركات مسجلة حالياً</h3>
                <p style="color: #9ca3af;">كن أول من يسجل شركته في منصتنا</p>
                <button class="btn btn-primary" onclick="showRegisterModal('company')">
                    <i class="fas fa-building"></i> سجل شركتك الآن
                </button>
            </div>
        `;
        return;
    }
    
    // إنشاء بطاقات الشركات
    companies.forEach(company => {
        const card = document.createElement('div');
        card.className = 'company-card';
        card.dataset.category = company.category;
        
        card.innerHTML = `
            <div class="company-logo">${company.logo}</div>
            <div class="company-info">
                <h3>${company.name}</h3>
                <span class="company-category">${getCategoryName(company.category)}</span>
                <p class="company-description">${company.description}</p>
                <div class="company-stats">
                    <span><i class="fas fa-briefcase"></i> ${company.jobs} وظيفة</span>
                    <span><i class="fas fa-star"></i> ${company.rating}/5</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${company.location}</span>
                </div>
            </div>
            <button class="btn btn-outline btn-block" onclick="viewCompany(${company.id})">
                <i class="fas fa-eye"></i> عرض التفاصيل
            </button>
        `;
        
        container.appendChild(card);
    });
    
    // إضافة تأثيرات عند التمرير
    animateOnScroll();
}

// ========== الحصول على اسم القطاع ==========
function getCategoryName(category) {
    const categories = {
        'tech': 'تقنية المعلومات',
        'finance': 'خدمات مالية',
        'energy': 'طاقة ونفط',
        'health': 'رعاية صحية',
        'construction': 'إنشاءات',
        'education': 'تعليم وتدريب'
    };
    return categories[category] || category;
}

// ========== إعداد أزرار التصفية ==========
function setupFilterTags() {
    const tags = document.querySelectorAll('.filter-tag');
    if (!tags.length) return;
    
    tags.forEach(tag => {
        tag.addEventListener('click', function() {
            // إزالة active من جميع الأزرار
            tags.forEach(t => t.classList.remove('active'));
            
            // إضافة active للزر المضغوط
            this.classList.add('active');
            
            // تصفية الشركات
            const category = this.dataset.category;
            filterCompanies(category);
        });
    });
}

// ========== تصفية الشركات ==========
function filterCompanies(category) {
    const cards = document.querySelectorAll('.company-card');
    
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'flex';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            // إضافة تأثير الظهور
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        } else {
            card.style.display = 'none';
        }
    });
}

// ========== بحث الشركات ==========
function searchCompanies() {
    const searchInput = document.getElementById('companySearch');
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    
    const cards = document.querySelectorAll('.company-card');
    let resultsFound = 0;
    
    cards.forEach(card => {
        const companyName = card.querySelector('h3').textContent.toLowerCase();
        const companyDesc = card.querySelector('.company-description').textContent.toLowerCase();
        const companyCategory = card.querySelector('.company-category').textContent.toLowerCase();
        
        if (companyName.includes(searchTerm) || 
            companyDesc.includes(searchTerm) || 
            companyCategory.includes(searchTerm)) {
            card.style.display = 'flex';
            card.style.animation = 'fadeIn 0.5s ease';
            resultsFound++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // إظهار رسالة إذا لم توجد نتائج
    if (searchTerm && resultsFound === 0) {
        showNotification('لم يتم العثور على شركات تطابق بحثك', 'info');
    }
}

// ========== عرض تفاصيل الشركة ==========
function viewCompany(id) {
    const companies = JSON.parse(localStorage.getItem('wathafni_companies')) || [];
    const company = companies.find(c => c.id === id);
    
    if (company) {
        // إنشاء نافذة تفاصيل الشركة
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'companyModal';
        modal.style.display = 'flex';
        
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="margin: 0;"><i class="fas fa-building"></i> ${company.name}</h3>
                    <button onclick="closeCompanyModal()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280;">×</button>
                </div>
                
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="font-size: 70px; margin-bottom: 20px;">${company.logo}</div>
                    <span class="company-category" style="font-size:
