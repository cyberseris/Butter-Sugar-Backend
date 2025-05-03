const express = require('express')
const session = require('express-session')
const cors = require('cors')
const path = require('path')
const pinoHttp = require('pino-http')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const logger = require('./utils/logger')('App')
const userRouter = require('./routes/user')
const studentRouter = require('./routes/student')

require('dotenv').config()
const app = express()

console.log("process.env.Google_CLIENT_ID", process.env.Google_CLIENT_ID)

// Passport 設定
passport.use(new GoogleStrategy(
  {
    clientId: process.env.Google_CLIENT_ID,
    clientSecret: process.env.Google_CLIENT_SECRET,
    callbackURL: 'http://localhost:8080/api/v1/users/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    // 儲存 accessToken 到 profile 中
    profile.accessToken = accessToken
    // 儲存資料後，傳遞給下一步
    return done(null, profile)
  }
));

console.log("process.env.Google_CLIENT_ID", process.env.Google_CLIENT_ID)

//當使用者成功登入時, serializeUser 會儲存使用者資訊到 session
passport.serializeUser((user, done) => done(null, user))
//deserializeUser 會從 session 取出使用者資訊, 並附加在 req.user
passport.deserializeUser((obj, done) => done(null, obj))

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(pinoHttp({
  logger,
  serializers: {
    req (req) {
      req.body = req.raw.body
      return req
    }
  }
}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/api/v1/users', userRouter)
app.use('/api/v1/student', studentRouter)

//404
app.use((req, res, next) => {
  res.status(404).json({
    status: false,
    message: "無此路由"
  })
  return
})

// 前面的錯誤都沒捕捉到時，顯示 500
app.use((err, req, res, next) => {
  req.log.error(err)
  const statusCode = err.status || 500
  res.status(statusCode).json({
    status: false,
    messgae: err.message || '伺服器錯誤'
  })
})

module.exports = app
