# Nursery Management API

Base Path: `/nursery`

## Endpoints

### 1. Register Nursery
- **URL:** `/nursery/register`
- **Method:** `POST`
- **Description:** Registers a new nursery. Supports image upload and location coordinates.
- **Authentication:** Required.
- **Request Format:** `multipart/form-data`
- **Form Data:**
  - `name`: Name of the nursery.
  - `phone`: Contact number.
  - `address`: Physical address.
  - `openTime` (optional): Opening time (default: 8:00 AM).
  - `closeTime` (optional): Closing time (default: 6:00 PM).
  - `offDay` (optional): Weekly off day (default: Sunday).
  - `nurseryImage` (file, optional): Profile image for the nursery.
- **Query Parameters:**
  - `lng`: Longitude.
  - `ltd`: Latitude.
- **Success Response:** `{"message": "Nursery registered successfully"}`

### 2. Get Nurseries (Listing)
- **URL:** `/nursery/getnursery`
- **Method:** `GET`
- **Description:** Fetches all registered nurseries. Results are sorted using a tiered logic:
  - **Tier 0:** Within 5km of user location.
  - **Tier 1:** Regional hubs (SGU, Atigre, Kolhapur, etc.).
  - **Tier 2:** Other regional areas.
  - **Filter:** Automatically hides/blocks entries from Pune to ensure regional relevance.
- **Query Parameters:**
  - `lng`: User's current longitude.
  - `lat`: User's current latitude.
- **Success Response:** Array of nursery objects including `distance` field.

### 3. Get Current User's Nursery
- **URL:** `/nursery/usernursery`
- **Method:** `GET`
- **Description:** Returns the nursery details owned by the currently logged-in user.
- **Authentication:** Required.
- **Success Response:** Nursery object or `404` if not found.

### 4. Add Item to Nursery
- **URL:** `/nursery/itemadd`
- **Method:** `POST`
- **Description:** Adds a plant or product to the user's nursery catalog.
- **Authentication:** Required.
- **Request Format:** `multipart/form-data`
- **Form Data:**
  - `itemname`: Name of the plant/product.
  - `photo` (file, optional): Image of the item.
- **Success Response:** `{"message": "Item added successfully"}`

### 5. Clear Fake Data (Debug)
- **URL:** `/nursery/clear-fake`
- **Method:** `DELETE`
- **Description:** Deletes all nurseries from the database.
- **Authentication:** Required.
- **Success Response:** `{"message": "Successfully deleted X nurseries."}`
