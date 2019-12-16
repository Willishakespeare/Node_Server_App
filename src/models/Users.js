const mongoose = require('mongoose')
const {
    Schema
} = mongoose

const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    iduser: {
        type: String,
        required: true
    },
    level: {
        type: String,
        default: "user"
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    const hash = bcrypt.hash(password, salt)
    return hash
}

UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('Users', UserSchema, 'Users')