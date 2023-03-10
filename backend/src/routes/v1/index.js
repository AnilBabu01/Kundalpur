const express = require('express');
const adminRoutes = require('./admin.routes')
const userRoutes = require('./user.routes')
const payment = require('./Payment.routes');

const router = express.Router();

router.use('/admin', adminRoutes);
router.use('/user', userRoutes);
router.use('/payment', payment)


module.exports = router;
