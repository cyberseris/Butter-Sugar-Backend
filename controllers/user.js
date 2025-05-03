const { dataSource } = require('../db/data-source')
const appError = require('../utils/appError')
const { generateJWT, verifyJWT } = require('../utils/jwtUtils')

const userController = {
    // 取得 google 基本資料
    async getGoogleProfile (req, res, next) {
        if(!req.user.emails[0].verified){
            next(appError(401, "登入失敗，使用者電子郵件未經驗證"))
            return
        }
    
        const userRepo = dataSource.getRepository('User')
        const findUser = await userRepo.findOne({
            select: ['id', 'name', 'nickname', 'role', 'email', 'login_count', 'profile_image_url'],
            where: {
                google_id: req.user.id
            } 
        })
    
        if(!findUser){
            const newUser = userRepo.create({
                google_id: req.user.id, name: `${req.user.name.familyName}${req.user.name.givenName}`, nickname: req.user.displayName, role: 'student', email: req.user.emails[0].value, is_verified: true, login_count: 1, profile_image_url: req.user.photos[0].value, google_token: req.user.accessToken, last_login: new Date()
            })
    
            // result {id:'xxx',...用戶資料}
            const result = await userRepo.save(newUser)
    
            const findUser = await userRepo.findOne({
                select: ['id', 'role'],
                where: {
                    google_id: req.user.id
                } 
            })
    
            const token = generateJWT({
                id: findUser.id,
                role: 'student'
            })
    
            res.status(201).json({
                status: 'success',
                message: '登入成功',
                accessToken: token, 
                data: {
                    name: `${req.user.name.familyName}${req.user.name.givenName}`,
                    displayName: req.user.displayName,
                    email: req.user.emails[0].value,
                    photos: req.user.photos[0].value,
                    verified: true 
                }
            })
            return
        }else{
            const token = generateJWT({
                id: findUser.id,
                role: findUser.role
            })
    
            const updateUser = await userRepo.update(
                { id: findUser.id },
                { google_token: req.user.accessToken, login_count:  findUser.login_count+1, last_login: new Date()}
            )
    
            if(updateUser.affected === 0){
                next(appError(400, "登入失敗，請重新登入"))
                return
            }else{
                res.status(201).json({
                    status: 'success',
                    message: '登入成功',
                    accessToken: token, 
                    data: {
                        name: findUser.name,
                        displayName: findUser.nickname,
                        email: findUser.email,
                        photos: findUser.profile_image_url,
                        verified: true 
                    }
                }) 
                return
            }
        } 
    },

    // 驗證使用者是否登入
    async getCheck (req, res, next) {
        const authHeader = req.headers.authorization
        if(!authHeader || !authHeader.startsWith('Bearer')){
            //401: 請先登入!
            next(appError(401, "驗證錯誤，token 無效或是不存在"))
            return
        }

        // 取出 token
        const token = authHeader.split(' ')[1]
        //驗證 token
        const decoded = await verifyJWT(token)

        if(!decoded){
            if(!authHeader || !authHeader.startsWith('Bearer')){
                //401: 請先登入!
                next(appError(401, "驗證錯誤，token 無效或是不存在"))
                return
            }            
        }

        // 尋找對應 id 的使用者
        const currentUser = await dataSource.getRepository('User').findOne({
            select: ['id'],
            where: {
                id: decoded.id
            }
        })

        if(!currentUser){
            next(appError(401, "驗證錯誤，token 無效或是不存在"))
            return
        }

        res.status(200).json({
            status: true,
            message: "驗證成功"
        })
    
        return
    }
}

module.exports = userController;