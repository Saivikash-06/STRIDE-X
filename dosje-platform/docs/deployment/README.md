# STRIDE-X Deployment Guide

## Production Architecture
- **Frontend**: Next.js 16 (Node.js runtime, Vercel or sovereign NIC cloud).
- **Backend**: FastAPI / Uvicorn (Containerized Docker on sovereign cloud / Gunicorn multi-worker).
- **Database**: PostgreSQL with connection pooling.
- **Reverse Proxy**: Nginx or Traefik with TLS termination.
