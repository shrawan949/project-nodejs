# 🛍️ Nexus E-Commerce Platform

> Enterprise-grade, modern, full-stack E-Commerce ecosystem built with **Node.js**, **Express.js**, **MongoDB**, **EJS**, **Tailwind CSS**, and **Docker/Kubernetes**.

---

## 🌟 Key Highlights

* **🎨 Storefront & Catalog**:
  * Clean, responsive design powered by Tailwind CSS and Alpine.js.
  * Real-time search by keyword, category filter, price range slider, and sort controls.
  * Product Detail view with multi-image gallery, real-time stock counters, star ratings, and review submissions.

* **🛒 Shopping Bag & Checkout**:
  * Dynamic client-side shopping cart with localStorage persistence.
  * Promo code discount engine (Supports % and fixed $ off coupons e.g. `WELCOME10`, `NEXUS20`).
  * Multi-step checkout with address validation, payment selection, and simulated instant card processing.
  * Order confirmation and personal order history page with tracking badges.

* **🛡️ Admin Management Dashboard (`/admin`)**:
  * Real-time KPI analytics cards (Total Revenue, Total Orders, Total Products, Total Users).
  * Inventory management (Add, edit, view, delete products with custom image URLs and pricing).
  * Fulfillment center (Update order statuses from `Pending` &rarr; `Processing` &rarr; `Shipped` &rarr; `Delivered`).
  * Customer accounts manager with role toggle (`Customer` &harr; `Admin`).

* **🔐 Security & Architecture**:
  * JSON Web Tokens (JWT) stored in secure `HttpOnly` cookies and Bearer headers.
  * Password encryption using `bcryptjs` (salt factor 10).
  * Rate-limiting, Helmet security headers, CORS, and Gzip compression.
  * Clean MVC architectural pattern with modular controllers, routes, and models.

* **🐳 DevOps & Cloud Ready**:
  * Optimized production `Dockerfile` with non-root security context.
  * `docker-compose.yml` orchestrating Node.js app, MongoDB 7, and Mongo Express UI.
  * Full production Kubernetes manifests (`k8s/`) with auto-restarting probes and NodePort services.

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/shrawan949/project-nodejs.git
cd project-nodejs
npm install
```

### 2. Configure Environment
Copy the sample environment variables:
```bash
cp .env.example .env
```

Ensure MongoDB is running locally (`mongodb://localhost:27017/nexus_ecommerce`) or provide your MongoDB Atlas URI in `.env`.

### 3. Seed Database with Realistic Products
Populate the database with pre-configured products, categories, coupons, and demo accounts:
```bash
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
# Or for production:
npm start
```

Visit the application in your browser:
* **Storefront**: [http://localhost:5000](http://localhost:5000)
* **Admin Dashboard**: [http://localhost:5000/admin](http://localhost:5000/admin)
* **API Health Check**: [http://localhost:5000/api/v1/health](http://localhost:5000/api/v1/health)

---

## 🔑 Demo Account Credentials

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@nexus-shop.com` | `AdminSecure2026!` | Access to `/admin`, order management, inventory CRUD |
| **Customer** | `john@example.com` | `Customer123!` | Storefront browsing, cart, checkout, order tracking |

*(Clicking "Demo Admin" or "Demo Customer" on the `/login` page will automatically pre-fill these credentials).*

---

## 🎟️ Active Demo Promo Codes

* **`WELCOME10`**: 10% off any order over $50.
* **`NEXUS20`**: 20% off all orders over $100.
* **`SUPER50`**: $50 flat discount on orders over $200.

---

## 🐳 Docker Deployment

Run the entire stack with MongoDB and Mongo Express GUI in one command:

```bash
docker compose up -d --build
```

Access services:
* **Web Storefront**: [http://localhost:5000](http://localhost:5000)
* **Mongo Express Database UI**: [http://localhost:8081](http://localhost:8081) *(User: `admin`, Pass: `pass`)*

---

## ☸️ Kubernetes Deployment

Deploy the entire cluster configuration to your Kubernetes cluster:

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/mongodb.yaml
kubectl apply -f k8s/app-deployment.yaml
```

Check deployment status:
```bash
kubectl get pods -n nexus-ecommerce -w
```

Access the application via NodePort at `http://<NODE-IP>:30500`.

---

## 📡 REST API Reference

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register new customer account | Public |
| `POST` | `/api/v1/auth/login` | Sign in & receive JWT | Public |
| `GET` | `/api/v1/auth/logout` | Clear auth cookie | Public |
| `GET` | `/api/v1/auth/me` | Fetch active profile | Authenticated |
| `GET` | `/api/v1/products` | Query products (filtering, search, sort) | Public |
| `GET` | `/api/v1/products/:id` | Get single product by ID or Slug | Public |
| `POST` | `/api/v1/products` | Create new product listing | Admin |
| `PUT` | `/api/v1/products/:id` | Update product details | Admin |
| `DELETE`| `/api/v1/products/:id` | Remove product | Admin |
| `POST` | `/api/v1/products/:id/reviews`| Post product review | Authenticated |
| `POST` | `/api/v1/orders` | Place new order & decrease stock | Authenticated |
| `GET` | `/api/v1/orders/myorders` | Retrieve customer order history | Authenticated |
| `GET` | `/api/v1/orders` | List all orders | Admin |
| `PUT` | `/api/v1/orders/:id/status` | Update fulfillment state | Admin |
| `POST` | `/api/v1/coupons/validate` | Check promo code eligibility | Public |
| `GET` | `/api/v1/users/stats` | Retrieve revenue and order KPIs | Admin |

---

## 📂 Project Architecture

```
project-nodejs/
├── Dockerfile                   # Container specification
├── docker-compose.yml           # Multi-container orchestration
├── k8s/                         # Production Kubernetes manifests
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secret.yaml
│   ├── mongodb.yaml
│   └── app-deployment.yaml
├── package.json
├── src/
│   ├── app.js                  # Express middleware & route composition
│   ├── server.js               # Entrypoint & database initialization
│   ├── config/
│   │   └── db.js               # Mongoose connection
│   ├── controllers/            # Business logic handlers
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── userController.js
│   │   ├── couponController.js
│   │   └── pageController.js
│   ├── middleware/             # Auth, role-guard, error handler
│   ├── models/                 # Mongoose data schemas
│   ├── routes/                 # Express route definitions
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── seeder.js           # Database population script
│   ├── public/                 # Static CSS, JavaScript, and assets
│   └── views/                  # EJS server-rendered templates
│       ├── layouts/main.ejs
│       ├── pages/
│       └── partials/
```

---

## 📜 License
MIT License &copy; 2026 Shrawan Ambarte.
