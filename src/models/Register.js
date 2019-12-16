const mongoose = require('mongoose')
const {
    Schema
} = mongoose



const NoteSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: () => {
            return new Date()
        }
    }
})


module.exports = mongoose.model('Register', NoteSchema, 'AllRegister')