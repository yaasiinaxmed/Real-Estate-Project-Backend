# Real Estate Marketplace API
## Introduction
The Real Estate Marketplace API is a RESTful web service that allows users to create, read, update, and delete properties in a online marketplace. Users can also sign up, log in, and send requests to owners. 
The API uses `JSON` as the data format for requests and responses, and `JWT` as the authentication method for users.

### The base URL for the API is:

`https://real-estate-marketplace-0vnt.onrender.com/`

##### The API has two main controllers:
 the user controller and the property controller. The user controller handles the operations related to users, such as signing up, logging in, and updating or deleting their accounts. The property controller handles the operations related to properties, such as creating, reading, updating, or deleting properties, sending requests to owners, approving requests, and getting transactions.

### User Sign Up 
#### Endpoint: `api/users/signup`
This endpoint allows a new user to sign up for the real estate marketplace. It requires the following parameters in the request body:

| Parameter  | Type     | Required    | Description |
|------------| -------- | ------------|-------------|
| Name       | String   | Yes         | The name of the user |
| Email      | String   | Yes         | The email of the user |
| Password   | String   | Yes         | The password of the user |

The endpoint will hash the password using bcrypt and save the user in the database using the user model. 
If the user is created successfully, it will return a JSON response with the status code 201 and a message
``` json
{
    "status": 201,
    "message": "User created successfully"
}
```
If the user email already exists, a `409 Conflict` response will be returned.
If the user is not created, a `400 bad request` response will be returned.

If there is any internal server error, it will return a JSON response with the status code 500 and an error message:
``` json
{
    "status": 500,
    "message": "Internal Server Error",
    "error": "<error message>"
}
```

### User Login 
#### Endpoint: `api/users/login`
This endpoint allows an existing user to log in to the real estate marketplace. It requires the following parameters in the request body:

| Parameter  | Type     | Required    | Description |
|------------| -------- | ------------|-------------|
| Email      | String   | Yes         | The email of the user |
| Password   | String   | Yes         | The password of the user |

The endpoint will find the user by email in the database using the user model.
If the user email  is not found, a `404 not found` response will be returned.

If either email or password are missing, it will return a JSON response with the status code 400 and a message
``` json
{
    "status": 400,
    "message": "<field> required field missing!"
}
```
The endpoint will compare the password with the hashed password stored in the database using bcrypt. If the password is not correct, it will return a JSON response with the status code 401 and a message:
``` json
{
    "status": 401,
    "message": "Password is not correct!"
}
```

If the password is correct, it will generate a JSON web token (JWT) using jsonwebtoken and sign it with a secret key stored in an environment variable. The token will have an expiration time of 7 days. It will return a JSON response with the status code 200, a message, and a token:
``` json
{
    "status": 200,
    "message": "User logged in successfully",
    "token": "<token>"
}
```