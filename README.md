# Real Estate Marketplace API
## Introduction
If you're here, you're about to explore some of the great features of the Marketplace API! This API enables users to do various things in the online real estate market. You can create, read, update, and delete properties. Additionally, you can register, log in, and even ask property owners questions. There's a lot more to discover too! Let's get started

## Authentication
This API uses JSON Web Tokens `JWT` for authentication. To access protected endpoints, include the `Authorization` header in your requests with the value `Bearer <token>`, where `<token>` is the JWT obtained during the login process.

## Base URL
`https://real-estate-marketplace-0vnt.onrender.com/`

## Controllers

The API revolves around two main controllers: the user controller and the property controller.

- **User Controller:** Manages user-related operations such as signing up, logging in, updating, or deleting user accounts.
    
- **Property Controller:** Handles property-related operations, including creating, reading, updating, or deleting properties, sending and approving requests, and managing transactions.

### User Sign Up - POST
#### Endpoint: `/api/users/signup`
This endpoint allows a new user to sign up for the real estate marketplace. It requires the following parameters in the request body:

| Parameter  | Type     | Required    | Description |
|------------| -------- | ------------|-------------|
| avatar     | String   | No          | The image of the user |
| name       | String   | Yes         | The name of the user |
| email      | String   | Yes         | The email of the user |
| role      | String   | Yes         | This field specifies the role or permission level of the user, it must be `owner` or `renter` |
| password   | String   | Yes         | The password of the user |

The endpoint will hash the password using bcrypt and save the user in the database using the user model. 
If the user is created successfully, it will return a JSON response with the status code `201` and a message
``` json
{
    "status": 201,
    "message": "User created successfully"
}
```
If the user email already exists, it will return a JSON response with the status code `409` and the message `User email already exists`.
If the user is not created, it will return a JSON response with the status code `400` and the message `User was not created!`.

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
| email      | String   | Yes         | The email of the user |
| password   | String   | Yes         | The password of the user |

The endpoint will find the user by email in the database using the user model.
 If the user email is not found, it will return a JSON response with the status code `404` and the message `User email not found`.

If either email or password is missing, it will return a JSON response with the status code `400` and a message
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

The endpoint will verify the token using jsonwebtoken and extract the user id from it. It will then find the user by ID in the database using the user model and select all their fields except for their password. If the user is found, it will return a JSON response with the user and their fields:

``` json
{
    "_id": "<user id>",
    "name": "<user name>",
    "email": "<user email>"
}
```
If the user is not found, it will return a JSON response with the status code `404` and a message `user not found`

### Update User - PUT
#### Endpoint: `/api/users/update`
This endpoint allows the currently logged-in user to update their information in the database using the user model. It requires the following parameters in the request body:

| Parameter  | Type     | Required    | Description |
|------------| -------- | ------------|-------------|
| avater     | String   | No          | The image of the user |
| name      | String   | No         | The Name of the user |
| email      | String   | No         | The email of the user |

If the user is updated successfully, it will return a JSON response with the status code `200` and a message

``` json
{
    "status": 200,
    "message": "User updated successfully"
}
```
If the user is not updated, it will return a JSON response with the status code `400` and the message `User was not updated!`

###  Delete User - DELETE
#### Endpoint: `/api/users/delete`
This endpoint allows the currently logged-in user to delete their account from the database using the user model. It does not require any parameters in the request body or query.

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

#### Query Parameters:

| Parameter  | Type     | Description    | Example |
|------------| -------- | -------------- |-------------|
| country    | String   | Filter by country | `/properties?country=USA` |
| city    | String   | Filter by city | `/properties?city=New York` |
| propertyType    | String   | Filter by property type | `/properties?propertyType=Apartmen` |


The endpoint will find all the properties in the database that match the query parameters using the property model. If there are properties found, it will return a JSON response with an array of properties and their fields:

``` json
[
 {
  "_id": "6540c31fadc3a01af827c915",
  "title": "Villa 2",
  "description": "This beautiful 3 bedroom home is located in a quiet neighborhood and is close to schools, parks, and shopping.",
  "price": 12000,
  "bedrooms": 5,
  "bathrooms": 2,
  "country": "USA",
  "city": "Boynton Beach",
  "address": "3896 Mulberry Lane",
  "propertyType": "Single-family home",
  "type": "for rent",
  "owner": {
    "_id": "653bd7ba3a1dd048ab6b094c",
    "name": "Yaasiin Ahmed",
    "email": "yaskassoy@gmail.com"
  },
  "available": true,
  "createdAt": "2023-10-31T09:04:32.001Z",
  "updatedAt": "2023-10-31T09:04:32.001Z",
  "__v": 0
}
 ...
]
```
If there are no properties found, it will return a JSON response with the status code `404` and a message `Properties not found`

### Create Property - POST
#### Endpoint: `/api/properties/create`
Create a new property listing. This endpoint is accessible to users with the "owner" role.
It requires the following parameters in the 
#### request body:

