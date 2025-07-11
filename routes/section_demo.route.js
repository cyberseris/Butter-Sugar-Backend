
// routes/section.route.js
const express = require('express')
const sectionDemoController = require('../controllers/sectionDemo.controller')
const isAuth = require('../middleware/isAuth.middleware')
const isTeacher = require('../middleware/isTeacher.middleware')
const handleMiddleware = require('../utils/handleMiddleware')
const validateSchema = require('../middleware/validateSchema.middleware')
const { createSectionSchema, updateSectionSchema } = require('../schema/section.schema')

const router = express.Router()

// 取得某課程的所有章節
router.get('/section/course/:courseId', sectionDemoController.getSectionsByCourseId)

// 取得某課程的所有章節
router.get('/course/:courseId', sectionDemoController.getSectionsByCourseId)

module.exports = router