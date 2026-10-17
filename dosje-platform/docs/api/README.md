# STRIDE-X REST API Reference

The STRIDE-X API is implemented using **FastAPI** with automatic OpenAPI (Swagger) generation.

- **Base URL**: `http://localhost:8000/api/v1`
- **Interactive Swagger UI**: `http://localhost:8000/docs`
- **ReDoc Technical Reference**: `http://localhost:8000/redoc`

## Authentication
Authentication requires an OAuth2 Bearer token passed in the request header:
```http
Authorization: Bearer <your_jwt_token>
```
Tokens are acquired via `POST /api/v1/auth/login`.
