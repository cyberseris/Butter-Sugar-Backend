const { dataSource } = require('../db/data-source')
const appError = require('../utils/appError')
const { isValidString, isValidBirthday, isValidSex, isValidUrl } = require('../utils/validUtils')

const studentController = {
    //取得學生資料
    async getProfile (req, res, next) {
        const findUser = await dataSource.getRepository('User').findOne({
            select: ['id', 'name', 'nickname', 'email', 'phone', 'birthday', 'sex', 'address', 'profile_image_url'],
            where: {
                id: req.user.id
            }
        })

        res.status(200).json({
            status: true,
            message : "成功取得資料",
            data: {
            name: findUser.name,
            nickname: findUser.nickName,
            email: findUser.email,
            phone: findUser?.phone,
            birthday: findUser?.birthday,
            sex: findUser?.sex,
            address: findUser?.address,
            profile_image_url: findUser?.profile_image_url
            }
        })
        return
    },
    
    //更新學生資料
    async patchProfile (req, res, next) {
        const { name,  nickname, phone, birthday, sex, address, profile_image_url} = req.body

        if(!isValidString(name)||!isValidString(nickname)||!isValidString(phone)||!isValidBirthday(birthday)||!isValidSex(sex)||!isValidString(address)||!isValidUrl(profile_image_url)){
            next(appError(400, "欄位未填寫正確"))  
            return
        }
        
        const userRepo = dataSource.getRepository('User')
        const updateUser = await userRepo.update(
            { id: req.user.id },
            {   name: name,  
                nickname: nickname, 
                phone: phone, 
                birthday: birthday, 
                sex: sex, 
                address: address, 
                profile_image_url: profile_image_url
            }
        )
    
        if(updateUser.affected === 0) {
            next(appError(400, "更新失敗"))
            return
        }
    
        res.status(200).json({
            status: true,
            message : "更新成功"
        })
        return 
    }
}


module.exports = studentController;