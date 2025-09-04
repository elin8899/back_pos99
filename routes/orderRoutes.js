const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orderController')
const { authMiddleware } = require('../middlewares/auth')

router.post('/', authMiddleware, orderController.order_add)
router.get('/', authMiddleware, orderController.order_list)
router.get('/my', authMiddleware, orderController.orders_by_customer)
router.get('/by-range', authMiddleware, orderController.orders_by_date_range)
router.get('/:id', authMiddleware, orderController.order_detail)



module.exports = router
