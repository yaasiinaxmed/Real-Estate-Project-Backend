import express from 'express'
import { login, signup, user, userDelete, userUpdate, users } from '../controllers/user.controller.js'
import verifyToken from '../middleware/verifyToken.js'
import validateUser from '../middleware/validateUser.js'

const router = express.Router()

// router endpoints
router.post("/signup", validateUser, signup)
router.post("/login", login)
router.get("/", users)
router.get("/user", verifyToken, user)
router.put("/update/:id", verifyToken, userUpdate)
router.delete("/delete/:id", verifyToken, userDelete)

export default router