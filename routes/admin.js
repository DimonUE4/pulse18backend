// routes/admin.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getAdminDashboard } = require('../controllers/adminController');

router.get('/dashboard', auth, getAdminDashboard);

module.exports = router;
