const router = require('express').Router();
const { Coupon } = require('../models');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/', verifyToken, async (req, res) => {
  const coupons = await Coupon.findAll({ order: [['createdAt', 'DESC']] });
  res.json(coupons);
});

router.post('/validate', async (req, res) => {
  const coupon = await require('../models').Coupon.findOne({ where: { code: req.body.code, isActive: true } });
  if (!coupon) return res.status(404).json({ message: 'كود الخصم غير صالح' });
  res.json(coupon);
});

router.post('/', verifyToken, requireRole('super_admin', 'sales_manager'), async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json(coupon);
});

router.put('/:id', verifyToken, requireRole('super_admin', 'sales_manager'), async (req, res) => {
  const coupon = await Coupon.findByPk(req.params.id);
  await coupon.update(req.body);
  res.json(coupon);
});

router.delete('/:id', verifyToken, requireRole('super_admin'), async (req, res) => {
  await Coupon.destroy({ where: { id: req.params.id } });
  res.json({ message: 'تم الحذف' });
});

module.exports = router;
