const router = require('express').Router();
const { Customer, Address } = require('../models');
const { verifyToken, requireRole } = require('../middleware/auth');

// Customer: my profile
router.get('/me', verifyToken, async (req, res) => {
  const customer = await Customer.findByPk(req.user.id, { include: [Address] });
  res.json(customer);
});

router.put('/me', verifyToken, async (req, res) => {
  const customer = await Customer.findByPk(req.user.id);
  await customer.update(req.body);
  res.json(customer);
});

router.post('/me/addresses', verifyToken, async (req, res) => {
  const address = await Address.create({ ...req.body, customerId: req.user.id });
  res.status(201).json(address);
});

// Admin: list all customers
router.get('/', verifyToken, requireRole('super_admin', 'sales_manager', 'support'), async (req, res) => {
  const customers = await Customer.findAll({ order: [['createdAt', 'DESC']] });
  res.json(customers);
});

router.put('/:id/block', verifyToken, requireRole('super_admin', 'support'), async (req, res) => {
  const customer = await Customer.findByPk(req.params.id);
  await customer.update({ isBlocked: req.body.isBlocked });
  res.json(customer);
});

module.exports = router;
