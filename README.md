# Kubernetes Todo App

A simple sample application demonstrating a Kubernetes deployment with a Node.js backend, a static frontend, and Redis.

## Components

- `backend/`: Express server connecting to Redis and serving the frontend static files.
- `frontend/`: Nginx-served static web page that calls the backend API.
- `k8s/`: Kubernetes manifests for backend, frontend, Redis, and ingress.
- `.github/workflows/ci.yml`: CI workflow building and pushing Docker images.

## Fixes applied

- Corrected backend package entry point to `app.js`.
- Configured backend to use `REDIS_PASSWORD` and `APP_NAME` from Kubernetes config.
- Aligned Kubernetes deployments with CI image tags.
- Added `.gitignore` and `.dockerignore` to keep local artifacts out of source control and Docker builds.

## Local development

1. Build the backend image:
   ```powershell
   docker build -f backend/Dockerfile -t mv7moud/todo-backend:latest .
   ```
2. Build the frontend image:
   ```powershell
   docker build -t mv7moud/todo-frontend:latest ./frontend
   ```
3. Deploy Kubernetes manifests as needed.

## Environment variables

- `REDIS_HOST`: Redis hostname (default: `localhost`)
- `REDIS_PASSWORD`: Redis password if required
- `APP_NAME`: Application name used in backend responses
