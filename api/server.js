import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js'
import propertiesRouter from './routes/properties.route.js'

const server = express()

dotenv.config()
server.use(express.json())

// the connect mongoDB
mongoose.connect(process.env.DATABASE_URL).then(() => {
    console.log("Connected MongoDB")
}).catch((error) => {
    console.log("Connecting MongoDB Error:", error)
})

// routes
server.use("/api/auth", userRouter)
server.use("/api/properties", propertiesRouter)

export default server