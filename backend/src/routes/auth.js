const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Customer } = require('../models');

// ---- Admin login ----
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !user.isActive) return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });
    const token = jwt.sign({ id: user.id, role: user.role, type: 'admin' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ---- Customer register ----
router.post('/customer/register', async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    const exists = await Customer.findOne({ where: { phone } });
    if (exists) return res.status(400).json({ message: 'رقم الهاتف مسجل مسبقًا' });
    const hashed = await bcrypt.hash(password, 10);
    const customer = await Customer.create({ name, phone, email, password: hashed });
    const token = jwt.sign({ id: customer.id, type: 'customer' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.json({ token, customer: { id: customer.id, name: customer.name, phone: customer.phone } });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ---- Customer login ----
router.post('/customer/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const customer = await Customer.findOne({ where: { phone } });
    if (!customer || customer.isBlocked) return res.status(401).json({ message: 'بيانات الدخول غير صحيحة أو الحساب محظور' });
    const ok = await bcrypt.compare(password, customer.password);
    if (!ok) return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });
    const token = jwt.sign({ id: customer.id, type: 'customer' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.json({ token, customer: { id: customer.id, name: customer.name, phone: customer.phone } });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ---- Guest checkout token (no account) ----
router.post('/customer/guest', async (req, res) => {
  const token = jwt.sign({ type: 'guest' }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
});

module.exports = router;
