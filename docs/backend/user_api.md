# User Management API

Base Path: `/user`

## Endpoints

### 1. Register User
- **URL:** `/user/register`
- **Method:** `POST`
- **Description:** Registers a new farmer on the platform.
- **Request Body:**
  ```json
  {
    "data": {
      "name": "Full Name",
      "email": "user@example.com",
      "phone": "1234567890",
      "password": "securepassword"
    }
  }
  ```
- **Success Response:** `{"message": "User registered successfully"}`
- **Error Responses:**
  - `400 Bad Request`: Missing 'data' wrapper.
  - `409 Conflict`: Account already exists.
  - `500 Internal Server Error`: Database insertion failed.

### 2. Login
- **URL:** `/user/login`
- **Method:** `POST`
- **Description:** Authenticates a user and sets a session cookie (`token`). Includes a "Golden Key" bypass for the developer/master account.
- **Query Parameters:**
  - `lng` (optional): Longitude for location update.
  - `lat` (optional): Latitude for location update.
- **Request Body:**
  ```json
  {
    "data": {
      "email": "user@example.com",
      "password": "securepassword"
    }
  }
  ```
- **Success Response:** `{"message": "Login successful", "name": "User Name"}`
- **Note:** Sets a `httponly` cookie named `token` valid for 7 days.

### 3. Logout
- **URL:** `/user/logout`
- **Method:** `GET`
- **Description:** Clears the session cookie.
- **Success Response:** `{"message": "Logged out"}`

### 4. Forgot Password
- **URL:** `/user/forgot-password`
- **Method:** `POST`
- **Description:** Generates a temporary recovery token for password reset.
- **Request Body:**
  ```json
  {
    "data": {
      "email": "user@example.com"
    }
  }
  ```
- **Success Response:** `{"message": "Recovery link generated", "demoToken": "JWT_TOKEN"}`

### 5. Reset Password
- **URL:** `/user/reset-password/{token}`
- **Method:** `POST`
- **Description:** Updates the user's password using a valid recovery token.
- **Path Parameters:**
  - `token`: The JWT token received from the forgot-password endpoint.
- **Request Body:**
  ```json
  {
    "data": {
      "password": "newsecurepassword"
    }
  }
  ```
- **Success Response:** `{"message": "Password updated successfully"}`

### 6. Get User Details
- **URL:** `/user/getuser`
- **Method:** `GET`
- **Description:** Fetches the profile details of the currently authenticated user.
- **Authentication:** Required (Token Cookie).
- **Success Response:**
  ```json
  {
    "id": "60d...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "farmerId": "#AGRU123",
    "profilpic": "",
    "location": { "type": "Point", "coordinates": [0.0, 0.0] }
  }
  ```
