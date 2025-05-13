# SIT323-2025-Prac9P: MongoDB Integration with Kubernetes Microservice

## Overview
This project builds on earlier work by adding a MongoDB database to a Node.js microservice. The microservice runs in a Kubernetes cluster and supports all basic CRUD operations. MongoDB is set up using a StatefulSet with persistent storage and is secured with Kubernetes secrets.

## Features
The application includes full CRUD functionality using Express, connects to MongoDB through the official Node.js mongodb client, and uses Kubernetes secrets to handle database credentials. It also includes liveness and readiness probes to monitor the service’s health. Backups of the MongoDB database are automatically created daily using a CronJob that stores them in a PersistentVolumeClaim (PVC). There's also a simple styled HTML page at /data that displays stored entries.

## How to Use

### What you'll need
- Docker + Kubernetes (Docker Desktop or Minikube)
- kubectl configured
- MongoDB secret created (`mongo-secret.yaml`)
- PersistentVolume and PVC (`mongo-pv-pvc.yaml`)
- ClusterIP service + StatefulSet for Mongo (`mongo-service.yaml`, `mongo-statefulset.yaml`)
- Docker image pushed to Container Registry
- All manifests applied using `kubectl apply`

### How to Deploy and Access the App

Run the following commands to deploy everything:

```bash
kubectl apply -f k8s/
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl rollout restart deployment my-microservice-deployment
```

Then, to access the app in your browser, use port forwarding:

```bash
kubectl port-forward service/my-microservice-service 3000:3000
```

Visit these URLs:

Main app: http://localhost:3000

View data: http://localhost:3000/data

Health check: http://localhost:3000/health



Author
Hope Russo
