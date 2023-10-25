import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const SECRET_KEY = process.env.SECRET_KEY

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization

    if(!token) {
        return res.status(401).json({status: 401, message: "You are not authenticated!" })
    }

    // console.log("token",token)

    const tokenWithoutBearer = token.split(" ")[1]

    jwt.verify(tokenWithoutBearer, SECRET_KEY, (error, decode) => {
        if(error) {
            return res.status(401).jsonL({status: 401, message: "Token is not valid!"})
        }

        req.user = decode

        next()
    })
}

export default verifyToken