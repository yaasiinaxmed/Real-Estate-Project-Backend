import userModel from "../models/user.model.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const SECRET_KEY = process.env.SECRET_KEY

// Sign Up - POST
export const signup = async (req, res, next) => {
    try {
        const {name, email, role, avatar, password} = req.body

        const user = await userModel.findOne({email})

        if(user) {
            return res.status(409).json({status: 409, message: "User email already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new userModel({
            avatar,
            name,
            email,
            role,
            password: hashedPassword
        })

        if(!newUser) {
            return res.status(400).json({status: 400, message: "User was not created!"})
        }

        await newUser.save()

        res.status(201).json({status: 201, message: "User created successfully"})
    } catch (error) {
        res.status(500).json({status: 500, message: "Internal Server Error", error: error.message})
    }
}

// Login - POST
export const login = async (req, res) => {
    try {
        const {email, password } = req.body

        const user = await userModel.findOne({email})

        if(!user) {
            return res.status(404).json({status: 404, message: "User email not found"})
        }

        if(!password) {
            return res.status(400).json({status: 400, message: "Password required field missing!"})
        }

        if(!email) {
            return res.status(400).json({status: 400, message: "Email required field missing!"})
        }

        const isCorrectPassword = await bcrypt.compare(password, user.password)

        if(!isCorrectPassword) {
            return res.status(401).json({status: 401, message: "Password is not correct!"})
        }

        const token = jwt.sign({id: user._id, role: user.role}, SECRET_KEY, {expiresIn: "7d"})

        res.status(200).json({status: 200, message: "User logged in successfully", token})
    } catch (error) {
        res.status(500).json({status: 500, message: "Internal Server Error", error: error.message})
    }
}

// Users - GET
export const users = async (req, res) => {
    try {

        const users = await userModel.find().select("-password")

        if(users.length === 0) {
           return res.status(404).json({status: 404, message: "Users not found"})
        }

        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({status: 500, message: "Internal Server Error", error: error.message})
    }
}

// User - GET
export const user = async (req, res) => {
    try {

        const user = await userModel.findById(req.user.id).select("-password")

        if(!user) {
            return res.status(404).json({status: 404, message: "User not found"})
        }

        res.json(user)
    } catch (error) {
        res.status(500).json({status: 500, message: "Internal Server Error", error: error.message})
    }
}

// User Update - PUT
export const userUpdate = async (req, res) => {
    try {

        const userId = req.user.id
        const {name, email, avatar} = req.body

        const updatedUser = await userModel.findByIdAndUpdate(
            {_id: userId},
            {
                name: name,
                email: email,
                avatar: avatar
            },
            { new: true } 
        )

        if(!updatedUser) {
            return res.status(400).json({status: 400, message: "User was not updated!"})
        }

        res.status(200).json({status: 200, message: "User updated successfully"})

    } catch (error) {
        res.status(500).json({status: 500, message: "Internal Server Error", error: error.message})
    }
}

// User Delete - DELETE
export const userDelete = async (req, res) => {
    try {
        
        const userId = req.user.id

        const deletedUser = await userModel.findByIdAndDelete({_id: userId})

        if(!deletedUser) {
            return res.status(400).json({status: 400, message: "User was not deleted!"})
        }

        res.status(200).json({status: 200, message: "User deleted successfully"})

    } catch (error) {
        res.status(500).json({status: 500, message: "Internal Server Error", error: error.message})
    }
}