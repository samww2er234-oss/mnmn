const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { User } = require('../models');

router.get('/create-admin', async (req, res) => {
  try {
    const email = 'admin@store.com';
    const password = 'Admin@12345';
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.send('الحساب موجود مسبقًا. Email: ' + email);
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name: 'Super Admin', email, password: hashed, role: 'super_admin' });
    res.send('تم إنشاء الحساب بنجاح! Email: ' + email + ' | Password: ' + password);
  } catch (e) {
    res.status(500).send('خطأ: ' + e.message);
  }
});

module.exports = router;
