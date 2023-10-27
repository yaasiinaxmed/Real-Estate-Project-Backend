# Real Estate Marketplace API
## Introduction
The Real Estate Marketplace API is a RESTful web service that allows users to create, read, update, and delete properties in a online marketplace. Users can also sign up, log in, and send requests to owners. 

## Authentication
This API uses JSON Web Tokens `JWT` for authentication. To access protected endpoints, include the `Authorization` header in your requests with the value `Bearer <token>`, where `<token>` is the JWT obtained during the login process.

### The base URL for the API is:
`https://real-estate-marketplace-0vnt.onrender.com/`

##### The API has two main controllers:
 the user controller and the property controller. The user controller handles the operations related to users, such as signing up, logging in, and updating or deleting their accounts. The property controller handles the operations related to properties, such as creating, reading, updating, or deleting properties, sending requests to owners, approving requests, and getting transactions.

### User Sign Up - POST
#### Endpoint: `/api/users/signup`
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

### User Login - POST
#### Endpoint: `/api/users/login`
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
### Get Users - GET
#### Endpoint: `/api/users`
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

### Get User - GET
#### Endpoint: `/api/users/user`
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

### Update User - PUT
#### Endpoint: `/api/users/update/:id`
This endpoint allows an existing user to update their information in the database using the user model. It requires the following parameters in the request body:

| Parameter  | Type     | Required    | Description |
|------------| -------- | ------------|-------------|
| id   | String | Yes      | The ID of the user. |
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

###  Delete User - DELETE
#### Endpoint: `/api/users/delete/:id`
This endpoint allows an existing user to delete their account from the database using the user model. It does not require any parameters in the request body or query.

| Parameter       | Type    | Required | Description                              |
| --------------- | ------- | -------- | ---------------------------------------- |
| id   | String | Yes      | the ID of the user. |

The endpoint will delete the user from the database by id using the user model. If the user is deleted successfully, it will return a JSON response with the status code `200` and a message 

``` json
{
    "status": 200,
    "message": "User deleted successfully"
}
```
### Get Properties and Search Filter - GET
#### Endpoint: `/api/properties/`
This endpoint returns all the properties in the database using the property model. It also allows filtering by query parameters in the request URL.

The endpoint accepts the following query parameters:

| Query Parameter  | Type     | Required    | Description |
|------------| -------- | ------------|-------------|
| title      | String   | No         | The title of the property. |
| price      | Number   | No         | The price of the property. |
| bedrooms      | Number   | No         |  The number of bedrooms in the property.|
| bathrooms      | Number   | No         |  The number of bathrooms in the property.|
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

### Create Property - POST
#### Endpoint: `/api/properties/create`
This endpoint allows an authenticated user to create a new property in the real estate marketplace. It requires the following parameters in the request body:

| Parameter  | Type     | Required    | Description |
|------------| -------- | ------------|-------------|
| title      | String   | Yes         | The title of the property. |
| description      | String   | Yes         | The description  of the property. |
| price      | Number   | Yes         | The price of the property. |
| bedrooms      | Number   | Yes         |  The number of bedrooms in the property.|
| bathrooms      | Number   | Yes         |  The number of bathrooms in the property.|
| location      | String   | Yes         |  The location of the property.|
| propertyType      | String   | Yes         |   The type of the property, such as apartment, house, villa, etc.|
| type      | String   | Yes         |  The type of the transaction, such as rent or sale. |

The endpoint will create a new property in the database using the property model with the provided parameters and the owner id. If the property is created successfully, it will return a JSON response with the status code `200` and a message:

``` json
{
  "status": 200,
  "message": "Property created successfully",
}
```
If the property is not created, it will return a JSON response with the status code `400` and a message `Property was not created`

### Update Property - PUT
#### Endpoint: `/api/properties/update/:id`
This endpoint allows an authenticated user to update their property in the database using the property model. It requires the following parameters in the request body:

| Parameter  | Type     | Required    | Description |
|------------| -------- | ------------|-------------|
| title      | String   | No         | The title of the property. |
| description      | String   | No         | The description  of the property. |
| price      | Number   | No         | The price of the property. |
| bedrooms      | Number   | No         |  The number of bedrooms in the property.|
| bathrooms      | Number   | No         |  The number of bathrooms in the property.|
| location      | String   | No         |  The location of the property.|
| propertyType      | String   | No         |   The type of the property, such as apartment, house, villa, etc.|
| type      | String   | No         |  The type of the transaction, such as rent or sale. |
| id   | String | Yes      | ID of the property. |

The endpoint will update the property in the database by id using the property model with the provided parameters and the owner id. If the property is updated successfully, it will return a JSON response with the status code `200` and a message:

``` json
{
  "status": 200,
  "message": "Property updated  successfully",
}
```
If the property is not updated, it will return a JSON response with the status code `400` and a message `Property was not updated!`

### Delete Property - DELETE
#### Endpoint: `/api/properties/delete/:id`
This endpoint allows an authenticated user to delete their property from the database using the property model.

