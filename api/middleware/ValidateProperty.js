import {check, validationResult} from 'express-validator'

const validateProperty = async (req, res, next) => {
    await check("title", "Title is required").notEmpty().run(req)
    await check("description", "Description is required").notEmpty().run(req)
    await check("price", "Price is required").notEmpty().run(req)
    await check("bedrooms", "Bedrooms is required").notEmpty().run(req)
    await check("bathrooms", "Bathrooms is required").notEmpty().run(req)
    await check("location", "Location is required").notEmpty().run(req)
    await check("propertyType", "PropertyType is required").notEmpty().run(req)
    await check("type", "Type is required").notEmpty().run(req)

    const errors = validationResult(req)
    const errorMessage = errors.array().map((error) => error.msg)

    if(errors.isEmpty()) {
        next()
    } else {
        res.status(400).json({status: 400, message: errorMessage[0]})
    }
}

export default validateProperty