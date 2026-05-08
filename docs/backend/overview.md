# AgroGuru Backend API Overview

The AgroGuru backend is built using **FastAPI** and **MongoDB**. It provides a diagnostics-enabled, regional-first intelligence engine for farmers.

## Core Features
- **Regional Intelligence:** Automatic filtering and ranking of nurseries, markets, and labs based on the user's location (prioritizing Satara, Sangli, Kolhapur districts).
- **Session Security:** JWT-based authentication stored in `HttpOnly` cookies.
- **Diagnostic Mode:** Built-in "Golden Key" and emergency bypasses for presentations.
- **Static Assets:** Serves uploaded images via the `/uploads` mount.

## Base URL
The API runs on `http://localhost:8080` (default) or the port specified in the `.env` file.

## Authentication
Authentication is handled via a `token` cookie.
- **Login:** Set via `POST /user/login`.
- **Validation:** Middleware checks for the presence and validity of this cookie on protected routes.

## Modules
1. [User Management](./user_api.md)
2. [Nursery Management](./nursery_api.md)
3. [Market Management](./market_api.md)
4. [Laboratory Management](./lab_api.md)

## Error Handling
The API uses a global crash reporter that returns a `500` status code with detailed tracebacks in the server logs while providing a clean JSON response to the frontend.
```json
{
  "detail": "Internal Server Error: [Error Message]"
}
```
