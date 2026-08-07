# 🚀 Kubernetes Todo App

A simple containerized web application demonstrating how to deploy a **Node.js backend, static frontend, and Redis database** using **Docker and Kubernetes**, with automated Docker image builds through **GitHub Actions**.

---

## 🏗️ Architecture

```text
                         ┌─────────────────┐
                         │     Browser     │
                         └────────┬────────┘
                                  │
                                  │ HTTP
                                  ▼
                         ┌─────────────────┐
                         │    Ingress      │
                         │   todo.local    │
                         └────────┬────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                 /  │                        /api
                    ▼                           ▼
          ┌─────────────────┐         ┌─────────────────┐
          │ Frontend Service│         │ Backend Service │
          │    ClusterIP    │         │    ClusterIP    │
          └────────┬────────┘         └────────┬────────┘
                   │                           │
                   ▼                           ▼
          ┌─────────────────┐         ┌─────────────────┐
          │  Frontend Pod   │         │   Backend Pod   │
          │      Nginx      │         │   Node.js       │
          └─────────────────┘         └────────┬────────┘
                                               │
                                               │ redis:6379
                                               ▼
                                      ┌─────────────────┐
                                      │  Redis Service  │
                                      └────────┬────────┘
                                               │
                                               ▼
                                      ┌─────────────────┐
                                      │    Redis Pod    │
                                      └────────┬────────┘
                                               │
                                               ▼
                                      ┌─────────────────┐
                                      │ PVC → PV        │
                                      │ Persistent Data │
                                      └─────────────────┘
```

---

## 📌 Project Overview

The application contains three main components:

* **Frontend** — Static HTML page served by Nginx.
* **Backend** — Node.js/Express application.
* **Redis** — Used to store the application visit counter.

When a user clicks **Call Backend**, the frontend sends a request to:

```text
/api
```

The backend connects to Redis and increments the `visits` counter.

Example response:

```json
{
  "message": "Hello from Todo App 🚀",
  "visits": 5
}
```

---

## 📁 Project Structure

```text
k8s-todo-app-main/
│
├── backend/
│   ├── app.js
│   ├── Dockerfile
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── index.html
│   ├── Dockerfile
│   └── nginx.conf
│
├── k8s/
│   ├── backend/
│   │   ├── backend-configmap.yaml
│   │   ├── backend-deployment.yaml
│   │   ├── backend-secret.yaml
│   │   └── backend-service.yaml
│   │
│   ├── frontend/
│   │   ├── frontend-deployment.yaml
│   │   └── frontend-service.yaml
│   │
│   ├── redis/
│   │   ├── redis-deployment.yaml
│   │   ├── redis-pv.yaml
│   │   ├── redis-pvc.yaml
│   │   └── redis-service.yaml
│   │
│   └── ingress.yaml
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── docker-compose.yml
├── .dockerignore
├── .gitignore
└── README.md
```

---

# 🐳 Docker

The project contains separate Docker images for the backend and frontend.

### Backend

The backend image is built using:

```bash
docker build -f backend/Dockerfile \
  -t mv7moud/todo-backend:latest .
```

### Frontend

```bash
docker build \
  -t mv7moud/todo-frontend:latest \
  ./frontend
```

The images are published to Docker Hub:

```text
mv7moud/todo-backend:latest
mv7moud/todo-frontend:latest
```

---

# 🐳 Docker Compose

The project also includes:

```text
docker-compose.yml
```

which can be used for local container-based development.

The main application components are:

```text
Backend
   │
   │
   ▼
 Redis
```

The backend communicates with Redis using the Redis service hostname.

---

# ☸️ Kubernetes

The Kubernetes manifests are located inside:

```text
k8s/
```

The application is divided into:

```text
Frontend
Backend
Redis
Ingress
Storage
Configuration
Secrets
```

---

## Backend

The backend is deployed using a Kubernetes Deployment.

```text
Deployment
    │
    ▼
Backend Pod
    │
    ▼
Node.js / Express
```

The backend listens on:

```text
3000
```

The backend also provides a health endpoint:

```text
GET /health
```

Response:

```json
{
  "status": "OK"
}
```

---

## Backend Service

The backend is exposed internally through a:

```text
ClusterIP
```

Service.

The service name is:

```text
backend
```

The backend is therefore accessible inside the cluster through:

```text
backend:3000
```

---

# 🎨 Frontend

The frontend is a static HTML application served by Nginx.

Its Docker image is based on:

```text
nginx:alpine
```

The Nginx container listens on:

```text
80
```

The frontend communicates with the backend using:

```text
/api
```

---

# 🗄️ Redis

Redis is deployed using a Kubernetes Deployment.

```text
Redis Deployment
       │
       ▼
   Redis Pod
```

Redis listens on:

```text
6379
```

The Redis Service is named:

```text
redis
```

Therefore, the backend connects to Redis using:

```text
redis:6379
```

---

# 💾 Persistent Storage

Redis uses Kubernetes persistent storage:

```text
Redis Pod
    │
    ▼
   PVC
    │
    ▼
    PV
```

The project contains:

```text
redis-pv.yaml
redis-pvc.yaml
```

The Redis container mounts the storage under:

```text
/data
```

---

# 🔐 ConfigMap & Secret

The backend configuration is separated from the application code.

## ConfigMap

The project uses:

```text
backend-configmap.yaml
```

for configuration such as:

