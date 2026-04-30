const { Router } = require('express');
const { createOrder, captureOrder } = require('../../controllers/paypal.controller.js');

const router = Router();

router.post('/paypal/create-order', createOrder);
router.post('/paypal/capture-order', captureOrder);

module.exports = router;