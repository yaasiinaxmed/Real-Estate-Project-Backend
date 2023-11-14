import mongoose from 'mongoose'

const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
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
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    propertyType: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    available: {
        type: Boolean,
        default: true
    }
}, {timestamps: true})

const propertyModel = mongoose.model("Property", propertySchema)

export default propertyModel
