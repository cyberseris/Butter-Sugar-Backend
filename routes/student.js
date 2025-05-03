const express = require('express')
const router = express.Router()
const isAuth = require('../middlewares/isAuth')
const studentController = require('../controllers/student')
const handleErrorAsync = require('../utils/handleErrorAsync')

// 取得學生資料
router.get("/", isAuth, handleErrorAsync(studentController.getProfile)) 

// 更新學生資料
router.patch("/", isAuth, handleErrorAsync(studentController.patchProfile)) 

module.exports = router;