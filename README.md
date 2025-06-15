# 🌿 Godecor - Artificial Plant E-Commerce Website

**Godecor** is a modern, fully responsive e-commerce platform for selling artificial plants. Built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js), the project features a scalable architecture with separate frontend and backend codebases.

---

🔗 **Live Demo:** [https://godecor.vercel.app](https://godecor.vercel.app)

---

## 📁 Project Structure

```
/Godecor
├── /frontend   # React.js + Vite + TailwindCSS
└── /backend    # Node.js + Express + MongoDB
```

> **Note:** Frontend and backend are currently not integrated. Integration is planned for the next phase.

---

## 🚀 Tech Stack

- **Frontend:** React, Vite, TailwindCSS, Redux Toolkit, React Hook Form, Framer Motion, Lucide, Axios
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Multer, Razorpay, Cloudinary, Helmet, Google Auth
- **Tools:** Nodemon, Swagger Docs, Jest, ESLint, Swagger Autogen

---

## 📦 Backend Setup

**Directory:** `./backend`

### 🔧 `package.json` (Backend)

```json
{
    "name": "artificial-plants-backend",
    "version": "1.0.0",
    "description": "Backend for Artificial Plants E-Commerce Website",
    "main": "server.js",
    "scripts": {
        "start": "node server.js",
        "dev": "nodemon server.js"
    }
}
```

**To Run Backend:**
```bash
cd backend
npm install
npm run dev
```

---

## 💻 Frontend Setup

**Directory:** `./frontend`

### 🔧 `package.json` (Frontend)

```json
{
    "name": "artificial-plants-ecommerce",
    "version": "0.0.0",
    "scripts": {
        "dev": "vite",
        "build": "vite build"
    }
}
```

**To Run Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 🔜 Upcoming

- Full Integration (Frontend ⇄ Backend)

- SEO Optimization

---

## ✅ Completed Features

- 🔒 User Authentication (JWT, Google Login)
- 🌿 Product Management with Image Upload (Multer + Cloudinary)
- 🛒 Cart and Checkout Functionality
- 💳 Razorpay Payment Integration
- 📧 Email Notifications (Nodemailer)
- 📊 Dashboard with Analytics (Recharts)
- 🎨 Smooth Animations (Framer Motion)
- 📄 API Documentation (Swagger)
- 🧑‍💼 Admin Panel for Managing Products & Orders
- 📱 Fully Responsive Design

---

## 📃 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙋‍♂️ Author

Made with 💚 by **Akash Sahu**  
📍 Agra, Uttar Pradesh  
📧 [aakashsahu9415954491@gmail.com](mailto:aakashsahu9415954491@gmail.com)