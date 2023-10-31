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
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})

const propertyModel = mongoose.model("Property", propertySchema)

export default propertyModel
