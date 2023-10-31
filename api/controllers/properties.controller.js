import { isValidObjectId } from "mongoose";
import propertyModel from "../models/property.model.js";
import requestModel from "../models/request.model.js";
import transactionModel from "../models/transactions.model.js";

// Get Properties and search filter - GET
export const getProperties = async (req, res) => {
  try {
    const search = req.query;

    const properties = await propertyModel
      .find(search)
      .populate("owner", "name email");

    if (properties.length === 0) {
      return res
        .status(404)
        .json({ status: 404, message: "Properties not found" });
    }

    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// create property - POST
export const createProperty = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const newProperty = new propertyModel({
      ...req.body,
      owner: ownerId,
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
    res.status(500).json({
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
    const ownerId = req.user.id;

     // Check if the current user is the owner of the property.
     const property = await propertyModel.findById(id);
     if (property.owner !== ownerId) {
       return res
         .status(403)
         .json({ status: 403, message: "You are not authorized to update this property." });
     }

    const updatedProperty = await propertyModel.findByIdAndUpdate(
      { _id: id },
      {...req.body}
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
    res.status(500).json({
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
    const ownerId = req.user.id

    // Check if the current user is the owner of the property.
    const property = await propertyModel.findById(id);

    if (property.owner !== ownerId) {
      return res
        .status(403)
        .json({ status: 403, message: "You are not authorized to delete this property." });
    }

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
    res.status(500).json({
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

    const property = await propertyModel.findById(id).populate("owner");

    if (!property) {
      return res
        .status(404)
        .json({ status: 404, message: "Property not found" });
    }

    if (property.owner.id === senderId) {
      return res
        .status(400)
        .json({ status: 400, message: "The Request was not sent!" });
    }

    const existingRequest = await requestModel.findOne({
      property: property._id,
      sender: senderId,
    });

    if (existingRequest) {
      return res.status(400).json({
        status: 409,
        message: "The Request has already been sent this property",
      });
    }

    const newRequest = await requestModel.create({
      property: property._id,
      sender: senderId,
    });

    if (!newRequest) {
      return res
        .status(400)
        .json({ status: 400, message: "The Request was not sent!" });
    }

    await newRequest.save();

    res
      .status(200)
      .json({ status: 200, message: "The Request was sent successfully" });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get Requests - GET
export const getRequests = async (req, res) => {
  try {
    const requests = await requestModel.find().populate([
      { path: "sender", select: "name email" },
      {
        path: "property",
        populate: { path: "owner", select: "name email" },
      },
    ]);

    if (requests.length === 0) {
      return res
        .status(404)
        .json({ status: 404, message: "The Requests not found" });
    }

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({
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
        .json({ status: 404, message: "The Requests not found" });
    }

    if (request.isApproved) {
      return res.status(409).json({
        status: 409,
        message: "The request has already been approved.",
      });
    }

    const newTransaction = new transactionModel({
      request: request._id,
    });

    if (!newTransaction) {
      return res
        .status(400)
        .json({ status: 400, message: "The Request was not approved!" });
    }

    await newTransaction.save();

    await requestModel.findByIdAndUpdate({ _id: id }, { isApproved: true });

    res.status(200).json({
      status: 200,
      message: "The request has been successfully approved ",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get Transactions - GET
export const getTransactions = async (req, res) => {
  try {
    const transactions = await transactionModel.find().populate({
      path: "request",
      populate: [
        { path: "sender", select: "name email" },
        {
          path: "property",
          populate: { path: "owner", select: "name email" },
        },
      ],
    });

    if (transactions.length === 0) {
      return res
        .status(404)
        .json({ status: 404, message: "Transactions not found" });
    }

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
