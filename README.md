# 🛍️ Nexus E-Commerce Platform

> Enterprise-grade, modern, full-stack E-Commerce marketplace built with **Node.js**, **Express.js**, **MongoDB**, **EJS**, **Tailwind CSS**, **Alpine.js**, and **Docker/Kubernetes**.

---

## 🌟 Key Highlights

* **🎨 Premium Storefront & Catalog**:
  * Responsive design with Tailwind CSS CDN and Alpine.js for lightweight interactivity.
  * 12 product categories with subcategories, 20+ brands, 50+ seeded products.
  * Real-time **search autocomplete** with product suggestions as you type.
  * Advanced filters: category, brand, price range, rating, availability, sorting.
  * Product detail pages with multi-image gallery, specifications, reviews, and related products.
  * Recently viewed products tracked client-side across pages.

* **🛒 Shopping Cart & Checkout**:
  * Client-side shopping cart with `localStorage` persistence.
  * Wishlist for authenticated customers with toggle from any product card.
  * Promo code engine (% and fixed discounts: `WELCOME10`, `NEXUS20`, `SUPER50`).
  * Saved delivery addresses with add/delete management.
  * Server-side order validation: prices fetched from DB, stock verified, tax/shipping calculated.
  * Order confirmation and order history with status tracking.

* **🛡️ Admin Dashboard (`/admin`)**:
  * KPI analytics: total revenue, orders, products, users, low stock alerts.
  * Product CRUD with edit modal, create form, and **CSV bulk import**.
  * Category, brand, and coupon management pages.
  * Order management with status update (Pending → Processing → Shipped → Delivered → Cancelled).
  * Customer accounts with role management.

* **🔐 Security & Architecture**:
  * JWT auth via `HttpOnly` cookies + Bearer headers, with optional auth for public pages.
  * Password hashing (bcrypt, salt 10) with **password reset** flow (token-based).
  * `helmet` CSP configured for CDN libraries, `express-mongo-sanitize` for injection prevention.
  * Rate limiting: 300 req/15min for APIs, 20 req/15min for auth endpoints.
  * CORS configured with credentials support.
  * Role-based access control: server-side admin guards on all admin routes/APIs.

* **🐳 DevOps & Cloud Ready**:
  * Production `Dockerfile` with non-root security context.
  * `docker-compose.yml` with Node.js app, MongoDB 7, and Mongo Express.
  * Kubernetes manifests (`k8s/`) with health probes and NodePort services.

---

## 🚀 Quick Start Guide

### 1. Clone & Install
```bash
git clone https://github.com/shrawan949/project-nodejs.git
cd project-nodejs
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```
Ensure MongoDB is running locally (`mongodb://localhost:27017/nexus_ecommerce`) or provide your MongoDB Atlas URI in `.env`.

### 3. Seed Database
Populate with 50+ products, 12 categories, 36 subcategories, 20 brands, coupons, and demo users:
```bash
npm run seed
```

### 4. Start Server
```bash
npm run dev
# Or for production:
npm start
```

