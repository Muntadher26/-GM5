// ========== SYSTEM INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 وظفني - النظام جاهز');
    
    // تهيئة المكونات
    initHeader();
    initMobileMenu();
    initModals();
    initForms();
    
    // تحميل البيانات حسب الصفحة
    if (document.getElementById('companiesList')) {
        loadCompanies();
        initFilters();
    }
    
    if (document.querySelector('.search-box')) {
        initSearch();
    }
    
    // تحديث السنة في الفوتر
    updateCurrentYear();
    
    // تحسينات إضافية
    initAnimations();
    checkSystemStatus();
});

// ========== HEADER FUNCTIONALITY ==========
function initHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    
    // جعل الهيدر يتقلص عند التمرير
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // النقر على الشعار للعودة للأعلى
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

// ========== MOBILE MENU ==========
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const closeMenu = document.querySelector('.close-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
    
    if (!menuToggle || !mobileMenu) return;
    
    // فتح القائمة
    menuToggle.addEventListener('click', function() {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // إغلاق القائمة
    if (closeMenu) {
        closeMenu.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // إغلاق القائمة عند النقر على رابط
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // إغلاق القائمة عند النقر خارجها
    document.addEventListener('click', function(event) {
        if (mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(event.target) && 
            event.target !== menuToggle) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ========== MODAL SYSTEM ==========
function initModals() {
    const registerModal = document.getElementById('registerModal');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    if (!registerModal || !modalOverlay) return;
    
    // إغلاق النافذة عند النقر على الزر X
    const closeButtons = document.querySelectorAll('[data-close-modal]');
    closeButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });
    
    // إغلاق النافذة عند النقر خارجها
    modalOverlay.addEventListener('click', function(e) {
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
    
    // تبديل تبويبات التسجيل
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tab = this.dataset.tab;
            switchRegisterTab(tab);
        });
    });
}

function showRegisterModal(type = 'candidate') {
    const modalOverlay = document.querySelector('.modal-overlay');
    if (!modalOverlay) return;
    
    modalOverlay.classList.add('active');
    switchRegisterTab(type);
    
    // التركيز على أول حقل إدخال
    setTimeout(() => {
        const firstInput = modalOverlay.querySelector('input');
        if (firstInput) firstInput.focus();
    }, 100);
}

function closeModal() {
    const modalOverlay = document.querySelector('.modal-overlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
    }
}

function switchRegisterTab(tab) {
    const forms = {
        candidate: document.getElementById('candidateForm'),
        company: document.getElementById('companyForm')
    };
    
    const tabs = {
        candidate: document.querySelector('[data-tab="candidate"]'),
        company: document.querySelector('[data-tab="company"]')
    };
    
    // إخفاء جميع النماذج
    Object.values(forms).forEach(form => {
        if (form) form.style.display = 'none';
    });
    
    // إزالة النشاط من جميع الأزرار
    Object.values(tabs).forEach(tabBtn => {
        if (tabBtn) tabBtn.classList.remove('active');
    });
    
    // إظهار النموذج المختار
    if (forms[tab]) {
        forms[tab].style.display = 'flex';
    }
    
    // تفعيل الزر المختار
    if (tabs[tab]) {
        tabs[tab].classList.add('active');
    }
}

// ========== FORM HANDLING ==========
function initForms() {
    // نموذج تسجيل المرشح
    const candidateForm = document.getElementById('candidateForm');
    if (candidateForm) {
        candidateForm.addEventListener('submit', function(e) {
            e.preventDefault();
            registerCandidate();
        });
    }
    
    // نموذج تسجيل الشركة
    const companyForm = document.getElementById('companyForm');
    if (companyForm) {
        companyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            registerCompany();
        });
    }
}

function registerCandidate() {
    const name = document.getElementById('candidateName')?.value.trim();
    const email = document.getElementById('candidateEmail')?.value.trim();
    const password = document.getElementById('candidatePassword')?.value.trim();
    
    if (!validateForm(name, email, password)) return;
    
    // محاكاة الإرسال
    const candidateData = {
        type: 'candidate',
        name: name,
        email: email,
        joined: new Date().toISOString()
    };
    
    saveToLocalStorage('candidates', candidateData);
    showNotification('تم إنشاء حساب المرشح بنجاح!', 'success');
    closeModal();
    resetForm('candidateForm');
}

function registerCompany() {
    const name = document.getElementById('companyName')?.value.trim();
    const email = document.getElementById('companyEmail')?.value.trim();
    const password = document.getElementById('companyPassword')?.value.trim();
    
    if (!validateForm(name, email, password)) return;
    
    // محاكاة الإرسال
    const companyData = {
        type: 'company',
        name: name,
        email: email,
        joined: new Date().toISOString()
    };
    
    saveToLocalStorage('companies', companyData);
    showNotification('تم إرسال طلب تسجيل الشركة بنجاح!', 'success');
    closeModal();
    resetForm('companyForm');
}

