// ========== تهيئة النظام ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 قدرات - تم تحميل الصفحة بنجاح');
    
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
    if (!header) return;
    
    // جعل الهيدر يتقلص بشكل أكثر وضوحاً
    window.addEventListener('scroll', function() {
        if (window.scrollY > 30) { // قلل من 50 إلى 30
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
                    <span class="company-category" style="font-size: 16px;">${getCategoryName(company.category)}</span>
                </div>
                
                <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <p style="color: #4b5563; line-height: 1.8; font-size: 16px;">${company.description}</p>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 30px;">
                    <div style="text-align: center; padding: 15px; background: white; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                        <div style="font-size: 24px; color: #3b82f6; margin-bottom: 5px;"><i class="fas fa-briefcase"></i></div>
                        <div style="font-weight: 600; color: #1f2937;">${company.jobs} وظيفة</div>
                    </div>
                    <div style="text-align: center; padding: 15px; background: white; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                        <div style="font-size: 24px; color: #10b981; margin-bottom: 5px;"><i class="fas fa-star"></i></div>
                        <div style="font-weight: 600; color: #1f2937;">${company.rating}/5 تقييم</div>
                    </div>
                    <div style="text-align: center; padding: 15px; background: white; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                        <div style="font-size: 24px; color: #f59e0b; margin-bottom: 5px;"><i class="fas fa-map-marker-alt"></i></div>
                        <div style="font-weight: 600; color: #1f2937;">${company.location}</div>
                    </div>
                </div>
                
                <button class="btn btn-primary btn-block" onclick="applyToCompany(${company.id})">
                    <i class="fas fa-paper-plane"></i> التقدم للوظائف
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // إغلاق النافذة عند النقر خارجها
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeCompanyModal();
            }
        });
    }
}

function closeCompanyModal() {
    const modal = document.getElementById('companyModal');
    if (modal) {
        modal.remove();
    }
}

function applyToCompany(companyId) {
    showNotification('تم إرسال طلبك بنجاح! ستتصل بك الشركة قريباً', 'success');
    closeCompanyModal();
}

// ========== النافذة المنبثقة للتسجيل ==========
function showRegisterModal(type) {
    const modal = document.getElementById('registerModal');
    if (!modal) return;
    
    modal.style.display = 'flex';
    
    // تبديل التبويب للنوع المحدد
    if (type === 'company') {
        switchTab('company');
    } else {
        switchTab('candidate');
    }
    
    // إضافة تأثير التركيز على أول حقل
    setTimeout(() => {
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            firstInput.focus();
        }
    }, 300);
}

function closeModal() {
    const modal = document.getElementById('registerModal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            modal.style.display = 'none';
            modal.style.animation = '';
        }, 300);
    }
}

function switchTab(type) {
    const candidateForm = document.getElementById('candidateForm');
    const companyForm = document.getElementById('companyForm');
    const tabs = document.querySelectorAll('.tab-btn');
    
    if (!candidateForm || !companyForm) return;
    
    // إخفاء جميع النماذج
    candidateForm.style.display = 'none';
    companyForm.style.display = 'none';
    
    // إزالة active من جميع الأزرار
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // إظهار النموذج المختار وإضافة active للزر
    if (type === 'candidate') {
        candidateForm.style.display = 'flex';
        tabs[0].classList.add('active');
    } else {
        companyForm.style.display = 'flex';
        tabs[1].classList.add('active');
    }
}

function registerUser(type) {
    let name, email, password;
    
    if (type === 'candidate') {
        name = document.getElementById('candidateName').value.trim();
        email = document.getElementById('candidateEmail').value.trim();
        password = document.getElementById('candidatePassword').value.trim();
    } else {
        name = document.getElementById('companyName').value.trim();
        email = document.getElementById('companyEmail').value.trim();
        password = document.getElementById('companyPassword').value.trim();
    }
    
    // التحقق من المدخلات
    if (!name || !email || !password) {
        showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
        return;
    }
    
    // محاكاة إرسال البيانات
    const userData = {
        type: type,
        name: name,
        email: email,
        timestamp: new Date().toISOString()
    };
    
    // حفظ في localStorage
    let users = JSON.parse(localStorage.getItem('wathafni_users')) || [];
    users.push(userData);
    localStorage.setItem('wathafni_users', JSON.stringify(users));
    
    // عرض رسالة النجاح
    const message = type === 'candidate' 
        ? `تم إنشاء حساب المرشح بنجاح! مرحباً ${name}`
        : `تم إرسال طلب حساب الشركة بنجاح! سنتواصل مع ${name} قريباً`;
    
    showNotification(message, 'success');
    
    // إغلاق النافذة وتنظيف الحقول
    closeModal();
    clearFormFields();
    
    // إذا كانت شركة جديدة، أضفها للقائمة
    if (type === 'company') {
        addNewCompany(name);
    }
}

