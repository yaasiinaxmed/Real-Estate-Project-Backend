import express from 'express'
import { approveToRequest, createProperty, deleteProperty, getMessage, getProperties, getReplies, getRequests, getTransactions, sendMessage, sendReply, sendRequest, updateProperty } from '../controllers/properties.controller.js'
import verifyToken from '../middleware/verifyToken.js'
import validateProperty from '../middleware/ValidateProperty.js'

const router = express.Router()

// Property routers
router.get("/", getProperties)
router.post("/create", verifyToken, validateProperty ,createProperty)
router.put("/update/:id", verifyToken, validateProperty, updateProperty)
router.delete("/delete/:id", verifyToken, deleteProperty)

// Send request - Route
router.post("/:id/send_request", verifyToken, sendRequest)

// Get requests - Route
router.get("/requests", verifyToken ,getRequests)

// Approve to request - Route
router.post("/requests/:id/approve", verifyToken, approveToRequest)

// Get requests approved - Route
router.get("/transactions", verifyToken,getTransactions)

// Send Message - Route
router.post("/:id/send_message", verifyToken, sendMessage)

// Get Messages - Route
router.get("/:id/messages", verifyToken, getMessage)

// Send Reply - Route
router.post("/messages/:id/send_reply", verifyToken, sendReply )

// Get Replies - Route
router.get("/messages/:id/replies", verifyToken, getReplies )

export default router