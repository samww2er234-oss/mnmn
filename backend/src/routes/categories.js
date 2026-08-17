const router = require('express').Router();
const { Category } = require('../models');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/', async (req, res) => {
  const categories = await Category.findAll({ order: [['sortOrder', 'ASC']] });
  res.json(categories);
});

router.post('/', verifyToken, requireRole('super_admin', 'sales_manager'), async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json(category);
});

router.put('/:id', verifyToken, requireRole('super_admin', 'sales_manager'), async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) return res.status(404).json({ message: 'غير موجود' });
  await category.update(req.body);
  res.json(category);
});

router.delete('/:id', verifyToken, requireRole('super_admin'), async (req, res) => {
  await Category.destroy({ where: { id: req.params.id } });
  res.json({ message: 'تم الحذف' });
});

module.exports = router;
