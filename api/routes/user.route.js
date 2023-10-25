import express from 'express'
import { login, signup, user, userDelete, userUpdate, users } from '../controllers/user.controller.js'
import verifyToken from '../middleware/verifyToken.js'

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.get("/users", users)
router.get("/user", verifyToken, user)
router.put("/user/update/:id", verifyToken, userUpdate)
router.delete("/user/delete/:id", verifyToken, userDelete)

export default router