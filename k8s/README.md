# Kubernetes deployment notes

These manifests are examples. Review storage classes, network exposure, resource limits, and TLS before production use.

## 1. Build and push the app image

From the repository root, replace `YOUR_DOCKERHUB_USERNAME` with your Docker Hub username:

```bash
docker build -t YOUR_DOCKERHUB_USERNAME/nexus-ecommerce:latest .
docker login
docker push YOUR_DOCKERHUB_USERNAME/nexus-ecommerce:latest
```

Update the image field in `app-deployment.yaml` to the image you pushed.

## 2. Create namespace and secrets

```bash
kubectl apply -f namespace.yaml
kubectl create secret generic nexus-secret \
  --namespace nexus-ecommerce \
  --from-literal=JWT_SECRET="$(openssl rand -hex 32)" \
  --from-literal=ADMIN_EMAIL="admin@example.com" \
  --from-literal=ADMIN_PASSWORD="REPLACE_WITH_A_UNIQUE_STRONG_PASSWORD"
```

Replace the admin email and password before running the command. Do not commit generated secrets or paste real credentials into this file. For production, prefer your cloud secret manager and an appropriate Kubernetes secret integration.

## 3. Deploy

```bash
kubectl apply -f configmap.yaml
kubectl apply -f mongodb.yaml
kubectl apply -f app-deployment.yaml
kubectl get pods -n nexus-ecommerce
kubectl rollout status deployment/nexus-app-deployment -n nexus-ecommerce
```

Seed the database as a separate, intentional one-off task if needed. Do not seed on every application pod startup: replicas may race and overwrite or duplicate data.

## Important

- MongoDB uses a 5 GiB PersistentVolumeClaim; your cluster must have a default StorageClass or you must set `storageClassName` explicitly.
- The NodePort service is intended for lab use. For internet-facing production traffic, configure a TLS-enabled Ingress/load balancer and restrict network access.
- Kubernetes Secrets are base64-encoded by default, not encrypted by that fact alone. Configure encryption at rest and RBAC appropriately.
