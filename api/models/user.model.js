import mongoose from 'mongoose'
mongoose.options.strictPopulate = false;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
}, {timestamps: true})

const userModel = mongoose.model("User", userSchema)

export default userModel