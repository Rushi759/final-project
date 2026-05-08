# Market Management API

Base Path: `/market`

## Endpoints

### 1. Register Market
- **URL:** `/market/register`
- **Method:** `POST`
- **Description:** Registers a new market/mandi.
- **Authentication:** Required.
- **Request Format:** `multipart/form-data`
- **Form Data:**
  - `name`: Market name.
  - `phone`: Contact details.
  - `address`: Full address.
  - `items`: JSON string representing items available (e.g., `["Tomato", "Onion"]`).
  - `marketImage` (file, optional): Image of the market.
- **Query Parameters:**
  - `lng`: Longitude.
  - `ltd`: Latitude.
- **Success Response:** `{"message": "Market registered successfully"}`

### 2. Get Markets (Listing)
- **URL:** `/market/getmarket`
- **Method:** `GET`
- **Description:** Fetches all markets with priority sorting:
  - **Tier 1 (Priority):** Recently registered (last 24h) and SGU/Regional hubs.
  - **Tier 2:** Other regional markets (Satara, Sangli, etc.).
  - **Tier 3:** Pune markets (ranked lowest).
- **Query Parameters:**
  - `lng`: User longitude.
  - `lat`: User latitude.
- **Success Response:** Array of market objects.

### 3. Get Current User's Market
- **URL:** `/market/usermarket`
- **Method:** `GET`
- **Description:** Returns the market details owned by the currently logged-in user.
- **Authentication:** Required.
- **Success Response:** Market object or `404` if not found.
