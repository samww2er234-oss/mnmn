const router = require('express').Router();
const { DeliveryPerson, Order } = require('../models');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/', verifyToken, async (req, res) => {
  const people = await DeliveryPerson.findAll();
  res.json(people);
});

router.post('/', verifyToken, requireRole('super_admin'), async (req, res) => {
  const person = await DeliveryPerson.create(req.body);
  res.status(201).json(person);
});

router.put('/:id/location', verifyToken, async (req, res) => {
  const { lat, lng } = req.body;
  const person = await DeliveryPerson.findByPk(req.params.id);
  await person.update({ currentLat: lat, currentLng: lng });
  res.json(person);
});

router.put('/:id/status', verifyToken, async (req, res) => {
  const person = await DeliveryPerson.findByPk(req.params.id);
  await person.update({ status: req.body.status });
  res.json(person);
});

module.exports = router;