* **Storefront**: [http://localhost:5000](http://localhost:5000)
* **Admin Dashboard**: [http://localhost:5000/admin](http://localhost:5000/admin)
* **API Health**: [http://localhost:5000/api/v1/health](http://localhost:5000/api/v1/health)

---

## 🔑 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@nexus-shop.com` | `AdminSecure2026!` |
| **Customer** | `john@example.com` | `Customer123!` |

*Click "Demo Admin" or "Demo Customer" on `/login` to auto-fill.*

---

## 🎟️ Promo Codes

| Code | Type | Value | Min Order |
| :--- | :--- | :--- | :--- |
| `WELCOME10` | 10% off | Up to $100 cap | $50 |
| `NEXUS20` | 20% off | Up to $200 cap | $100 |
| `SUPER50` | $50 off | Fixed | $200 |

---

## 📡 REST API Reference

### Auth
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register new customer | Public |
| `POST` | `/api/v1/auth/login` | Sign in & receive JWT | Public |
| `GET` | `/api/v1/auth/logout` | Clear auth cookie | Public |
| `GET` | `/api/v1/auth/me` | Get current user profile | Auth |
| `PUT` | `/api/v1/auth/updatedetails` | Update name/phone/address | Auth |
| `PUT` | `/api/v1/auth/updatepassword` | Change password | Auth |
| `POST` | `/api/v1/auth/forgotpassword` | Generate reset token | Public |
| `PUT` | `/api/v1/auth/resetpassword/:token` | Reset password with token | Public |

### Products
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/products` | List/filter/search/paginate products | Public |
| `GET` | `/api/v1/products/autocomplete?q=` | Search autocomplete suggestions | Public |
| `GET` | `/api/v1/products/:id` | Get product by ID or slug | Public |
| `POST` | `/api/v1/products` | Create product | Admin |
| `PUT` | `/api/v1/products/:id` | Update product | Admin |
| `DELETE`| `/api/v1/products/:id` | Delete product | Admin |
| `POST` | `/api/v1/products/import` | Bulk CSV import | Admin |
| `POST` | `/api/v1/products/:id/reviews` | Submit product review | Auth |

### Categories, Brands, Cart, Wishlist, Addresses
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/categories` | List all categories | Public |
| `POST` | `/api/v1/categories` | Create category | Admin |
| `GET` | `/api/v1/brands` | List all brands | Public |
| `POST` | `/api/v1/brands` | Create brand | Admin |
| `POST` | `/api/v1/cart` | Add item to cart | Auth |
| `GET` | `/api/v1/cart` | Get cart | Auth |
| `POST` | `/api/v1/wishlist/toggle` | Toggle wishlist item | Auth |
| `GET/POST/DELETE` | `/api/v1/addresses` | Manage saved addresses | Auth |

### Orders & Coupons
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/orders` | Place order (server-validated) | Auth |
| `GET` | `/api/v1/orders/myorders` | Customer order history | Auth |
| `GET` | `/api/v1/orders` | All orders | Admin |
| `PUT` | `/api/v1/orders/:id/status` | Update order status | Admin |
| `POST` | `/api/v1/coupons/validate` | Validate promo code | Public |
| `POST` | `/api/v1/coupons` | Create coupon | Admin |
| `DELETE`| `/api/v1/coupons/:id` | Delete coupon | Admin |

---

## 📂 Project Architecture

```
project-nodejs/
├── Dockerfile                    # Container specification
├── docker-compose.yml            # Multi-container orchestration
├── k8s/                          # Kubernetes manifests
├── package.json
├── src/
│   ├── app.js                    # Express middleware & route composition
│   ├── server.js                 # Entrypoint & database initialization
│   ├── config/
│   │   └── db.js                 # Mongoose connection
│   ├── controllers/              # Business logic handlers
│   │   ├── authController.js     # Register, login, password reset
│   │   ├── productController.js  # CRUD, search, autocomplete, CSV import
│   │   ├── orderController.js    # Order creation, validation, status
│   │   ├── categoryController.js # Category CRUD
│   │   ├── brandController.js    # Brand CRUD
│   │   ├── cartController.js     # Server-side cart
│   │   ├── wishlistController.js # Wishlist toggle
│   │   ├── addressController.js  # Address management
│   │   ├── couponController.js   # Coupon validation & CRUD
│   │   ├── userController.js     # User admin management
│   │   └── pageController.js     # EJS page renderers
│   ├── middleware/
│   │   ├── auth.js               # JWT protect, authorize, optionalAuth
│   │   └── errorHandler.js       # Centralized error handler
│   ├── models/                   # Mongoose schemas
│   │   ├── User.js               # Users with password reset tokens
│   │   ├── Product.js            # Products with text index, specs
│   │   ├── Category.js           # Hierarchical categories
│   │   ├── Brand.js              # Brand documents
│   │   ├── Order.js              # Orders with items & status
│   │   ├── Coupon.js             # Promo code management
│   │   ├── Cart.js               # Server-side cart
│   │   └── Address.js            # Saved delivery addresses
│   ├── routes/                   # Express route definitions
│   ├── utils/
│   │   ├── generateToken.js      # JWT generation & cookie setter
│   │   └── seeder.js             # Database seeder (50+ products)
│   ├── public/
│   │   ├── js/cart.js            # Cart, wishlist, autocomplete, recently viewed
│   │   └── css/style.css         # Custom animations & styles
│   └── views/                    # EJS templates
│       ├── layouts/main.ejs      # Main layout with nav & footer
│       ├── pages/                # 23 page templates
│       └── partials/             # Reusable components
```

---

## 🐳 Docker

```bash
docker compose up -d --build
```
* **Storefront**: http://localhost:5000
* **Mongo Express**: http://localhost:8081 *(admin/pass)*

---

## ☸️ Kubernetes

```bash
kubectl apply -f k8s/
kubectl get pods -n nexus-ecommerce -w
```
Access at `http://<NODE-IP>:30500`.

---

## 📝 CSV Import Format

Upload CSV files via Admin → Products → Import CSV.

**Required columns**: `name`, `price`, `category`, `description`  
**Optional columns**: `brand`, `countInStock`, `compareAtPrice`, `images` (pipe-separated), `tags` (pipe-separated), `isFeatured`, `shortDescription`

Example:
```csv
name,price,category,description,brand,countInStock,isFeatured
Premium Headphones,149.99,Electronics & Gadgets,High-fidelity wireless headphones,SonicPeak,50,true
```

---

## 📜 License
MIT License © 2026 Shrawan Ambarte.
