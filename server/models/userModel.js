const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    UserSchema = new Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            default: 'basic',
            enum: ["basic", "supervisor", "admin"]
        },
        accessToken: {
            type: String
        }
    }),
    User = mongoose.model('user', UserSchema)

module.exports = User;