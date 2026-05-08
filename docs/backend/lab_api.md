# Laboratory Management API

Base Path: `/lab`

## Endpoints

### 1. Register Laboratory
- **URL:** `/lab/register`
- **Method:** `POST`
- **Description:** Registers a new soil/crop testing laboratory.
- **Authentication:** Required.
- **Request Format:** `multipart/form-data`
- **Form Data:**
  - `name`: Lab name.
  - `phone`: Contact number.
  - `address`: Full address.
  - `laboratoryImage` (file, optional): Image of the laboratory.
- **Query Parameters:**
  - `lng`: Longitude.
  - `ltd`: Latitude.
- **Success Response:** `{"message": "Laboratory registered successfully"}`

### 2. Get Laboratories (Listing)
- **URL:** `/lab/getlaboratory`
- **Method:** `GET`
- **Description:** Fetches all laboratories with tiered sorting:
  - **Tier 1 (Priority):** Recently registered (last 24h) and SGU/Regional hubs (Atigre, Kolhapur, etc.).
  - **Tier 2:** Other regional laboratories.
  - **Tier 3:** Pune laboratories (ranked lowest).
- **Query Parameters:**
  - `lng`: User longitude.
  - `lat`: User latitude.
- **Success Response:** Array of laboratory objects.

### 3. Get Current User's Laboratory
- **URL:** `/lab/userlab`
- **Method:** `GET`
- **Description:** Returns the laboratory details owned by the currently logged-in user.
- **Authentication:** Required.
- **Success Response:** Lab object or `404` if not found.

### 4. Add Service to Laboratory
- **URL:** `/lab/serviceadd`
- **Method:** `POST`
- **Description:** Adds a testing service to the user's laboratory profile.
- **Authentication:** Required.
- **Request Format:** `multipart/form-data`
- **Form Data:**
  - `sname`: Name of the service (e.g., "Soil NPK Test").
  - `photo` (file, optional): Image representing the service.
- **Success Response:** `{"message": "Service added successfully"}`