| Parameter       | Type    | Required | Description                              |
| --------------- | ------- | -------- | ---------------------------------------- |
| ID   | String | Yes      | The ID of the property. |

The endpoint will delete the property from the database by id using the property model. If the property is deleted successfully, it will return a JSON response with the status code `200` and a message:

``` json
{
  "status": 200,
  "message": "Property deleted  successfully",
}
```

If there is any internal server error, it will return a JSON response with the status code 500 and an error message:

``` json
{
  "status": 500,
  "message": "Internal Server Error",
  "error": "<error message>",
}
```
### Send Request - POST
#### Endpoint: `/api/properties/:id/send_request`
This endpoint allows a logged in user to send a request to another user for their property in the real estate marketplace.

#### Request Parameters

| Parameter       | Type    | Required | Description                              |
| --------------- | ------- | -------- | ---------------------------------------- |
| id   | String | Yes      | ID of the property to send the request for. |

#### Response

```json
{
  "status" : 200,
  "message": "Request sent successfully"
}
```
### Get Requests - GET
#### Endpoint: `/api/properties/requests`
The endpoint returns a list of all requests submitted by renters and buyers in the database

#### Response

```json
[
  {
    "_id": "60f9a3c8a9d2f31a4c8b4567",
    "title": "Spacious apartment in downtown",
    "description": "A beautiful and modern apartment with 3 bedrooms and 2 bathrooms, located in the heart of the city. Close to public transportation, shops, restaurants, and parks.",
    "price": 1500,
    "bedrooms": 3,
    "bathrooms": 2,
    "location": "New York, NY",
    "propertyType": "Apartment",
    "type": "for rent",
    "ownerId": "60f9a3c8a9d2f31a4c8b4568",
    "senderId": "60f9a3c8a9d2f31a4c8b4569"
  },
  {
    "_id": "60f9a3c8a9d2f31a4c8b4570",
    "title": "Cozy house with a garden",
    "description": "A charming and cozy house with 2 bedrooms and 1 bathroom, located in a quiet and green neighborhood. The house has a large garden with a patio and a barbecue area.",
    "price": 250000,
    "bedrooms": 2,
    "bathrooms": 1,
    "location": "Los Angeles, CA",
    "propertyType": "House",
    "type": "for sell",
    "ownerId": "60f9a3c8a9d2f31a4c8b4571",
    "senderId": "60f9a3c8a9d2f31a4c8b4572"
  }
]
```
If there are no requests found, it will return a JSON response with the status code `404` and a message `Requests not found`

### Approve to requests - POST
#### Endpoint: `/api/properties/requests/:id/approve`
This endpoint approves a request with a given ID and creates a new transaction for it. A transaction is a record of a completed deal between owners and renters for a property.

#### Request Parameters

| Parameter       | Type    | Required | Description                              |
| --------------- | ------- | -------- | ---------------------------------------- |
| id   | String | Yes      | The ID of the request to be approved. |

#### Response

```json
{
  "status" : 200,
  "message": "The request has been successfully approved"
}
```
### Get Transactions - GET
#### Endpoint: `/api/properties/transactions`
This endpoint returns a list of all transactions in the database,
A transaction is a record of a completed deal between owners and renters for a property.

#### Response

```json
[
  {
    "_id": "60f9a3c8a9d2f31a4c8b4573",
    "title": "Spacious apartment in downtown",
    "description": "A beautiful and modern apartment with 3 bedrooms and 2 bathrooms, located in the heart of the city. Close to public transportation, shops, restaurants, and parks.",
    "price": 1500,
    "bedrooms": 3,
    "bathrooms": 2,
    "location": "New York, NY",
    "propertyType": "Apartment",
    "type": "Rent",
    "ownerId": "60f9a3c8a9d2f31a4c8b4568",
    "senderId": "60f9a3c8a9d2f31a4c8b4569",
    "approveId": "60f9a3c8a9d2f31a4c8b4567"
  },
  {
    "_id": "60f9a3c8a9d2f31a4c8b4574",
    "title": "Cozy house with a garden",
    "description": "A charming and cozy house with 2 bedrooms and 1 bathroom, located in a quiet and green neighborhood. The house has a large garden with a patio and a barbecue area.",
    "price": 250000,
    "bedrooms": 2,
    "bathrooms": 1,
    "location": "Los Angeles, CA",
    "propertyType": "House",
    "type": "Buy",
    "ownerId": "60f9a3c8a9d2f31a4c8b4571",
    "senderId": "60f9a3c8a9d2f31a4c8b4572",
    "approveId": "60f9a3c8a9d2f31a4c8b4570"
  }
]
```

### Possible error messages:
- `Authentication required`: The request requires authentication, but the user is not authenticated.
- `Invalid token`: The provided token is invalid or expired.
- `Request already sent for this property`: The authenticated user has already sent a request to move into the requested property.
- `Request was not sended!`: The request not sending or The owner of the property is the same as the person who is sending the request.
- `Internal Server Error`: An internal server error occurred.