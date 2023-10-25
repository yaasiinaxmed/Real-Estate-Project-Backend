import {check, validationResult } from 'express-validator'

const validateUser = async (req, res, next) => {
    await check("name", "name is required").notEmpty().run(req)
    await check("email", "email is required").notEmpty().isEmail().run(req)
    await check("password", 'password is required').notEmpty().isEmail().run(req)

    const errors = validationResult(req)
    const errorMessage = errors.array().map((error) => error.msg)

    if(errors.isEmpty()) {
        next()
    } else {
        res.status(400).json({status:  400, message: errorMessage[0]})
    }
}

export default validateUser