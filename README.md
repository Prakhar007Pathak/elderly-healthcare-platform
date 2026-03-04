# 🩺 Elderly Nursing & Healthcare Assistance Platform

![React](https://img.shields.io/badge/Frontend-React-blue)

![Node.js](https://img.shields.io/badge/Backend-Node.js-green)

![Express](https://img.shields.io/badge/Framework-Express-black)

![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)

![JWT](https://img.shields.io/badge/Auth-JWT-orange)

![Socket.io](https://img.shields.io/badge/Realtime-Socket.io-purple)

![TailwindCSS](https://img.shields.io/badge/UI-TailwindCSS-38B2AC)

![Internship Project](https://img.shields.io/badge/Type-Internship_Project-blueviolet)

---

## 📌 Project Overview

The **Elderly Nursing & Healthcare Assistance Platform** is a full-stack web application designed to connect senior citizens and their families with verified healthcare professionals providing in-home medical and non-medical care.

This platform digitizes elderly care services by enabling:

* Secure service booking  
* Caregiver verification  
* Real-time service tracking  
* Structured healthcare coordination  

Developed as part of an internship project and built to production-style standards for portfolio demonstration.

---

## 🚀 Features 

### 🔐 Authentication & Security

* Secure user registration and login (JWT-based)
* Role-based access control (Family / Elderly / Caregiver / Admin)
* Protected routes & secure API validation

---

### 👨‍👩‍👧 User & Patient Management

* Create and manage patient profiles
* Store medical needs & personal details
* View booking history
* Submit caregiver ratings

---

### 🧑‍⚕️ Caregiver System

* Caregiver registration & verification workflow
* Manage availability & service areas
* Accept / reject booking requests
* Update service status lifecycle

---

### 🏥 Service Marketplace

* Browse available healthcare services:
  + Nursing Care
  + Elderly Attendant
  + Physiotherapy
  + Post-Hospital Care
* Transparent hourly pricing
* Caregiver profile preview
* Dynamic booking cost calculation

---

### 📅 Booking Engine

* Hourly / multi-day / long-term booking support
* Service status tracking:
  + Requested
  + Accepted
  + Ongoing
  + Completed
  + Cancelled
* Real-time updates using Socket.io

---

### ⭐ Rating System

* Post-service caregiver rating
* Average rating calculation & display

---

### 📊 Dashboard Overview

* Active bookings
* Completed services
* Pending requests
* Basic analytics summary

---

## 📸 Application Preview

### Home Page

![Home](screenshots/Home.png)

### 🔑 Login Page

![Login](screenshots/Login.png)

### 📝 Register Page

![Register](screenshots/Register.png)

### 🏥 Service Marketplace

![Marketplace](screenshots/Marketplace.png)

### 📄 Service Details

![Service Details](screenshots/ServiceDetails.png)

### 📅 Booking Page

![Booking](screenshots/Booking.png)

### 📊 User Dashboard

![Dashboard](screenshots/UserDashboard.png)

### 📖 My Bookings

![Bookings](screenshots/MyBookings.png)

---

## 🔄 System Workflow

1. User registers or logs in  
2. Creates patient profile  
3. Browses healthcare services  
4. Configures schedule & duration  
5. Sends booking request  
6. Caregiver accepts request  
7. Service progresses through defined stages  
8. User receives real-time updates  
9. Service completion & rating submission  

---

## 🧱 Core Modules

* Authentication System  
* Role-Based Access Control  
* Patient Management  
* Caregiver Management  
* Service Marketplace  
* Booking Engine  
* Real-Time Status Updates  
* Rating System  
* Responsive UI (Mobile-Friendly)

---

## 🏗 System Architecture

```
Frontend (React + Tailwind)
↓ REST APIs
Backend (Node.js + Express)
↓
MongoDB Database
↕
Socket.io (Real-Time Updates)
```

---

## 🗄 Database Entities

* Users  
* Patients  
* Caregivers  
* Services  
* Bookings  
* Ratings  

---

## ⚙️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Framer Motion
* Axios
* React Router

### Backend

* Node.js
* Express.js
* MongoDB
* JWT Authentication
* REST APIs
* Socket.io

---

## 🔐 Security Implementation

* JWT-based authentication
* Role-based route protection
* Booking ownership validation
* Caregiver authorization checks
* Protected API endpoints

---

## 🚧 Future Planned Constraints

The following modules are identified for future expansion:

* 📝 Care Notes System (visit-level documentation)
* 🛑 Complaint & Dispute Management System
* 💳 Online Payment Integration
* 📊 Advanced Admin Monitoring
* 🌍 Multi-City Scalability Support
* 📱 Native Mobile Application
* 🆘 Emergency SOS Module
* 📞 Tele-consultation Support

---

## 🛠 Installation & Setup

### Clone Repository

```bash
git clone https://github.com/Prakhar007Pathak/elderly-healthcare-platform.git
cd elderly-healthcare-platform
```

### Backend Setup

```bash
cd backend
npm install
```

### Backend Environment Variables

Create a `.env` file inside the `backend` directory and configure the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Admin auto-seed credentials
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
ADMIN_NAME=Admin

# Cloudinary (Image Upload Service)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start backend server:

```bash
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Frontend Environment Variables

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🌐 Live Deployment

The project is fully deployed and accessible online.

| Service | URL |
|-------|------|
| Frontend (Vercel) | https://eldercare-delta.vercel.app |
| Backend API (Render) | https://eldercare-kodl.onrender.com |

You can explore the platform through the frontend application.  
The backend API is connected to MongoDB Atlas and handles authentication, bookings, services, and real-time updates.

---

## 📈 Expected Impact

* Improved accessibility to verified elderly care

* Transparent pricing & scheduling

* Reduced caregiver search time

* Structured home healthcare management

* Increased trust & service reliability

---

## 👨‍💻 Author

Prakhar Pathak

Full Stack Developer | 2nd year (AI & ML) Student

Passionate about building scalable, real-world web applications.

🔗 GitHub: https://github.com/Prakhar007Pathak

---
