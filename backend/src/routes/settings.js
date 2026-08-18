const router = require('express').Router();
const { Setting } = require('../models');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/', async (req, res) => {
  let settings = await Setting.findByPk(1);
  if (!settings) settings = await Setting.create({ id: 1 });
  res.json(settings);
});

router.put('/', verifyToken, requireRole('super_admin'), async (req, res) => {
  let settings = await Setting.findByPk(1);
  if (!settings) settings = await Setting.create({ id: 1 });
  await settings.update(req.body);
  res.json(settings);
});

module.exports = router;
