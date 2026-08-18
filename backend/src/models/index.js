const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

// ==== User (Admin/Staff) ====
const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  password: DataTypes.STRING,
  role: { type: DataTypes.ENUM('super_admin','sales_manager','inventory_staff','delivery_staff','accountant','support'), defaultValue: 'support' },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
});

// ==== Customer ====
const Customer = sequelize.define('Customer', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: DataTypes.STRING,
  phone: { type: DataTypes.STRING, unique: true },
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  isBlocked: { type: DataTypes.BOOLEAN, defaultValue: false },
  loyaltyPoints: { type: DataTypes.INTEGER, defaultValue: 0 },
  referralCode: DataTypes.STRING,
});

// ==== Address ====
const Address = sequelize.define('Address', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  label: DataTypes.STRING,
  fullAddress: DataTypes.STRING,
  lat: DataTypes.FLOAT,
  lng: DataTypes.FLOAT,
});

// ==== Category ====
const Category = sequelize.define('Category', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  nameAr: DataTypes.STRING,
  nameEn: DataTypes.STRING,
  icon: DataTypes.STRING,
  parentId: { type: DataTypes.UUID, allowNull: true },
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
});

// ==== Supplier ====
const Supplier = sequelize.define('Supplier', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: DataTypes.STRING,
  phone: DataTypes.STRING,
  notes: DataTypes.TEXT,
});

// ==== Product ====
const Product = sequelize.define('Product', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  nameAr: DataTypes.STRING,
  nameEn: DataTypes.STRING,
  descriptionAr: DataTypes.TEXT,
  descriptionEn: DataTypes.TEXT,
  images: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  price: DataTypes.FLOAT,
  discountPrice: DataTypes.FLOAT,
  unit: DataTypes.STRING,
  stockQty: { type: DataTypes.INTEGER, defaultValue: 0 },
  reorderLevel: { type: DataTypes.INTEGER, defaultValue: 5 },
  productionDate: DataTypes.DATEONLY,
  expiryDate: DataTypes.DATEONLY,
  calories: DataTypes.FLOAT,
  protein: DataTypes.FLOAT,
  fat: DataTypes.FLOAT,
  carbs: DataTypes.FLOAT,
  allergens: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  countryOfOrigin: DataTypes.STRING,
  brand: DataTypes.STRING,
  variants: { type: DataTypes.JSONB, defaultValue: [] },
  status: { type: DataTypes.ENUM('available','unavailable','coming_soon'), defaultValue: 'available' },
  tags: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  rating: { type: DataTypes.FLOAT, defaultValue: 0 },
});

// ==== Coupon ====
const Coupon = sequelize.define('Coupon', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  code: { type: DataTypes.STRING, unique: true },
  type: { type: DataTypes.ENUM('percentage','fixed'), defaultValue: 'percentage' },
  value: DataTypes.FLOAT,
  minOrderAmount: { type: DataTypes.FLOAT, defaultValue: 0 },
  maxUses: DataTypes.INTEGER,
  usedCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  expiryDate: DataTypes.DATE,
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
});

// ==== Banner ====
const Banner = sequelize.define('Banner', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  image: DataTypes.STRING,
  linkType: DataTypes.STRING,
  linkValue: DataTypes.STRING,
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
});

// ==== Order ====
const Order = sequelize.define('Order', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  orderNumber: { type: DataTypes.STRING, unique: true },
  status: { type: DataTypes.ENUM('pending','confirmed','preparing','out_for_delivery','delivered','cancelled','returned'), defaultValue: 'pending' },
  subtotal: DataTypes.FLOAT,
  deliveryFee: DataTypes.FLOAT,
  discount: DataTypes.FLOAT,
  total: DataTypes.FLOAT,
  paymentMethod: { type: DataTypes.ENUM('cash','card','wallet'), defaultValue: 'cash' },
  paymentStatus: { type: DataTypes.ENUM('unpaid','paid','refunded'), defaultValue: 'unpaid' },
  deliverySlot: DataTypes.STRING,
  customerNotes: DataTypes.TEXT,
  customerName: DataTypes.STRING,
  customerPhone: DataTypes.STRING,
  deliveryAddressSnapshot: DataTypes.JSONB,
});

const OrderItem = sequelize.define('OrderItem', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  productNameSnapshot: DataTypes.STRING,
  variant: DataTypes.JSONB,
  price: DataTypes.FLOAT,
  quantity: DataTypes.INTEGER,
});

// ==== Delivery Person ====
const DeliveryPerson = sequelize.define('DeliveryPerson', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: DataTypes.STRING,
  phone: DataTypes.STRING,
  status: { type: DataTypes.ENUM('available','busy','offline'), defaultValue: 'offline' },
  currentLat: DataTypes.FLOAT,
  currentLng: DataTypes.FLOAT,
});

// ==== Review ====
const Review = sequelize.define('Review', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  rating: DataTypes.INTEGER,
  comment: DataTypes.TEXT,
  images: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  isApproved: { type: DataTypes.BOOLEAN, defaultValue: false },
});

// ==== Delivery Zone ====
const DeliveryZone = sequelize.define('DeliveryZone', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: DataTypes.STRING,
  fee: DataTypes.FLOAT,
  estimatedMinutes: DataTypes.INTEGER,
});

// ==== Setting (اسم المتجر) ====
const Setting = sequelize.define('Setting', {
  id: { type: DataTypes.INTEGER, primaryKey: true, defaultValue: 1 },
  storeName: { type: DataTypes.STRING, defaultValue: 'متجرنا' },
  logo: DataTypes.STRING,
  currency: { type: DataTypes.STRING, defaultValue: 'د.ع' },
});

// ================= Associations =================
Category.hasMany(Category, { as: 'children', foreignKey: 'parentId' });
Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });
Product.belongsTo(Supplier, { foreignKey: 'supplierId' });

Customer.hasMany(Address, { foreignKey: 'customerId' });
Address.belongsTo(Customer, { foreignKey: 'customerId' });

Customer.hasMany(Order, { foreignKey: 'customerId' });
Order.belongsTo(Customer, { foreignKey: 'customerId' });
Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });
Order.belongsTo(DeliveryPerson, { foreignKey: 'deliveryPersonId' });
Order.belongsTo(Coupon, { foreignKey: 'couponId' });

Product.hasMany(Review, { foreignKey: 'productId' });
Review.belongsTo(Product, { foreignKey: 'productId' });
Review.belongsTo(Customer, { foreignKey: 'customerId' });

module.exports = {
  sequelize, User, Customer, Address, Category, Supplier, Product,
  Coupon, Banner, Order, OrderItem, DeliveryPerson, Review, DeliveryZone, Setting,
};
