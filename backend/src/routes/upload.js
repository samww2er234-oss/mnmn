const router = require('express').Router();
const upload = require('../middleware/upload');
const { verifyToken, requireRole } = require('../middleware/auth');

router.post('/', verifyToken, requireRole('super_admin', 'inventory_staff', 'sales_manager'), upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'لم يتم إرسال أي صورة' });
  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ url });
});

module.exports = router;
