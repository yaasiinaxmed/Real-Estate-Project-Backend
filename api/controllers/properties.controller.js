import propertyModel from "../models/property.model.js";
import requestModel from "../models/request.model.js";
import transactionModel from "../models/transactions.model.js";

// create property - POST
export const createProperty = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      title,
      description,
      price,
      bedrooms,
      bathrooms,
      location,
      propertyType,
      type,
    } = req.body;

    const newProperty = new propertyModel({
      title,
      description,
      price,
      bedrooms,
      bathrooms,
      location,
      propertyType,
      type,
      userId,
    });

    if (!newProperty) {
      return res
        .status(400)
        .json({ status: 400, message: "Property was not created!" });
    }

    await newProperty.save();

    res
      .status(200)
      .json({ status: 200, message: "Property created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        status: 500,
        message: "Internal Server Error",
        error: error.message,
      });
  }
};

// Get Properties and search filter - GET
export const getProperties = async (req, res) => {
  try {
    const search = req.query;

    const properties = await propertyModel.find(search);

    if (properties.length === 0) {
      return res
        .status(404)
        .json({ status: 404, message: "Properties not found" });
    }

    res.status(200).json(properties);
  } catch (error) {
    res
      .status(500)
      .json({
        status: 500,
        message: "Internal Server Error",
        error: error.message,
      });
  }
};

// Update Property - PUT
export const updateProperty = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;

    const {
      title,
      description,
      price,
      bedrooms,
      bathrooms,
      location,
      propertyType,
      type,
    } = req.body;

    const updatedProperty = await propertyModel.findByIdAndUpdate(
      { _id: id },
      {
        title,
        description,
        price,
        bedrooms,
        bathrooms,
        location,
        propertyType,
        type,
        userId,
      }
    );

    if (!updatedProperty) {
      return res
        .status(400)
        .json({ status: 400, message: "Property was not updated!" });
    }

    res
      .status(200)
      .json({ status: 200, message: "Property updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        status: 500,
        message: "Internal Server Error",
        error: error.message,
      });
  }
};

// Property Delete - DELETE
export const deleteProperty = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedProperty = await propertyModel.findByIdAndDelete({ _id: id });

    if (!deletedProperty) {
      return res
        .status(400)
        .json({ status: 400, message: "Property was not deleted" });
    }

    res
      .status(200)
      .json({ status: 200, message: "Property deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        status: 500,
        message: "Internal Server Error",
        error: error.message,
      });
  }
};

// Send Request - POST
export const sendRequest = async (req, res) => {
  try {
    const id = req.params.id;
    const senderId = req.user.id;

    const property = await propertyModel.findById(id);

    if (!property) {
      return res
        .status(404)
        .json({ status: 404, message: "Property not found" });
    }

    if (property.userId === senderId) {
      return res
        .status(400)
        .json({ status: 400, message: "Request was not sended!" });
    }

    const existingRequest = await requestModel.findOne({
      requestId: property._id,
      senderId,
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ status: 409, message: "Request has already been sent" });
    }

    const newRequest = await requestModel.create({
      title: property.title,
      description: property.description,
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      location: property.location,
      propertyType: property.propertyType,
      type: property.type,
      userId: property.userId,
      senderId,
      requestId: property._id,
    });

    if (!newRequest) {
      return res
        .status(400)
        .json({ status: 400, message: "Request was not sended!" });
    }

    await newRequest.save();

    res
      .status(200)
      .json({ status: 200, message: "Request was sending successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        status: 500,
        message: "Internal Server Error",
        error: error.message,
      });
  }
};

// Get Requests - GET
export const getRequests = async (req, res) => {
  try {
    const requests = await requestModel.find();

    if (requests.length === 0) {
      return res
        .status(404)
        .json({ status: 404, message: "Requests not found" });
    }

    res.status(200).json(requests);
  } catch (error) {
    res
      .status(500)
      .json({
        status: 500,
        message: "Internal Server Error",
        error: error.message,
      });
  }
};

// Approve to requests - POST
export const approveToRequest = async (req, res) => {
  try {
    const id = req.params.id;

    const request = await requestModel.findById(id);

    if (!request) {
      return res
        .status(404)
        .json({ status: 404, message: "Requests not found" });
    }

    const existingTransaction = await transactionModel.findOne({
      approveId: request._id,
      userId: request.userId,
    });

    if (existingTransaction) {
      return res
        .status(409)
        .json({
          status: 409,
          message: "The request has already been approved!",
        });
    }

    const newTransaction = new transactionModel({
      title: request.title,
      description: request.description,
      price: request.price,
      bedrooms: request.bedrooms,
      bathrooms: request.bathrooms,
      location: request.location,
      propertyType: request.propertyType,
      type: request.type,
      userId: request.userId,
      senderId: request.senderId,
      approveId: request._id,
    });

    if (!newTransaction) {
      return res
        .status(400)
        .json({ status: 400, message: "Request was not approved!" });
    }

    await newTransaction.save();

    res
      .status(200)
      .json({
        status: 200,
        message: "The request has been successfully approved ",
      });
  } catch (error) {
    res
      .status(500)
      .json({
        status: 500,
        message: "Internal Server Error",
        error: error.message,
      });
  }
};

// Get Transactions - GET
export const getTransactions = async (req, res) => {
  try {
    const transactions = await transactionModel.find();

    if (transactions.length === 0) {
      return res
        .status(404)
        .json({ status: 404, message: "Transactions not found" });
    }

    res.status(200).json(transactions);
  } catch (error) {
    res
      .status(500)
      .json({
        status: 500,
        message: "Internal Server Error",
        error: error.message,
      });
  }
};

