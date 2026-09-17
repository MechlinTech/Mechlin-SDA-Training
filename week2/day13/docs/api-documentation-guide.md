# API Documentation Guide

## 1. Overview

The SDA Training API uses OpenAPI 3.0.0 to describe and document REST APIs.

The API documentation provides information about available endpoints, request parameters, request bodies, authentication, responses, schemas, and errors.

## 2. OpenAPI Specification

The OpenAPI specification is generated using `swagger-jsdoc`.

The main configuration is located at:

`code/docs/openapi.js`

The specification includes:

- API information
- API version
- Development and production servers
- JWT Bearer authentication
- API key authentication
- User schema
- Product schema
- Order schema
- Error schema
- Pagination schema
- Documented API paths

## 3. API Versioning

The current API version is:

`/api/v1`

Example:

`GET /api/v1/users`

Using versioned routes makes it possible to introduce future API versions without breaking existing clients.

## 4. Swagger UI

Interactive API documentation is available at:

`http://localhost:3000/api/v1/docs`

Swagger UI allows developers to:

- View available endpoints
- Read endpoint descriptions
- View parameters
- View request bodies
- View response definitions
- Authorize using JWT
- Test API endpoints interactively

## 5. Swagger JSON

The generated OpenAPI specification is available at:

`http://localhost:3000/api/v1/docs/swagger.json`

This JSON specification can be imported into other API development and testing tools.

## 6. Authentication

The API supports JWT Bearer authentication.

Clients should provide the token using the Authorization header:

`Authorization: Bearer <jwt_token>`

The Swagger UI provides an Authorize button for entering the JWT token.

## 7. Documented APIs

### Users

- Get all users
- Get a user by ID
- Update a user
- Delete a user

### Products

- Get all products
- Get a product by ID
- Create a product
- Update a product
- Delete a product

### Orders

- Get all orders
- Get an order by ID
- Create an order
- Update an order
- Delete an order

### Analytics

- Get API analytics

## 8. Postman Collection

A Postman collection is generated automatically from the OpenAPI specification.

Generated file:

`docs/postman-collection.json`

The collection uses:

`{{base_url}}`

as the API base URL.

The JWT token can be provided using:

`{{jwt_token}}`

## 9. Error Documentation

API errors should provide:

- HTTP status code
- Error message
- Clear response structure

The OpenAPI specification contains an `Error` schema for documenting error responses.

## 10. Documentation Standards

API documentation should be:

- Clear
- Accurate
- Consistent
- Complete
- Easy to understand
- Updated when API behavior changes

Every endpoint should document its purpose, parameters, authentication requirements, request body, successful responses, and relevant error responses.

## 11. Local Development

Start the API server with:

```bash
node server.js