| Parameter  | Type     | Required    | Description |
|------------| -------- | ------------|-------------|
| title      | String   | Yes         | The title of the property. |
| description      | String   | Yes         | The description  of the property. |
| price      | Number   | Yes         | The price of the property. |
| bedrooms      | Number   | Yes         |  The number of bedrooms in the property.|
| bathrooms      | Number   | Yes         |  The number of bathrooms in the property.|
| country      | String   | Yes         | the name of the country where the property is located.|
| city      | String   | Yes         |  The city of the country.|
| address      | String   | Yes         | The address of the property.|
| propertyType      | String   | Yes         |   The type of the property, such as apartment, house, villa, etc.|
| type      | String   | Yes         |  The type of the transaction, such as rent or sale. |

The endpoint will create a new property in the database using the property model with the provided parameters and the owner ID. If the property is created successfully, it will return a JSON response with the status code `200` and a message:

``` json
{
  "status": 200,
  "message": "Property created successfully",
}
```
If the property is not created, it will return a JSON response with the status code `400` and the message `Property was not created`

### Update Property - PUT
#### Endpoint: `/api/properties/update/:id`
Update an existing property listing. This endpoint is accessible to users with the "owner" role.
It requires the following parameters in the 
#### request body:

| Parameter  | Type     | Required    | Description |
|------------| -------- | ------------|-------------|
| title      | String   | No         | The title of the property. |
| description      | String   | No         | The description  of the property. |
| price      | Number   | No         | The price of the property. |
| bedrooms      | Number   | No         |  The number of bedrooms in the property.|
| bathrooms      | Number   | No         |  The number of bathrooms in the property.|
| country      | String   | No         | the name of the country where the property is located.|
| city      | String   | No         |  The city of the country.|
| address      | String   | No         | The address of the property.|
| propertyType      | String   | No         |   The type of the property, such as apartment, house, villa, etc.|
| type      | String   | No         |  The type of the transaction, such as rent or sale. |
| id   | String | Yes     | ID of the property. |

The endpoint will update the property in the database by id using the property model with the provided parameters and the owner ID. If the property is updated successfully, it will return a JSON response with the status code `200` and a message:

``` json
{
  "status": 200,
  "message": "Property updated  successfully",
}
```
If the property is not updated, it will return a JSON response with the status code `400` and the message `Property was not updated!`

### Delete Property - DELETE
#### Endpoint: `/api/properties/delete/:id`
Delete an existing property listing. This endpoint is accessible to users with the "owner" role.

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
Send a rental request for a property listing. This endpoint is accessible to users with the "renter" role.

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
This endpoint allows the user to retrieve requests, which are filtered based on their role as either a renter or a property owner.

#### Response

```json
[
  {
     "_id": "65408c57e537dc0e60b87cbd",
     "property": {
       "_id": "6540767990c590d80be8fff4",
       "title": "Villa 2",
       "description": "This beautiful 3 bedroom home is located in a quiet neighborhood and is close to schools, parks, and shopping.",
       "price": 12000,
       "bedrooms": 5,
       "bathrooms": 2,
       "country": "USA",
     "city": "Boynton Beach",
     "address": "3896 Mulberry Lane",
     "propertyType": "Single-family home",
       "type": "for rent",
       "owner": {
         "_id": "653bd7ba3a1dd048ab6b094c",
         "name": "Yaasiin Ahmed",
         "email": "yaskassoy@gmail.com"
       },
       "available": true,
       "createdAt": "2023-10-31T03:37:29.598Z",
       "updatedAt": "2023-10-31T03:37:29.598Z",
       "__v": 0
     },
     "sender": {
       "_id": "654077c5ccc3680bd822efb9",
       "name": "Mohamed Abdi",
       "email": "mohamed@gmail.com"
     },
     "isApproved": false,
     "createdAt": "2023-10-31T05:10:47.168Z",
     "updatedAt": "2023-10-31T05:19:13.396Z",
     "__v": 0
   }
   ...
 ]
```
If there are no requests found, it will return a JSON response with the status code `404` and a message `Requests not found`

### Approve to requests - POST
#### Endpoint: `/api/properties/requests/:id/approve`
To approve a rental request, users with the "owner" role can access this endpoint. It involves assigning a unique ID to the request and creating a transaction for it. A transaction is a record of a completed deal between property owners and renters.

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
This endpoint retrieves transactions that are filtered based on the user's role - either as a renter or a property owner.

#### Response

