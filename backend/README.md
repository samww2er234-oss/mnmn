# سيرفر متجر المواد الغذائية — دليل الرفع للسيرفر (خطوة بخطوة)

هذا هو الملف الذي "ترفعه للسيرفر" حتى يعطيك رابط (Link) تحطه داخل تطبيقي الأدمن والزبون.

## الطريقة الأسهل والمجانية: Render.com

1. أنشئ حساب مجاني على https://render.com
2. من نفس الحساب أنشئ قاعدة بيانات: New + → PostgreSQL → اختر الخطة المجانية → بعد الإنشاء انسخ قيمة "Internal Database URL" أو "External Database URL".
3. ارفع مجلد `backend` هذا كـ Repository على GitHub (أو استخدم خيار "Upload" مباشرة في Render إذا توفر).
4. من Render: New + → Web Service → اختر الـ repo.
   - Build Command: `npm install`
   - Start Command: `npm start`
   - أضف Environment Variables التالية (من تبويب Environment):
     - `DATABASE_URL` = الرابط اللي نسخته من الخطوة 2
     - `JWT_SECRET` = أي نص عشوائي طويل تختاره أنت
     - `JWT_EXPIRES_IN` = `7d`
     - `NODE_ENV` = `production`
5. اضغط Deploy. بعد انتهاء البناء، Render يعطيك رابط شكله:
   `https://your-app-name.onrender.com`
6. **هذا هو الرابط** اللي تحطه في ملفي التطبيقين (admin_app و customer_app) داخل:
   `lib/config/api_config.dart` → غيّر قيمة `baseUrl`.

## إنشاء أول حساب مدير (Admin) بعد الرفع
افتح "Shell" الخاص بالـ Web Service من داخل Render، ونفذ:
```
node src/utils/createAdmin.js admin@store.com Admin@12345
```
هذا يطبع لك إيميل وباسورد أول حساب مدير عام تسجل فيه دخول من تطبيق الأدمن.

## بديل آخر: Railway.app
نفس الخطوات تقريبًا (إنشاء PostgreSQL + Web Service من نفس المجلد + متغيرات البيئة نفسها) — يعطيك رابط بنفس الشكل.

## تشغيل محلي للتجربة (اختياري)
```
cp .env.example .env
# عدّل DATABASE_URL بقاعدة بيانات Postgres محلية عندك
npm install
npm run dev
```

## ملاحظات مهمة
- كل الـ API متاحة تحت `/api/...` مثال: `https://your-app-name.onrender.com/api/products`
- الدفع الإلكتروني (بطاقات) والخرائط اللحظية والإشعارات الفورية تحتاج مفاتيح API خاصة بك (Stripe/PayTabs, Google Maps, Firebase) — الكود جاهز لاستقبالها لاحقًا لكنه غير مفعل افتراضيًا لأنها تتطلب حسابات خاصة بك.
