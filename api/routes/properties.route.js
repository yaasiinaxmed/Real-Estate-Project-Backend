import express from 'express'
import { createProperty, deleteProperty, getProperties, getRequests, sendRequest, updateProperty } from '../controllers/properties.controller.js'
import verifyToken from '../middleware/verifyToken.js'
import validateProperty from '../middleware/ValidateProperty.js'

const router = express.Router()

router.post("/create", verifyToken, validateProperty ,createProperty)
router.get("/", getProperties)
router.put("/update/:id", verifyToken, validateProperty, updateProperty)
router.delete("/delete/:id", verifyToken, deleteProperty)
router.post("/:id/send_request", verifyToken, sendRequest)
router.get("/requests", getRequests)

export default router