const router = require('express').Router();
const { Order, Customer, Product } = require('../models');
const { Op, fn, col, literal } = require('sequelize');
const { verifyToken } = require('../middleware/auth');

router.get('/summary', verifyToken, async (req, res) => {
  const today = new Date(); today.setHours(0,0,0,0);
  const todayOrders = await Order.count({ where: { createdAt: { [Op.gte]: today } } });
  const todayRevenue = await Order.sum('total', { where: { createdAt: { [Op.gte]: today }, paymentStatus: 'paid' } });
  const newCustomers = await Customer.count({ where: { createdAt: { [Op.gte]: today } } });
  const lowStockCount = await Product.count({ where: { stockQty: { [Op.lte]: literal('"reorderLevel"') } } });

  res.json({
    todayOrders,
    todayRevenue: todayRevenue || 0,
    newCustomers,
    lowStockCount,
  });
});

router.get('/sales-chart', verifyToken, async (req, res) => {
  const results = await Order.findAll({
    attributes: [[fn('date_trunc', 'day', col('createdAt')), 'day'], [fn('sum', col('total')), 'total']],
    group: ['day'],
    order: [[literal('day'), 'ASC']],
    raw: true,
  });
  res.json(results);
});

module.exports = router;
