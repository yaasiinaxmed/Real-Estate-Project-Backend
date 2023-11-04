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
| avater     | String   | No          | The image of the user |
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
| role      | String   | No         | This field specifies the role or permission level of the user, it must be `owner` or `renter` |
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
| propertyType    | String   | Filter by property type | `/properties?propertyType=ApartmenA` |


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
Retrieves a list of rental requests. Users with the "owner" role can view and approve requests.

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
Retrieve a list of rental transactions. Users with the "owner" role can view transaction details.

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

### Possible error messages:
- `Authentication required`: The request requires authentication, but the user is not authenticated.
- `Invalid token`: The provided token is invalid or expired.
- `Request already sent for this property`: The authenticated user has already sent a request to move into the requested property.
- `Request was not sent!`: The owner of the property is the same as the person who is sending the request.
- `Request has already been approved`: The property has already been approved by the owner
- `Role must be owner or renter`: This field specifies the role or permission level of the user, it must be `owner` or `renter`
- `You are not authorized to create a property`: The action of creating a property is not authorized unless one holds the "owner" role.
- `You do not own this property`: It seems that you are not the rightful owner of this property.
- `Internal Server Error`: An internal server error occurred.
