import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js'

const server = express()

dotenv.config()
server.use(express.json())

mongoose.connect(process.env.DATABASE_URL).then(() => {
    console.log("Connected MongoDB")
}).catch((error) => {
    console.log("Connecting MongoDB Error:", error)
})

server.use("/api/auth", userRouter)

export default server