const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { authMiddleware } = require('../middlewares/auth')

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/profile', authMiddleware, userController.profile)
router.post('/set-password', userController.setPassword)
router.post('/check-password', userController.checkPasswordStatus)


module.exports = router
