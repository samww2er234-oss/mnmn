const router = require('express').Router();
const { Banner } = require('../models');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/', async (req, res) => {
  const banners = await Banner.findAll({ where: { isActive: true }, order: [['sortOrder', 'ASC']] });
  res.json(banners);
});

router.post('/', verifyToken, requireRole('super_admin', 'sales_manager'), async (req, res) => {
  const banner = await Banner.create(req.body);
  res.status(201).json(banner);
});

router.delete('/:id', verifyToken, requireRole('super_admin', 'sales_manager'), async (req, res) => {
  await Banner.destroy({ where: { id: req.params.id } });
  res.json({ message: 'تم الحذف' });
});

module.exports = router;
