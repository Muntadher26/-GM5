// ========== نظام التسجيل ==========
function showRegisterModal(type) {
    const modal = document.getElementById('registerModal');
    modal.style.display = 'flex';
    switchTab(type);
}

function closeModal() {
    const modal = document.getElementById('registerModal');
    modal.style.display = 'none';
}

function switchTab(type) {
    const candidateForm = document.getElementById('candidateForm');
    const companyForm = document.getElementById('companyForm');
    const tabs = document.querySelectorAll('.tab-btn');
    const modalTitle = document.getElementById('modalTitle');
    
    if (type === 'candidate') {
        candidateForm.style.display = 'flex';
        companyForm.style.display = 'none';
        modalTitle.textContent = 'انضم كباحث عن عمل';
        tabs[0].classList.add('active');
        tabs[1].classList.remove('active');
    } else {
        candidateForm.style.display = 'none';
        companyForm.style.display = 'flex';
        modalTitle.textContent = 'انضم كمسؤول توظيف';
        tabs[0].classList.remove('active');
        tabs[1].classList.add('active');
    }
}

// تسجيل المستخدم
function registerUser(type) {
    if (type === 'candidate') {
        const name = document.getElementById('candidateName').value.trim();
        const email = document.getElementById('candidateEmail').value.trim();
        const password = document.getElementById('candidatePassword').value;
        const phone = document.getElementById('candidatePhone').value.trim();
        
        if (!name || !email || !password) {
            alert('يرجى ملء جميع الحقول المطلوبة');
            return;
        }
        
        if (password.length < 6) {
            alert('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
            return;
        }
        
        const user = {
            id: Date.now(),
            name,
            email,
            phone,
            type: 'candidate',
            date: new Date().toLocaleDateString('ar-IQ'),
            verified: false
        };
        
        saveUser(user);
        alert('تم تسجيل حسابك بنجاح! يمكنك الآن تسجيل الدخول');
        closeModal();
        resetForm('candidate');
        
    } else {
        const name = document.getElementById('companyName').value.trim();
        const email = document.getElementById('companyEmail').value.trim();
        const phone = document.getElementById('companyPhone').value.trim();
        const industry = document.getElementById('companyIndustry').value;
        
        if (!name || !email || !industry) {
            alert('يرجى ملء جميع الحقول المطلوبة');
            return;
        }
        
        const company = {
            id: Date.now(),
            name,
            email,
            phone,
            industry,
            type: 'company',
            date: new Date().toLocaleDateString('ar-IQ'),
            status: 'pending',
            logo: getIndustryLogo(industry),
            rating: 0,
            jobs: 0,
            city: 'بغداد'
        };
        
        saveCompany(company);
        alert('تم إرسال طلب حساب الشركة، سنتواصل معك خلال 24 ساعة');
        closeModal();
        resetForm('company');
    }
}

function resetForm(type) {
    if (type === 'candidate') {
        document.getElementById('candidateName').value = '';
        document.getElementById('candidateEmail').value = '';
        document.getElementById('candidatePassword').value = '';
        document.getElementById('candidatePhone').value = '';
    } else {
        document.getElementById('companyName').value = '';
        document.getElementById('companyEmail').value = '';
        document.getElementById('companyPhone').value = '';
        document.getElementById('companyIndustry').value = '';
    }
}

function getIndustryLogo(industry) {
    const logos = {
        'تقنية المعلومات': 'fas fa-laptop-code',
        'المالية والمصرفية': 'fas fa-university',
        'الصحة والطب': 'fas fa-truck-medical',
        'النفط والغاز': 'fas fa-oil-well',
        'التعليم': 'fas fa-graduation-cap',
        'التجارة': 'fas fa-store',
        'الهندسة': 'fas fa-cogs',
        'القانون': 'fas fa-gavel'
    };
    return logos[industry] || 'fas fa-building';
}

// حفظ المستخدم في localStorage
function saveUser(user) {
    const users = JSON.parse(localStorage.getItem('wathafni_users')) || [];
    users.push(user);
    localStorage.setItem('wathafni_users', JSON.stringify(users));
    console.log('تم حفظ المستخدم:', user);
}

// حفظ الشركة في localStorage
function saveCompany(company) {
    const companies = JSON.parse(localStorage.getItem('wathafni_companies')) || [];
    companies.push(company);
    localStorage.setItem('wathafni_companies', JSON.stringify(companies));
    console.log('تم حفظ الشركة:', company);
}

// ========== نظام الشركات ==========

// تحميل وعرض الشركات
function loadCompanies() {
    const companies = JSON.parse(localStorage.getItem('wathafni_companies')) || [];
    const container = document.getElementById('companiesList');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (companies.length === 0) {
        container.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <i class="fas fa-building" style="font-size: 50px; color: #6b7280; margin-bottom: 20px;"></i>
                <h3 style="color: #4b5563;">لا توجد شركات مسجلة بعد</h3>
                <p style="color: #9ca3af;">كن أول من يسجل شركته!</p>
                <button class="btn btn-primary" onclick="showRegisterModal('company')">
                    <i class="fas fa-plus"></i> إضافة شركة
                </button>
            </div>
        `;
        return;
    }
    
    companies.forEach(company => {
        // إنشاء النجوم للتقييم
        const rating = company.rating || 0;
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '';
        stars += '★'.repeat(fullStars);
        if (hasHalfStar) stars += '½';
        stars += '☆'.repeat(emptyStars);
        
        // نص التقييم
        let ratingText = '';
        if (rating >= 4.5) ratingText = 'ممتاز';
        else if (rating >= 4) ratingText = 'جيد جداً';
        else if (rating >= 3) ratingText = 'جيد';
        else ratingText = 'مقبول';
        
        const card = `
            <div class="company-detail-card" data-id="${company.id}" 
                 data-industry="${company.industry}" 
                 data-rating="${rating}"
                 data-city="${company.city || 'بغداد'}">
                <div class="company-header">
                    <div class="company-logo-large">
                        <i class="${company.logo || 'fas fa-building'}"></i>
                    </div>
                    <div class="company-info">
                        <h3>${company.name}</h3>
                        <p>${company.industry}</p>
                        <div class="rating-large" title="تقييم ${rating} من 5">
                            ${stars} <span style="color: #6b7280; font-size: 16px;">${rating.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="company-stats">
                    <div class="stat">
                        <h4>${company.jobs || 0}</h4>
                        <p>وظيفة شاغرة</p>
                    </div>
                    <div class="stat">
                        <h4>${ratingText}</h4>
                        <p>التقييم العام</p>
                    </div>
                    <div class="stat">
                        <h4>${company.city || 'بغداد'}</h4>
                        <p>المقر الرئيسي</p>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="viewCompany(${company.id})" style="width: 100%;">
                    <i class="fas fa-eye"></i> عرض التفاصيل
                </button>
            </div>
        `;
        
        container.innerHTML += card;
    });
}

// البحث في الشركات
function searchCompanies() {
    const searchTerm = document.getElementById('companySearch').value.toLowerCase();
    const industryFilter = document.getElementById('industryFilter').value;
    const cityFilter = document.getElementById('cityFilter').value;
    const ratingFilter = parseFloat(document.getElementById('ratingFilter').value) || 0;
    
    const cards = document.querySelectorAll('.company-detail-card');
    let visibleCount = 0;
    
    cards.forEach(card => {
        const companyName = card.querySelector('h3').textContent.toLowerCase();
        const companyIndustry = card.dataset.industry;
        const companyCity = card.dataset.city;
        const companyRating = parseFloat(card.dataset.rating);
        
        let matches = true;
        
        if (searchTerm && !companyName.includes(searchTerm)) {
            matches = false;
        }
        
        if (industryFilter && companyIndustry !== industryFilter) {
            matches = false;
        }
        
        if (cityFilter && companyCity !== cityFilter) {
            matches = false;
        }
        
        if (ratingFilter > 0 && companyRating < ratingFilter) {
            matches = false;
        }
        
        if (matches) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    if (visibleCount === 0) {
        document.getElementById('companiesList').innerHTML += `
            <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <i class="fas fa-search" style="font-size: 50px; color: #6b7280; margin-bottom: 20px;"></i>
                <h3 style="color: #4b5563;">لم نعثر على نتائج</h3>
                <p style="color: #9ca3af;">حاول تغيير كلمات البحث أو الفلاتر</p>
                <button class="btn btn-outline" onclick="resetFilters()">
                    <i class="fas fa-redo"></i> إعادة الضبط
                </button>
            </div>
        `;
    }
}

// إعادة تعيين الفلاتر
function resetFilters() {
    document.getElementById('companySearch').value = '';
    document.getElementById('industryFilter').value = '';
    document.getElementById('cityFilter').value = '';
    document.getElementById('ratingFilter').value = '0';
    
    const cards = document.querySelectorAll('.company-detail-card');
    cards.forEach(card => {
        card.style.display = 'block';
    });
}

// عرض تفاصيل الشركة
function viewCompany(id) {
    const companies = JSON.parse(localStorage.getItem('wathafni_companies')) || [];
    const company = companies.find(c => c.id === id);
    
    if (company) {
        alert(`عرض تفاصيل الشركة: ${company.name}\n\nالمجال: ${company.industry}\nالتقييم: ${company.rating || 0}\nالوظائف: ${company.jobs || 0}\n\nهنا يمكن توجيه المستخدم لصفحة تفاصيل الشركة`);
    } else {
        alert('الشركة غير موجودة');
    }
}

// ========== إعدادات أولية ==========

// بيانات تجريبية للشركات
const sampleCompanies = [
    {
        id: 1,
        name: "تكنو سوفت العراق",
        industry: "تقنية المعلومات",
        rating: 4.5,
        jobs: 12,
        logo: "fas fa-laptop-code",
        city: "بغداد"
    },
    {
        id: 2,
        name: "بنك الرافدين",
        industry: "المالية والمصرفية",
        rating: 4.0,
        jobs: 8,
        logo: "fas fa-university",
        city: "بغداد"
    },
    {
        id: 3,
        name: "مستشفى السلام الدولي",
        industry: "الصحة والطب",
        rating: 5.0,
        jobs: 15,
        logo: "fas fa-truck-medical",
        city: "بغداد"
    },
    {
        id: 4,
        name: "شركة نفط الجنوب",
        industry: "النفط والغاز",
        rating: 5.0,
        jobs: 22,
        logo: "fas fa-oil-well",
        city: "البصرة"
    },
    {
        id: 5,
        name: "شركة زين للاتصالات",
        industry: "تقنية المعلومات",
        rating: 4.2,
        jobs: 18,
        logo: "fas fa-mobile-alt",
        city: "أربيل"
    },
    {
        id: 6,
        name: "مصنع بابل للأغذية",
        industry: "التجارة",
        rating: 3.8,
        jobs: 7,
        logo: "fas fa-store",
        city: "الموصل"
    }
];

// تهيئة localStorage ببيانات تجريبية
function initializeData() {
    if (!localStorage.getItem('wathafni_companies')) {
        localStorage.setItem('wathafni_companies', JSON.stringify(sampleCompanies));
    }
    
    if (!localStorage.getItem('wathafni_users')) {
        localStorage.setItem('wathafni_users', JSON.stringify([]));
    }
}

// ========== أحداث ==========

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

// ========== تحميل الصفحة ==========
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة البيانات
    initializeData();
    
    // تحميل الشركات إذا كانت الصفحة تحتوي على العنصر
    if (document.getElementById('companiesList')) {
        loadCompanies();
    }
    
    // جعل الروابط المعطلة غير قابلة للنقر
    document.querySelectorAll('.disabled').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            alert('هذا القسم قيد التطوير، سيتم إطلاقه قريباً!');
        });
    });
    
    console.log('✅ نظام وظفني يعمل بنجاح!');
    console.log('📊 بيانات الشركات:', JSON.parse(localStorage.getItem('wathafni_companies')));
    console.log('👥 المستخدمون المسجلون:', JSON.parse(localStorage.getItem('wathafni_users')));
});