const express = require('express');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const { Server } = require('socket.io');
const allowedOrigin = 'https://whateverittakesteam.ru';
require('dotenv').config();

const connectDB = require('./config/db');
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://whateverittakesteam.ru', // Твой frontend
    credentials: true
  }
});

// 🔧 Middleware
app.use(cors({
  origin: 'https://whateverittakesteam.ru',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// 🔧 Static файлы
app.use(express.static(path.join(__dirname, '../pulse18-frontend')));
app.use(express.static(path.join(__dirname, '../pulse18-frontend/pages')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🔧 API маршруты
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/feed', require('./routes/feed'));
const subscriptionRoutes = require('./routes/subscriptions');
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/users', require('./routes/users'));
app.use('/api/subscriptionPlans', require('./routes/subscriptionPlans'));
app.use('/api/chats', require('./routes/chatRoutes'));
const messageRoutes = require('./routes/Messages');
app.use('/api/messages', messageRoutes);
// 🔧 Страница профиля по username
app.get('/u/:username', (req, res) => {
  res.sendFile(path.join(__dirname, '../pulse18-frontend/pages/publicProfile.html'));
});

const tipRoutes = require('./routes/tips');
app.use('/api/tips', tipRoutes);


app.use('/api/balance', require('./routes/balance'));

const purchaseRoutes = require('./routes/purchase');
app.use('/api/purchase', purchaseRoutes); // ← именно purchase, не purchases

const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

const transactionRoutes = require('./routes/transactions');
app.use('/api/transactions', transactionRoutes);

const notificationRoutes = require('./routes/notifications');
app.use('/api/notifications', notificationRoutes);

const galleryRoutes = require('./routes/gallery');
app.use('/api', galleryRoutes);

app.use('/api/stats', require('./routes/stats'));


const renewSubscriptions = require('./services/renewSubscriptions');
setInterval(renewSubscriptions, 1000 * 60 * 60 * 24); // раз в день





// ✅ Socket.io логика
io.on('connection', socket => {
  console.log('✅ Пользователь подключился');

  // Подключение к комнате
  socket.on('joinRoom', roomId => {
    socket.join(roomId);
    console.log(`Пользователь присоединился к комнате: ${roomId}`);
  });
  

  // Отправка сообщения
  socket.on('sendMessage', ({ roomId, message }) => {
    io.to(roomId).emit('newMessage', message); // Рассылка в комнату
  });

  socket.on('disconnect', () => {
    console.log('❌ Пользователь отключился');
  });
});

const balanceRoutes = require('./routes/balanceRoutes');
app.use('/api/balance', balanceRoutes);


// 🔧 Запуск сервера
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