function clearFormFields() {
    // مسح جميع حقول النماذج
    const inputs = document.querySelectorAll('#candidateForm input, #companyForm input');
    inputs.forEach(input => input.value = '');
}

function addNewCompany(companyName) {
    const companies = JSON.parse(localStorage.getItem('wathafni_companies')) || [];
    
    const newCompany = {
        id: companies.length + 1,
        name: companyName,
        category: "tech",
        description: "شركة جديدة مسجلة في منصة قدرات",
        logo: "🏢",
        jobs: Math.floor(Math.random() * 20) + 1,
        rating: (Math.random() * 1 + 4).toFixed(1),
        location: "بغداد",
        established: new Date().getFullYear()
    };
    
    companies.push(newCompany);
    localStorage.setItem('wathafni_companies', JSON.stringify(companies));
    
    // إعادة تحميل القائمة إذا كنا في صفحة الشركات
    if (document.getElementById('companiesList')) {
        loadCompanies();
    }
}

// ========== إشعارات ==========
function showNotification(message, type = 'info') {
    // إزالة أي إشعارات سابقة
    const oldNotification = document.querySelector('.notification');
    if (oldNotification) {
        oldNotification.remove();
    }
    
    // إنشاء الإشعار
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'info': 'info-circle',
        'warning': 'exclamation-triangle'
    };
    
    notification.innerHTML = `
        <i class="fas fa-${icons[type] || 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; cursor: pointer; color: inherit;">×</button>
    `;
    
    // إضافة أنماط للإشعار
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 3000;
            animation: slideDown 0.3s ease;
            max-width: 500px;
            width: 90%;
        }
        
        .notification-success {
            border-right: 4px solid #10b981;
            color: #065f46;
        }
        
        .notification-error {
            border-right: 4px solid #ef4444;
            color: #7f1d1d;
        }
        
        .notification-info {
            border-right: 4px solid #3b82f6;
            color: #1e3a8a;
        }
        
        .notification-warning {
            border-right: 4px solid #f59e0b;
            color: #92400e;
        }
        
        .notification i {
            font-size: 20px;
        }
        
        .notification button {
            margin-right: auto;
            font-size: 20px;
            padding: 0 8px;
        }
        
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // إزالة الإشعار تلقائياً بعد 5 ثواني
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// ========== تأثيرات التمرير ==========
function animateOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // تطبيق على جميع البطاقات
    document.querySelectorAll('.company-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// ========== فحص حالة النظام ==========
function checkSystemStatus() {
    console.log('🔍 فحص حالة النظام:');
    console.log('- المتصفح:', navigator.userAgent);
    console.log('- الشاشة:', window.innerWidth, 'x', window.innerHeight);
    console.log('- اللغة:', navigator.language);
    console.log('- الاتصال:', navigator.onLine ? 'متصل' : 'غير متصل');
    
    // التحقق من دعم localStorage
    if (typeof Storage !== 'undefined') {
        console.log('- localStorage: مدعوم');
    } else {
        console.error('- localStorage: غير مدعوم');
        showNotification('المتصفح لا يدعم حفظ البيانات محلياً', 'warning');
    }
}

// ========== دالات مساعدة ==========
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getCurrentYear() {
    return new Date().getFullYear();
}

// تحديث السنة في الفوتر
document.addEventListener('DOMContentLoaded', function() {
    const yearElement = document.querySelector('.copyright p');
    if (yearElement) {
        yearElement.innerHTML = yearElement.innerHTML.replace('2024', getCurrentYear());
    }
});
