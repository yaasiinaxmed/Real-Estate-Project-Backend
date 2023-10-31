import mongoose from 'mongoose'

const requestSchema = new mongoose.Schema({
    property: {
        type: mongoose.Types.ObjectId,
        ref: "Property"
    },
    sender: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    isApproved: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const requestModel = mongoose.model("Request", requestSchema)

export default requestModel