```text
APP_NAME
REDIS_HOST
```

---

## Secret

Sensitive configuration is stored using:

```text
backend-secret.yaml
```

including:

```text
REDIS_PASSWORD
```

The backend receives the configuration from Kubernetes environment variables.

---

# 🌐 Ingress

The project uses Kubernetes Ingress to route external requests.

The configured hostname is:

```text
todo.local
```

Routing:

```text
todo.local/
      │
      ▼
frontend:80
```

and:

```text
todo.local/api
      │
      ▼
backend:3000
```

So the request flow is:

```text
Browser
   │
   ▼
Ingress
   │
   ├── / ──────► Frontend Service
   │
   └── /api ───► Backend Service
```

---

# 🔄 Application Request Flow

### 1. User opens the application

```text
Browser
   │
   │ GET /
   ▼
Ingress
   │
   ▼
Frontend Service
   │
   ▼
Frontend Pod
   │
   ▼
Nginx
```

### 2. User clicks `Call Backend`

The frontend sends:

```text
GET /api
```

### 3. Ingress routes the request

```text
/api
  │
  ▼
Backend Service
```

### 4. Backend communicates with Redis

```text
Backend
   │
   │ redis:6379
   ▼
Redis Service
   │
   ▼
Redis Pod
```

### 5. Redis increments the visit counter

```text
visits = visits + 1
```

### 6. Backend returns the response

```json
{
  "message": "Hello from Todo App 🚀",
  "visits": 6
}
```

---

# ⚙️ Environment Variables

The backend supports:

| Variable         | Description                   | Default               |
| ---------------- | ----------------------------- | --------------------- |
| `REDIS_HOST`     | Redis hostname                | `localhost`           |
| `REDIS_PASSWORD` | Redis authentication password | Not set               |
| `APP_NAME`       | Application name              | `Kubernetes Todo App` |

---

# 🤖 GitHub Actions

The project includes a GitHub Actions workflow:

```text
.github/workflows/ci.yml
```

The workflow runs when code is pushed to:

```text
main
```

The pipeline performs:

```text
Git Push
    │
    ▼
GitHub Actions
    │
    ├── Checkout Repository
    │
    ├── Login to Docker Hub
    │
    ├── Build Backend Image
    │
    ├── Push Backend Image
    │
    ├── Build Frontend Image
    │
    └── Push Frontend Image
```

Docker Hub credentials are provided through GitHub Secrets:

```text
DOCKER_USERNAME
DOCKER_TOKEN
```

> **Note:** The current workflow builds and pushes the Docker images. Kubernetes deployment is not currently automated by this workflow.

---

# 🚀 Local Kubernetes Deployment

After building/publishing the images, the Kubernetes manifests can be applied using:

```bash
kubectl apply -f k8s/redis/
kubectl apply -f k8s/backend/
kubectl apply -f k8s/frontend/
kubectl apply -f k8s/ingress.yaml
```

Check the resources:

```bash
kubectl get pods
```

```bash
kubectl get services
```

```bash
kubectl get deployments
```

```bash
kubectl get ingress
```

---

# 🔍 Useful Kubernetes Commands

Check everything:

```bash
kubectl get all
```

Check pods:

```bash
kubectl get pods -o wide
```

Check services:

```bash
kubectl get svc
```

Check ingress:

```bash
kubectl get ingress
```

Check deployment details:

```bash
kubectl describe deployment backend
```

Check pod logs:

```bash
kubectl logs <pod-name>
```

Check Redis:

```bash
kubectl get pods -l app=redis
```

---

# 🧪 Health Check

The backend exposes:

```text
/health
```

Example:

```bash
curl http://<backend-address>:3000/health
```

Expected response:

```json
{
  "status": "OK"
}
```

---

# 🛠️ Technologies Used

* Node.js
* Express.js
* Redis
* Nginx
* Docker
* Docker Compose
* Kubernetes
* Kubernetes Ingress
* ConfigMap
* Secret
* PersistentVolume
* PersistentVolumeClaim
* GitHub Actions
* Docker Hub

---

# 🎯 Learning Objectives

This project demonstrates practical usage of:

* Containerizing applications with Docker
* Running multi-container applications
* Kubernetes Deployments
* Kubernetes Services
* Kubernetes Ingress
* Kubernetes ConfigMaps
* Kubernetes Secrets
* Persistent Volumes
* Persistent Volume Claims
* Kubernetes service discovery
* Environment-based configuration
* Docker image publishing
* GitHub Actions CI
* Docker Hub integration

---

# 🔮 Possible Improvements

Future improvements could include:

* Automatic Kubernetes deployment from GitHub Actions
* Image versioning instead of using `latest`
* Backend readiness and liveness probes
* Better secret management
* Horizontal Pod Autoscaling
* Resource requests and limits
* Production-grade persistent storage
* TLS/HTTPS with Ingress
* Monitoring and logging
* Real Todo CRUD functionality

---

## 📚 References

* [Kubernetes Documentation](https://kubernetes.io/docs/?utm_source=chatgpt.com)
* [Docker Documentation](https://docs.docker.com/?utm_source=chatgpt.com)
* [GitHub Actions Documentation](https://docs.github.com/en/actions?utm_source=chatgpt.com)
* [Redis Documentation](https://redis.io/docs/?utm_source=chatgpt.com)
* [NGINX Documentation](https://nginx.org/en/docs/?utm_source=chatgpt.com)