function validateForm(name, email, password) {
    if (!name || !email || !password) {
        showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
        return false;
    }
    
    if (!isValidEmail(email)) {
        showNotification('يرجى إدخال بريد إلكتروني صحيح', 'error');
        return false;
    }
    
    if (password.length < 6) {
        showNotification('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function resetForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
    }
}

// ========== COMPANIES PAGE ==========
function loadCompanies() {
    const container = document.getElementById('companiesList');
    if (!container) return;
    
    // بيانات الشركات الافتراضية
    const defaultCompanies = [
        {
            id: 1,
            name: "تكنو سوفت العراق",
            category: "tech",
            description: "شركة رائدة في مجال تطوير البرمجيات والحلول التقنية في العراق",
            icon: "laptop-code",
            color: "#3b82f6",
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
            icon: "university",
            color: "#10b981",
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
            icon: "oil-can",
            color: "#f59e0b",
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
            icon: "hospital",
            color: "#ef4444",
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
            icon: "mobile-alt",
            color: "#8b5cf6",
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
            icon: "chart-line",
            color: "#06b6d4",
            jobs: 15,
            rating: 4.4,
            location: "بغداد",
            established: 1998
        }
    ];
    
    // حفظ البيانات في localStorage
    if (!localStorage.getItem('companies_data')) {
        localStorage.setItem('companies_data', JSON.stringify(defaultCompanies));
    }
    
    const companies = JSON.parse(localStorage.getItem('companies_data')) || defaultCompanies;
    
    // عرض الشركات
    container.innerHTML = '';
    
    if (companies.length === 0) {
        container.innerHTML = `
            <div class="text-center p-5">
                <i class="fas fa-building fa-3x text-gray-400 mb-3"></i>
                <h3 class="text-gray-600">لا توجد شركات مسجلة حالياً</h3>
                <p class="text-gray-500 mb-4">كن أول من يسجل شركته في منصتنا</p>
                <button class="btn btn-primary" onclick="showRegisterModal('company')">
                    <i class="fas fa-building"></i>
                    سجل شركتك الآن
                </button>
            </div>
        `;
        return;
    }
    
    companies.forEach(company => {
        const card = createCompanyCard(company);
        container.appendChild(card);
    });
}

function createCompanyCard(company) {
    const card = document.createElement('div');
    card.className = 'company-card';
    card.dataset.category = company.category;
    
    const categoryNames = {
        tech: 'تقنية المعلومات',
        finance: 'خدمات مالية',
        energy: 'طاقة ونفط',
        health: 'رعاية صحية',
        construction: 'إنشاءات',
        education: 'تعليم'
    };
    
    card.innerHTML = `
        <div class="company-logo">
            <i class="fas fa-${company.icon}" style="color: ${company.color}; font-size: 3rem;"></i>
        </div>
        <div class="company-info">
            <h3 class="company-name">${company.name}</h3>
            <span class="company-category">${categoryNames[company.category] || company.category}</span>
            <p class="company-description">${company.description}</p>
            <div class="company-stats">
                <div class="company-stat">
                    <i class="fas fa-briefcase"></i>
                    <span>${company.jobs} وظيفة</span>
                </div>
                <div class="company-stat">
                    <i class="fas fa-star"></i>
                    <span>${company.rating}/5</span>
                </div>
                <div class="company-stat">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${company.location}</span>
                </div>
            </div>
        </div>
        <button class="btn btn-outline btn-block mt-3" onclick="viewCompanyDetails(${company.id})">
            <i class="fas fa-eye"></i>
            عرض التفاصيل
        </button>
    `;
    
    return card;
}

function initFilters() {
    const filterTags = document.querySelectorAll('.filter-tag');
    
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // إزالة النشاط من جميع الأزرار
            filterTags.forEach(t => t.classList.remove('active'));
            
            // تفعيل الزر المضغوط
            this.classList.add('active');
            
            // تصفية الشركات
            const category = this.dataset.filter;
            filterCompanies(category);
        });
    });
}

