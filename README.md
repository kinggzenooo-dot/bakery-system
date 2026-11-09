# Fredy Bills Bakery Management System

An enterprise bakery management system supporting six operational portals: Customer Storefront, Multi-Role Login, Administrator, POS / Cashier Counter, Baker Production Queue, and Delivery Tracking.

---

## Architecture Overview

This project uses a decoupled, production-ready architecture:

- **Frontend (`frontend/`)**: Static HTML5, modern CSS3, and vanilla ES6+ JavaScript. Deployed directly to **Vercel**.
- **Backend (`backend/`)**: FastAPI REST API with SQLAlchemy and JWT authentication. Deployed as a web service to **Render** (or Railway / VPS).
- **Database & Storage**: **Supabase** PostgreSQL and Supabase Storage bucket (`bakery-images`).

---

## 1. Local Development

### Run Backend
```bash
cd backend
pip install -r requirements.txt
python run.py
```
- API Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- Health Check: [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)

### Run Tests
```bash
cd backend
python test_api.py
```

### View Frontend
Open any HTML file in `frontend/` (e.g. `frontend/index.html` or `frontend/login.html`) in your browser, or serve with VS Code Live Server.

---

## 2. Deployment Instructions

### A. Deploy Backend to Render
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your GitHub repository: `kinggzenooo-dot/bakery-system`.
3. Set the following settings:
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Under **Environment Variables**, add:
   - `DATABASE_URL`: Your Supabase PostgreSQL URI (`postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres`)
   - `SUPABASE_URL`: `https://pfwpcekkkfaqbquygryc.supabase.co`
   - `SUPABASE_KEY`: Your Supabase Anon or Service Role key
   - `SECRET_KEY`: `fredy-bills-bakery-secret-key-2026-mse-super-secure`

### B. Deploy Frontend to Vercel
1. Create a new project on [Vercel](https://vercel.com).
2. Connect the repository: `kinggzenooo-dot/bakery-system`.
3. Set **Root Directory** to `frontend` (or leave default root).
4. Click **Deploy**.

### C. Connect Frontend to Render
In `frontend/js/api.js`, update `PRODUCTION_BACKEND_URL` with your Render service URL:
```javascript
const PRODUCTION_BACKEND_URL = "https://your-backend-name.onrender.com";
```
Or set it at any time in the browser via `localStorage.setItem("fb_api_url", "https://your-backend-name.onrender.com/api")`.

---

## Default User Accounts (for Demo & Testing)

Default password for all accounts: `password123`

| Role | Email | Portal Page |
| :--- | :--- | :--- |
| **Administrator** | `admin@fredybills.ph` | `admin.html` |
| **POS / Cashier** | `counter@fredybills.ph` | `pos.html` |
| **Baker** | `baker@fredybills.ph` | `baker.html` |
| **Delivery Rider** | `delivery@fredybills.ph` | `delivery.html` |
| **Customer** | `customer@fredybills.ph` | `index.html` |
