# SIT323-2025-Prac6C: Interacting with Kubernetes

## Overview

This task builds on Task 6.1P. I updated the Node.js microservice content and interacted with the deployed container using Kubernetes CLI commands. The goal was to verify the app is running, access it through port forwarding, and demonstrate understanding of how Kubernetes manages application pods and updates.

## Files Included

- `index.js`: Updated Node.js microservice with task summary and styling
- `Dockerfile`: Used to build the container
- `deployment.yaml`: Kubernetes Deployment config
- `service.yaml`: Kubernetes Service config
- `README.md`: This file

## Steps Taken

### 1. Updated the Microservice

I modified `index.js` to include more relevant information about the task, added styling, and applied a pop of pink for visual improvement. This change was made to reflect the learning outcomes of this credit-level task.

### 2. Rebuilt and Pushed the Updated Image

```bash
docker build -t gcr.io/cloud-native-microservice/task5:latest .
docker push gcr.io/cloud-native-microservice/task5:latest
```

### 3. Restarted the Deployment

```bash
kubectl rollout restart deployment my-microservice-deployment
```

### 4. Verified the Deployment

```bash
kubectl get pods
```

### 5. Port Forwarded the Service

```bash
kubectl port-forward service/my-microservice-service 3000:3000
```

Then accessed the app in the browser at:

```bash
http://localhost:3000
```

### Notes

Kubernetes was run locally via Docker Desktop.
The application was successfully updated, redeployed, and accessed using kubectl commands.

### Author

Hope Russo
