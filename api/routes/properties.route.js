import express from 'express'
import { createProperty, deleteProperty, getProperties, updateProperty } from '../controllers/properties.controller.js'
import verifyToken from '../middleware/verifyToken.js'
import validateProperty from '../middleware/ValidateProperty.js'

const router = express.Router()

router.post("/create", verifyToken, validateProperty ,createProperty)
router.get("/", getProperties)
router.put("/update/:id", verifyToken, updateProperty)
router.delete("/delete/:id", verifyToken, deleteProperty)

export default router