// سكربت لإنشاء أول حساب مدير عام
// شغّله مرة واحدة بعد رفع السيرفر: node src/utils/createAdmin.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');
const { User } = require('../models');

async function run() {
  await sequelize.sync();
  const email = process.argv[2] || 'admin@store.com';
  const password = process.argv[3] || 'Admin@12345';
  const existing = await User.findOne({ where: { email } });
  if (existing) { console.log('الحساب موجود مسبقًا'); process.exit(0); }
  const hashed = await bcrypt.hash(password, 10);
  await User.create({ name: 'Super Admin', email, password: hashed, role: 'super_admin' });
  console.log('تم إنشاء حساب المدير:');
  console.log('Email:', email);
  console.log('Password:', password);
  process.exit(0);
}
run();
