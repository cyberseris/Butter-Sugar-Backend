const isValidString = (value) => {
    return typeof value === 'string' && value.trim() !== ''
}

const isNumber = (value) => {
    return typeof value === 'number' && !isNaN(value)
}

const isValidPassword = (value) => {
    const passwordPattern =  /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}/
    return  passwordPattern.test(value)
}

const isValidBirthday = (value) => {
    const birthdayPattern = /^\d{4}-\d{2}-\d{2}$/
    return birthdayPattern.test(value)
}

const isValidSex = (value) => {
    const validSexValues = ['male', 'female', 'other']
    return validSexValues.includes(value.toLowerCase())
}

const isValidUrl = (value) => {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i
    return urlPattern.test(value)
}

module.exports = {
    isValidString,
    isNumber,
    isValidPassword,
    isValidBirthday,
    isValidSex,
    isValidUrl
}