import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    sender: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: mongoose.Types.ObjectId,
        ref: "Message",
        required: true,
    }
}, {timestamps: true})

const replyModel = mongoose.model("Reply", replySchema)

export default replyModel