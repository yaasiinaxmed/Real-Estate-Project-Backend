import mongoose from 'mongoose'
mongoose.options.strictPopulate = false;

const userSchema = new mongoose.Schema({
    avatar: {
        type: String,
        default: "https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg"
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true,
        enum: ["owner", "renter"]
    },
    password: {
        type: String,
        required: true,
    }
}, {timestamps: true})

const userModel = mongoose.model("User", userSchema)

export default userModel