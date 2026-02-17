# Culinaire

Culinaire is a full-stack web application dedicated to elevated home cooking.
The platform brings fine-dining recipes into home kitchens, making sophisticated cuisine accessible to non-professional cooks through clear structure, elegant presentation and intuitive design.

> 🎓 Student full-stack project (educational demo).

## Concept

Culinaire combines two worlds:
- refined, restaurant-style recipes

- structured guidance for home cooks

- professional chef profiles with real culinary identity

Each recipe is presented not only as a cooking guide, but as a curated culinary experience.

---

## 🚀 Live Demo

- Frontend: <https://culinaire-app.onrender.com/>
- Backend API: <https://culinaire-rx10.onrender.com>

---

## ✨ Key Features

### For users
- Browse recipes by category
- Detailed recipe pages with:
  - ingredients
  - step-by-step instructions
  - cuisine, level, total time, servings
- Add recipes to favorites
- Personal notes (stored on backend and linked to user account)
- Downloadable PDF shoplist (ingredients + recipe summary)
- Light / dark theme switch
- Fully responsive (mobile, tablet, desktop)

### For Chefs
- Individual chef profile pages
- Display of restaurant and location
- Platform visibility for culinary promotion
- Opportunity to collaborate via contact form

### For Admin
- Fully functional admin dashboard
- Create / edit / delete:
  - recipes
  - chefs
  - categories
- Media upload and image management
- Structured content management system

---

## 🏗 Architecture

This repository contains both frontend and backend:

**Frontend**
- React (v19)
- Vite
- TypeScript
- React Router
- Tailwind CSS (v4)
- Formik
- React Spinners (FadeLoader)
- React Toastify

**Backend**
- Node.js
- Express (v5)
- TypeScript
- MongoDB (MongoDB Atlas)
- Mongoose
- Zod validation
- JWT authentication
- Bcrypt password hashing
- Cookie-based auth
- Cloudinary (image storage)
- PDF generation via:
  - pdfkit
  - svg-to-pdfkit
- Email service integration via:
- Resend (contact form delivery)

---

### 📄 PDF Generation
The backend generates downloadable shopping list PDFs dynamically.
Each PDF contains:
- recipe title
- ingredient list
- short description

This feature allows users to conveniently print or save their shopping list.

---

### 📬 Contact Form
The contact form is integrated with an email delivery service.
Messages submitted through the website are forwarded to a project inbox.

---

## 🔍 SEO & UX

- Dynamic page titles (custom hook)
- Dynamic meta descriptions
- Open Graph meta tags for link previews
- Smooth animated authentication UI
- FadeLoader for asynchronous data fetching
- Optimized loading states across the application

---

## 📦 Getting Started (Local Development)

### 1) Clone the repository
```bash
git clone <https://github.com/DariaKozlova-web/Culinaire.git>
cd <Culinaire>
```
### 2) Install dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
npm install
```
### 3) Environment variables

Create .env files in both frontend and backend folders.

**Backend** (example)

- MONGO_URI
- DB_NAME
- ACCESS_JWT_SECRET
- REFRESH_TOKEN_TTL
- SALT_ROUNDS
- CLIENT_BASE_URL
- CLOUD_NAME
- API_KEY
- API_SECRET
- CONTACT_RECEIVER_EMAIL
- RESEND_API_KEY
- TURNSTILE_SECRET_KEY

**Frontend**

- VITE_APP_SERVER_URL
- VITE_TURNSTILE_SITE_KEY

>⚠️ Never commit real secrets to a public repo. Use .env.example and rotate keys if needed.

### 4) Run locally

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```
---
## 👥 Team

Culinaire was developed collaboratively by three full-stack developers:

- Daria – <https://github.com/DariaKozlova-web>
- Anna  – <https://github.com/marsanna>
- Simona – <https://github.com/simasso>

Each team member contributed to both frontend and backend development.

---

### ⚠️ Disclaimer

Culinaire is a student project created for educational purposes.
Any data and content are used for demo functionality only.
