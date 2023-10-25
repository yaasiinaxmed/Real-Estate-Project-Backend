import express from 'express'
import { approveToRequest, createProperty, deleteProperty, getProperties, getRequests, getTransactions, sendRequest, updateProperty } from '../controllers/properties.controller.js'
import verifyToken from '../middleware/verifyToken.js'
import validateProperty from '../middleware/ValidateProperty.js'

const router = express.Router()

router.post("/create", verifyToken, validateProperty ,createProperty)
router.get("/", getProperties)
router.put("/update/:id", verifyToken, validateProperty, updateProperty)
router.delete("/delete/:id", verifyToken, deleteProperty)
router.post("/:id/send_request", verifyToken, sendRequest)
router.get("/requests", getRequests)
router.post("/requests/:id/approve", verifyToken, approveToRequest)
router.get("/transactions", getTransactions)

export default router