function filterCompanies(category) {
    const cards = document.querySelectorAll('.company-card');
    
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

function viewCompanyDetails(companyId) {
    const companies = JSON.parse(localStorage.getItem('companies_data')) || [];
    const company = companies.find(c => c.id === companyId);
    
    if (!company) {
        showNotification('لم يتم العثور على الشركة', 'error');
        return;
    }
    
    const modalContent = `
        <div class="modal-header">
            <h3 class="modal-title">
                <i class="fas fa-building"></i>
                ${company.name}
            </h3>
            <button type="button" class="btn btn-text" data-close-modal>
                <i class="fas fa-times"></i>
            </button>
        </div>
        
        <div class="text-center mb-4">
            <i class="fas fa-${company.icon}" style="font-size: 4rem; color: ${company.color};"></i>
        </div>
        
        <div class="bg-gray rounded-lg p-4 mb-4">
            <p class="text-muted">${company.description}</p>
        </div>
        
        <div class="grid grid-cols-2 gap-3 mb-4">
            <div class="bg-white p-3 rounded-lg text-center">
                <div class="text-2xl font-bold text-primary">${company.jobs}</div>
                <div class="text-sm text-muted">وظيفة شاغرة</div>
            </div>
            <div class="bg-white p-3 rounded-lg text-center">
                <div class="text-2xl font-bold text-success">${company.rating}</div>
                <div class="text-sm text-muted">التقييم</div>
            </div>
            <div class="bg-white p-3 rounded-lg text-center">
                <div class="text-xl font-bold text-warning">${company.location}</div>
                <div class="text-sm text-muted">المكان</div>
            </div>
            <div class="bg-white p-3 rounded-lg text-center">
                <div class="text-xl font-bold text-purple">${company.established}</div>
                <div class="text-sm text-muted">سنة التأسيس</div>
            </div>
        </div>
        
        <div class="modal-actions">
            <button class="btn btn-primary flex-1" onclick="applyToCompany(${company.id})">
                <i class="fas fa-paper-plane"></i>
                التقدم للوظائف
            </button>
            <button class="btn btn-outline flex-1" data-close-modal>
                إغلاق
            </button>
        </div>
    `;
    
    showCustomModal(modalContent);
}

function applyToCompany(companyId) {
    showNotification('تم إرسال طلبك بنجاح!', 'success');
    closeModal();
}

// ========== SEARCH FUNCTIONALITY ==========
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    
    if (searchInput && searchButton) {
        // البحث عند النقر على الزر
        searchButton.addEventListener('click', performSearch);
        
        // البحث عند الضغط على Enter
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

function performSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchTerm = searchInput.value.trim();
    
    if (!searchTerm) {
        showNotification('يرجى إدخال كلمة للبحث', 'info');
        return;
    }
    
    // توجيه إلى صفحة الوظائف مع كلمة البحث
    window.location.href = `jobs.html?search=${encodeURIComponent(searchTerm)}`;
}

// ========== UTILITY FUNCTIONS ==========
function showNotification(message, type = 'info') {
    // إنصراف أي إشعارات سابقة
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // إنشاء الإشعار الجديد
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle',
        warning: 'exclamation-triangle'
    };
    
    notification.innerHTML = `
        <i class="fas fa-${icons[type]}"></i>
        <span>${message}</span>
        <button class="close-notification">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // إضافة الأنماط
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 1rem;
            z-index: 3000;
            animation: slideDown 0.3s ease;
            max-width: 500px;
            width: 90%;
            border-right: 4px solid;
        }
        
        .notification-success {
            border-color: #10b981;
            color: #065f46;
        }
        
        .notification-error {
            border-color: #ef4444;
            color: #7f1d1d;
        }
        
        .notification-info {
            border-color: #3b82f6;
            color: #1e3a8a;
        }
        
        .notification-warning {
            border-color: #f59e0b;
            color: #92400e;
        }
        
        .notification i:first-child {
            font-size: 1.25rem;
        }
        
        .close-notification {
            background: none;
            border: none;
            cursor: pointer;
            color: inherit;
            margin-right: auto;
            font-size: 1.25rem;
            padding: 0 0.5rem;
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
    
    // إغلاق الإشعار عند النقر على الزر X
    notification.querySelector('.close-notification').addEventListener('click', function() {
        notification.remove();
    });
    
    // إزالة الإشعار تلقائياً بعد 5 ثوانٍ
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function showCustomModal(content) {
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalContent = document.querySelector('.modal-content');
    
    if (!modalOverlay || !modalContent) return;
    
    modalContent.innerHTML = content;
    modalOverlay.classList.add('active');
}

function saveToLocalStorage(key, data) {
    let items = JSON.parse(localStorage.getItem(key)) || [];
    items.push(data);
    localStorage.setItem(key, JSON.stringify(items));
}

function updateCurrentYear() {
    const yearElements = document.querySelectorAll('[data-current-year]');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
}

function initAnimations() {
    // تأثيرات الظهور عند التمرير
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // تطبيق على العناصر
    document.querySelectorAll('.feature-card, .company-card').forEach(element => {
        observer.observe(element);
    });
}

function checkSystemStatus() {
    console.log('🔍 حالة النظام:');
    console.log('- المتصفح:', navigator.userAgent);
    console.log('- دعم localStorage:', typeof Storage !== 'undefined' ? 'نعم' : 'لا');
    console.log('- الاتصال بالإنترنت:', navigator.onLine ? 'متصل' : 'غير متصل');
    
    if (!navigator.onLine) {
        showNotification('أنت غير متصل بالإنترنت. بعض الميزات قد لا تعمل.', 'warning');
    }
}

// ========== GLOBAL FUNCTIONS ==========
window.showRegisterModal = showRegisterModal;
window.closeModal = closeModal;
window.viewCompanyDetails = viewCompanyDetails;
window.applyToCompany = applyToCompany;
window.filterCompanies = filterCompanies;
window.performSearch = performSearch;
