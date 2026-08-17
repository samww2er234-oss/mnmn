const router = require('express').Router();
const { Order, OrderItem, Product, Customer, Coupon, DeliveryPerson } = require('../models');
const { verifyToken, requireRole } = require('../middleware/auth');

function genOrderNumber() {
  return 'ORD-' + Date.now().toString().slice(-8);
}

// Customer: create order (checkout)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod, couponCode, deliverySlot, customerNotes, deliveryFee } = req.body;
    let subtotal = 0;
    const orderItemsData = [];
    for (const it of items) {
      const product = await Product.findByPk(it.productId);
      if (!product) continue;
      const price = product.discountPrice || product.price;
      subtotal += price * it.quantity;
      orderItemsData.push({ productId: product.id, productNameSnapshot: product.nameAr, variant: it.variant || null, price, quantity: it.quantity });
    }

    let discount = 0;
    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({ where: { code: couponCode, isActive: true } });
      if (coupon && subtotal >= coupon.minOrderAmount) {
        discount = coupon.type === 'percentage' ? (subtotal * coupon.value / 100) : coupon.value;
      }
    }

    const total = subtotal + (deliveryFee || 0) - discount;

    const order = await Order.create({
      orderNumber: genOrderNumber(),
      customerId: req.user.type === 'customer' ? req.user.id : null,
      subtotal, deliveryFee: deliveryFee || 0, discount, total,
      paymentMethod, deliverySlot, customerNotes,
      deliveryAddressSnapshot: deliveryAddress,
      couponId: coupon ? coupon.id : null,
    });

    for (const item of orderItemsData) {
      await OrderItem.create({ ...item, orderId: order.id });
    }

    if (coupon) await coupon.update({ usedCount: coupon.usedCount + 1 });

    res.status(201).json(order);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Customer: my orders
router.get('/mine', verifyToken, async (req, res) => {
  const orders = await Order.findAll({ where: { customerId: req.user.id }, include: [OrderItem], order: [['createdAt', 'DESC']] });
  res.json(orders);
});

// Track single order (customer or admin)
router.get('/:id', verifyToken, async (req, res) => {
  const order = await Order.findByPk(req.params.id, { include: [OrderItem, DeliveryPerson, Customer] });
  if (!order) return res.status(404).json({ message: 'الطلب غير موجود' });
  res.json(order);
});

// ---- Admin: list all orders with filters ----
router.get('/', verifyToken, requireRole('super_admin', 'sales_manager', 'accountant', 'support'), async (req, res) => {
  const { status, from, to } = req.query;
  const where = {};
  if (status) where.status = status;
  const orders = await Order.findAll({ where, include: [OrderItem, Customer, DeliveryPerson], order: [['createdAt', 'DESC']] });
  res.json(orders);
});

// Admin: update order status / assign delivery
router.put('/:id', verifyToken, requireRole('super_admin', 'sales_manager', 'delivery_staff'), async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).json({ message: 'الطلب غير موجود' });
  await order.update(req.body);
  res.json(order);
});

module.exports = router;
