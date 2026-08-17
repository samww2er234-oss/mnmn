const router = require('express').Router();
const { Review } = require('../models');
const { verifyToken, requireRole } = require('../middleware/auth');

router.post('/', verifyToken, async (req, res) => {
  const review = await Review.create({ ...req.body, customerId: req.user.id });
  res.status(201).json(review);
});

router.get('/', verifyToken, requireRole('super_admin', 'support'), async (req, res) => {
  const reviews = await Review.findAll({ order: [['createdAt', 'DESC']] });
  res.json(reviews);
});

router.put('/:id/approve', verifyToken, requireRole('super_admin', 'support'), async (req, res) => {
  const review = await Review.findByPk(req.params.id);
  await review.update({ isApproved: true });
  res.json(review);
});

router.delete('/:id', verifyToken, requireRole('super_admin', 'support'), async (req, res) => {
  await Review.destroy({ where: { id: req.params.id } });
  res.json({ message: 'تم الحذف' });
});

module.exports = router;
