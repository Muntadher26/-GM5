#!/bin/bash
# سكريبت لإنشاء ملف .nojekyll لمشروع GitHub Pages
# تشغيل: ./nojekyll.sh

echo "🎯 إنشاء ملف .nojekyll..."

# التحقق من وجود الملف
if [ -f .nojekyll ]; then
    echo "✅ ملف .nojekyll موجود بالفعل"
else
    # إنشاء الملف
    touch .nojekyll
    echo "✅ تم إنشاء ملف .nojekyll بنجاح"
    
    # إضافة الملف إلى git
    git add .nojekyll
    echo "✅ تمت إضافة .nojekyll إلى git"
fi

echo ""
echo "📝 معلومات مهمة:"
echo "1. ملف .nojekyll يمنع GitHub Pages من معالجة الموقع باستخدام Jekyll"
echo "2. هذا ضروري للمواقع الثابتة التي لا تستخدم Jekyll"
echo "3. تأكد من رفع الملف إلى GitHub: git commit -m 'Add .nojekyll' && git push"
