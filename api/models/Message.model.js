import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    sender: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    property: {
        type: mongoose.Types.ObjectId
    }, 
    replies: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Reply"
        }
    ]
}, { timestamps: true});

const messageModel = mongoose.model("Message", messageSchema)

export default messageModel