require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const sequelize = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/banners', require('./routes/banners'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/delivery', require('./routes/delivery'));

app.get('/', (req, res) => res.json({ status: 'ok', message: 'Food Store API is running' }));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  // مسار لتحديث موقع مندوب التوصيل لحظيًا وبثه لتطبيق الزبون
  socket.on('delivery:location', (data) => {
    io.emit(`order:${data.orderId}:location`, data);
  });
  socket.on('order:status', (data) => {
    io.emit(`order:${data.orderId}:status`, data);
  });
});

const PORT = process.env.PORT || 4000;

sequelize.sync({ alter: true }).then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((e) => console.error('DB connection error:', e.message));
