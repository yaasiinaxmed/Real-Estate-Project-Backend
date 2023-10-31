import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
    request: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Request"
    }
}, {timestamps: true})

const transactionModel = mongoose.model("Transaction", transactionSchema)

export default transactionModel