```json
[
  {
    "_id": "65408e50cdd1a60b730200f3",
    "request": {
      "_id": "65408c57e537dc0e60b87cbd",
      "property": {
        "_id": "6540767990c590d80be8fff4",
        "title": "Villa 2",
        "description": "This beautiful 3 bedroom home is located in a quiet neighborhood and is close to schools, parks, and shopping.",
        "price": 12000,
        "bedrooms": 5,
        "bathrooms": 2,
        "country": "USA",
        "city": "Boynton Beach",
        "address": "3896 Mulberry Lane",
        "propertyType": "Single-family home",
        "propertyType": "Single-family home",
        "type": "for rent",
        "owner": {
          "_id": "653bd7ba3a1dd048ab6b094c",
          "name": "yaskassoy2",
          "email": "yaskassoy4@gmail.com"
        },
        "available": false,
        "createdAt": "2023-10-31T03:37:29.598Z",
        "updatedAt": "2023-10-31T03:37:29.598Z",
        "__v": 0
      },
      "sender": {
        "_id": "654077c5ccc3680bd822efb9",
        "name": "Yaasiin Ahmed",
        "email": "yaskassoy2@gmail.com"
      },
      "isApproved": true,
      "createdAt": "2023-10-31T05:10:47.168Z",
      "updatedAt": "2023-10-31T05:19:13.396Z",
      "__v": 0
    },
    "createdAt": "2023-10-31T05:19:13.002Z",
    "updatedAt": "2023-10-31T05:19:13.002Z",
    "__v": 0
  }
]
```

### Send Message - POST
#### Endpoint: `/api/properties/:id/send_message`
A renter can send a message about a specific property using this endpoint.

#### Request Parameters

| Parameter       | Type    | Required | Description                              |
| --------------- | ------- | -------- | ---------------------------------------- |
| id   | String | Yes      | ID of the property to send the message for. |

#### Response

```json
{
  "status" : 200,
  "message": "message sent successfully"
}
```

### Get Messages - GET
#### Endpoint: `/api/properties/:id/messages`
Retrieves messages related to a property, filtered by the user's role (renter or property owner).

#### Request Parameters

| Parameter       | Type    | Required | Description                              |
| --------------- | ------- | -------- | ---------------------------------------- |
| id   | String | Yes      | ID of the property to send the message for. |

#### Response

```json
[
{
    "_id": "6549e69d6d78d6d45de34030",
    "text": "asc",
    "sender": {
      "_id": "6548d947127413f8e5511192",
      "name": "yasika",
      "email": "yaskassoy121@gmail.com"
    },
    "property": {
      "_id": "6546920bebdc9b145803e121",
      "title": "Spacious apartment in downtown",
      "owner": {
        "_id": "65467f7adf87a8c9c5da32fa",
        "name": "Yaasiin Ahmed",
        "email": "yaskassoy@gmail.com"
      }
    },
    "replies": [],
    "createdAt": "2023-11-07T07:26:21.569Z",
    "updatedAt": "2023-11-07T07:26:21.569Z",
    "__v": 0
  }
   ...
 ]
```
If there are no requests found, it will return a JSON response with the status code `404` and a message `messages not found`

### Send Reply - POST
#### Endpoint: `/api/properties/messages/:id/send_reply`
A renter can send a message about a specific property using this endpoint.

#### Request Parameters

| Parameter       | Type    | Required | Description                              |
| --------------- | ------- | -------- | ---------------------------------------- |
| id   | String | Yes      |ID of the message to send a reply to. |

#### Response

```json
{
  "status" : 200,
  "message": "reply sent successfully"
}
```

### Get Replies - GET
#### Endpoint: `/api/properties/:id/messages`
Retrieves replies related to a specific message, filtering based on user involvement.

#### Request Parameters

| Parameter       | Type    | Required | Description                              |
| --------------- | ------- | -------- | ---------------------------------------- |
| id   | String | Yes      | ID of the message to retrieve replies for.|

#### Response

```json
[
 {
    "_id": "6549be859c35facbe4e229a5",
    "text": "wcs",
    "sender": {
      "_id": "65467f7adf87a8c9c5da32fa",
      "name": "Yaasiin Ahmed",
      "email": "yaskassoy@gmail.com"
    },
    "message": "6548d967127413f8e5511195",
    "createdAt": "2023-11-07T04:35:17.951Z",
    "updatedAt": "2023-11-07T04:35:17.951Z",
    "__v": 0
  }
   ...
 ]
```
If there are no requests found, it will return a JSON response with the status code `404` and a message `replies not found`

### Possible error messages:
- `Authentication required`: The request requires authentication, but the user is not authenticated.
- `Invalid token`: The provided token is invalid or expired.
- `Request already sent for this property`: When a user with the "renter" role tries to send a rental request for a property they have already requested, this error is returned.
- `Request was not sent!`: If the owner of the property is the same as the person who is trying to send the request, this error is returned.
- `Request has already been approved`: If a user attempts to approve a rental request for a property that has already been approved by the owner, this error is returned.
- `Role must be owner or renter`:  This error occurs when a user tries to create an account with a role other than "owner" or "renter." The role must be one of these two values.
- `You don't have permission`: This error indicates that the user does not have the necessary authorization or permission to perform a specific action, possibly due to their role or the type of request.
- `You do not own this property`:  When a user attempts to act on a property they don't own, this error is returned. It signifies that the user lacks ownership of the property.
- `The property is currently unavailable`:  If a user attempts to send a rental request for a property that is not available at the moment, they receive this error.
- `Internal Server Error`: An internal server error occurred.
