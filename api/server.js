import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

const server = express()

dotenv.config()

mongoose.connect(process.env.DATABASE_URL).then(() => {
    console.log("Connected MongoDB")
}).catch((error) => {
    console.log("Connecting MongoDB Error:", error)
})

server.get("/", (req, res) => {
    res.send("<h1>Hello world</h1>")
})

export default server