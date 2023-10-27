# Real Estate Marketplace API
## Introduction
The Real Estate Marketplace API is a RESTful web service that allows users to create, read, update, and delete properties in a online marketplace. Users can also sign up, log in, and send requests to owners. 
The API uses `JSON` as the data format for requests and responses, and `JWT` as the authentication method for users.

### The base URL for the API is:

`https://real-estate-marketplace-0vnt.onrender.com/`

##### The API has two main controllers:
 the user controller and the property controller. The user controller handles the operations related to users, such as signing up, logging in, and updating or deleting their accounts. The property controller handles the operations related to properties, such as creating, reading, updating, or deleting properties, sending requests to owners, approving requests, and getting transactions.

### User Sign Up 
#### Endpoint: `POST /api/users/signup`
This endpoint allows a new user to sign up for the real estate marketplace. It requires the following parameters in the request body:

| Parameter  | Type     | Required    | Description |
|------------| -------- | ------------|-------------|
| Name       | String   | Yes         | The name of the user |
| Email      | String   | Yes         | The email of the user |
| Password   | String   | Yes         | The password of the user |

The endpoint will hash the password using bcrypt and save the user in the database using the user model. 
If the user is created successfully, it will return a JSON response with the status code `201` and a message
``` json
{
    "status": 201,
    "message": "User created successfully"
}
```
If the user email already exists, it will return a JSON response with the status code `409` and a message `User email already exists`.
If the user is not created, it will return a JSON response with the status code `400` and a message `User was not created!`.

If there is any internal server error, it will return a JSON response with the status code `500` and an error message:
``` json
{
    "status": 500,
    "message": "Internal Server Error",
    "error": "<error message>"
}
```

### User Login 
#### Endpoint: `POST /api/users/login`
This endpoint allows an existing user to log in to the real estate marketplace. It requires the following parameters in the request body:

| Parameter  | Type     | Required    | Description |
|------------| -------- | ------------|-------------|
| Email      | String   | Yes         | The email of the user |
| Password   | String   | Yes         | The password of the user |

The endpoint will find the user by email in the database using the user model.
 If the user email is not found, it will return a JSON response with the status code `404` and a message `User email not found`.

If either email or password are missing, it will return a JSON response with the status code `400` and a message
``` json
{
    "status": 400,
    "message": "<field> required field missing!"
}
```
The endpoint will compare the password with the hashed password stored in the database using bcrypt. If the password is not correct, it will return a JSON response with the status code `401` and a message:
``` json
{
    "status": 401,
    "message": "Password is not correct!"
}
```

If the password is correct, it will generate a JSON web token `(JWT)` using jsonwebtoken and sign it with a secret key stored in an environment variable. The token will have an expiration time of 7 days. It will return a JSON response with the status code `200`, a message, and a token:
``` json
{
    "status": 200,
    "message": "User logged in successfully",
    "token": "<token>"
}
```
### Get Users 
#### Endpoint: `GET /api/users`
This endpoint returns all the users in the database using the user model. It does not require any parameters in the request body or query.

The endpoint will find all the users in the database and select all their fields except for their password. If there are users found, it will return a JSON response with an array of users and their fields:
```json
[
    {
        "_id": "<user id>",
        "name": "<user name>",
        "email": "<user email>"
    },
    ...
]
```
If there are no users found, it will return a JSON response with the status code `404` and a message `Users not found`

### Get User 
#### Endpoint: `GET /api/users/user`
This endpoint returns the current user based on the JWT token in the request header. It does not require any parameters in the request body or query.

The endpoint will verify the token using jsonwebtoken and extract the user id from it. It will then find the user by id in the database using the user model and select all their fields except for their password. If the user is found, it will return a JSON response with the user and their fields:

``` json
{
    "_id": "<user id>",
    "name": "<user name>",
    "email": "<user email>"
}
```
If the user is not found, it will return a JSON response with the status code `404` and a message `user not found`

### Update User 
#### Endpoint: `PUT /api/users/update/:id`
This endpoint allows an existing user to update their information in the database using the user model. It requires the following parameters in the request body:

| Parameter  | Type     | Required    | Description |
|------------| -------- | ------------|-------------|
| Name      | String   | No         | The Name of the user |
| Email      | String   | No         | The email of the user |

If the user is updated successfully, it will return a JSON response with the status code `200` and a message

``` json
{
    "status": 200,
    "message": "User updated successfully"
}
```
If the user is not updated, it will return a JSON response with the status code `400` and a message `User was not updated!`

###  Delete User
#### Endpoint: `DELETE /api/users/delete/:id`
This endpoint allows an existing user to delete their account from the database using the user model. It does not require any parameters in the request body or query.

The endpoint requires the `user id` as a parameter in the request URL.

The endpoint will delete the user from the database by id using the user model. If the user is deleted successfully, it will return a JSON response with the status code `200` and a message 

``` json
{
    "status": 200,
    "message": "User deleted successfully"
}
```
### Get Properties and Search Filter
#### Endpoint: `GET /api/properties/`
This endpoint returns all the properties in the database using the property model. It also allows filtering by query parameters in the request URL.

The endpoint accepts the following query parameters:

| Query Parameter  | Type     | Required    | Description |
|------------| -------- | ------------|-------------|
| title      | String   | No         | The title of the property. |
| price      | String   | No         | The price of the property. |
| bedrooms      | String   | No         |  The number of bedrooms in the property.|
| bathrooms      | String   | No         |  The number of bathrooms in the property.|
| location      | String   | No         |  The location of the property.|
| propertyType      | String   | No         |   The type of the property, such as apartment, house, villa, etc.|
| type      | String   | No         |  The type of the transaction, such as rent or sale. |

The endpoint will find all the properties in the database that match the query parameters using the property model. If there are properties found, it will return a JSON response with an array of properties and their fields:

``` json
[
  {
    "_id": "<property id>",
    "title": "<property title>",
    "description": "<property description>",
    "price": <property price>,
    "bedrooms": <property bedrooms>,
    "bathrooms": <property bathrooms>,
    "location": "<property location>",
    "propertyType": "<property type>",
    "type": "<transaction type>",
    "ownerId": "<owner id>",
  },
  ...
]
```
If there are no properties found, it will return a JSON response with the status code `404` and a message `Properties not found`