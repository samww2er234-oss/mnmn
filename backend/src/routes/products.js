const router = require('express').Router();
const { Product, Category, Review } = require('../models');
const { Op } = require('sequelize');
const { verifyToken, requireRole } = require('../middleware/auth');

// Public: list products with filters (used by customer app)
router.get('/', async (req, res) => {
  try {
    const { categoryId, minPrice, maxPrice, sort, search, tag } = req.query;
    const where = { status: 'available' };
    if (categoryId) where.categoryId = categoryId;
    if (minPrice || maxPrice) where.price = { ...(minPrice && { [Op.gte]: minPrice }), ...(maxPrice && { [Op.lte]: maxPrice }) };
    if (search) where.nameAr = { [Op.iLike]: `%${search}%` };
    if (tag) where.tags = { [Op.contains]: [tag] };

    let order = [['createdAt', 'DESC']];
    if (sort === 'price_asc') order = [['price', 'ASC']];
    if (sort === 'price_desc') order = [['price', 'DESC']];
    if (sort === 'rating') order = [['rating', 'DESC']];

    const products = await Product.findAll({ where, order, include: [Category] });
    res.json(products);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [Category, { model: Review, where: { isApproved: true }, required: false }],
    });
    if (!product) return res.status(404).json({ message: 'المنتج غير موجود' });
    res.json(product);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Admin only: create/update/delete
router.post('/', verifyToken, requireRole('super_admin', 'inventory_staff'), async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/:id', verifyToken, requireRole('super_admin', 'inventory_staff'), async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'المنتج غير موجود' });
    await product.update(req.body);
    res.json(product);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.delete('/:id', verifyToken, requireRole('super_admin', 'inventory_staff'), async (req, res) => {
  try {
    await Product.destroy({ where: { id: req.params.id } });
    res.json({ message: 'تم الحذف' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Low stock report (admin dashboard)
router.get('/reports/low-stock', verifyToken, async (req, res) => {
  const products = await Product.findAll({ where: { stockQty: { [Op.lte]: require('sequelize').col('reorderLevel') } } });
  res.json(products);
});

module.exports = router;
