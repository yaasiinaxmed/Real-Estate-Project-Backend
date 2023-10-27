import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    bedrooms: {
        type: Number,
        required: true
    },
    bathrooms: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    propertyType: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    ownerId: {
        type: String,
        required: true
    },
    senderId: {
        type: String,
        required: true
    },
    approveId: {
        type: String,
        required: true
    }
}, {timestamps: true})

const transactionModel = mongoose.model("Transaction", transactionSchema)

export default transactionModel