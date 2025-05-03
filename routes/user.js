const express = require('express')
const router = express.Router()
const passport = require('passport');
const userController = require('../controllers/user')
const handleErrorAsync = require('../utils/handleErrorAsync')

// 當使用者點擊該按鈕時，應用會將用戶重定向到 Google 的授權頁面，並要求授權用戶的 profile 和 email 資訊。
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email']}))

// Passport 會使用收到的 code 去向 Google 請求交換用戶資料。如果成功，req.user 會包含來自 Google 的用戶資料，然後儲存用戶資料。
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/api/v1/users/profile')
})

// google 登入成功，回傳使用者資料
router.get("/profile", handleErrorAsync(userController.getGoogleProfile)) 

router.get("/check", handleErrorAsync(userController.getCheck)) 

module.exports = router;