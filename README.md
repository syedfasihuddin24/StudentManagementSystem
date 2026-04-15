# Student Management System (SMS)

A full-stack web application to manage students, courses, grades, and faculty — built with Spring Boot and React. Features dark mode, interactive analytics dashboard with percentage displays, and comprehensive CRUD operations for all entities.

![SMS Banner](https://img.shields.io/badge/Built%20With-Spring%20Boot%20%2B%20React-blue)
![Version](https://img.shields.io/badge/Version-1.1-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🆕 Recent Updates (v1.1)
- 🌙 **Dark Mode**: Complete theme switching with persistent settings
- 📊 **Enhanced Charts**: Added percentage displays to all dashboard charts
- 🎨 **UI Improvements**: Better responsive design and modern styling
- 🔧 **Performance**: Optimized chart rendering and data loading

## 👨‍💻 Built By
**Syed Fasihuddin** — Gates Institute of Technology

---

## 🚀 Features

### Admin
- Manage students, courses, grades, and attendance
- Analytics dashboard with interactive charts (Grade distribution, Pass/Fail rate, Department stats, Attendance overview)
- View detailed percentages in all charts and tooltips
- Export grade reports as PDF
- Export attendance as CSV
- Search and filter across all modules

### Teacher
- View all courses and enrolled students
- Submit and manage student grades
- Mark daily attendance
- View grade and attendance records

### Student
- Self-registration with automatic profile creation
- View personal grades and GPA
- View attendance records
- Edit personal profile

### UI/UX Features
- 🌙 Dark mode support across all pages
- 📊 Interactive charts with percentage displays
- 📱 Responsive design for all devices
- 🎨 Modern UI with Tailwind CSS
- 🔄 Real-time data updates

## 📸 Screenshots

### Admin Dashboard
![Admin Dashboard](screen%20shots/Screenshot%202026-04-13%20at%204.24.30%E2%80%AFPM.png)

### Student Dashboard
![Student Dashboard](screen%20shots/Screenshot%202026-04-13%20at%204.24.48%E2%80%AFPM.png)

### Teacher Dashboard
![Teacher Dashboard](screen%20shots/Screenshot%202026-04-13%20at%204.24.53%E2%80%AFPM.png)

### Login Page
![Login Page](screen%20shots/Screenshot%202026-04-13%20at%204.24.59%E2%80%AFPM.png)

### Registration
![Registration](screen%20shots/Screenshot%202026-04-13%20at%204.25.04%E2%80%AFPM.png)

### Students Management
![Students Management](screen%20shots/Screenshot%202026-04-13%20at%204.25.11%E2%80%AFPM.png)

### Courses Management
![Courses Management](screen%20shots/Screenshot%202026-04-13%20at%204.25.19%E2%80%AFPM.png)

### Grades Management
![Grades Management](screen%20shots/Screenshot%202026-04-13%20at%204.25.29%E2%80%AFPM.png)

### Attendance Management
![Attendance Management](screen%20shots/Screenshot%202026-04-13%20at%204.25.41%E2%80%AFPM.png)

### Analytics Dashboard
![Analytics Dashboard](screen%20shots/Screenshot%202026-04-13%20at%204.25.58%E2%80%AFPM.png)

### Dark Mode
![Dark Mode](screen%20shots/Screenshot%202026-04-13%20at%204.26.14%E2%80%AFPM.png)

### Charts with Percentages
![Charts with Percentages](screen%20shots/Screenshot%202026-04-13%20at%204.26.39%E2%80%AFPM.png)

### Responsive Design
![Responsive Design](screen%20shots/Screenshot%202026-04-13%20at%204.26.43%E2%80%AFPM.png)

### Profile Management
![Profile Management](screen%20shots/Screenshot%202026-04-13%20at%204.26.47%E2%80%AFPM.png)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Spring Boot 3.5.0 |
| Frontend | React (Vite) + Context API |
| Database | MySQL 9.6 |
| Authentication | JWT (JSON Web Tokens) |
| ORM | Spring Data JPA / Hibernate |
| Styling | Tailwind CSS |
| Theme Management | React Context + Local Storage |
| Charts | Recharts (with custom tooltips) |
| PDF Export | jsPDF + jspdf-autotable |
| CSV Export | Client-side generation |

---

## 📁 Project Structure
```
Student Management System/
├── sms-backend/          # Spring Boot backend
│   ├── src/main/java/com/sms/
│   │   ├── config/       # Security configuration
│   │   ├── controller/   # REST API controllers
│   │   ├── entity/       # JPA entities
│   │   ├── repository/   # Database repositories
│   │   ├── security/     # JWT utilities
│   │   └── service/      # Business logic
│   └── src/main/resources/
│       └── application.properties
└── sms-frontend/         # React frontend
    └── src/
        ├── components/   # Reusable UI components
        ├── context/      # React Context (Auth, Theme)
        ├── pages/        # Page components
        └── services/     # API service layer
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Java 17+
- Maven 3.9+
- Node.js 18+
- MySQL 8+

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/student-management-system.git

# Navigate to backend
cd sms-backend

# Configure database in application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/student_management_system
spring.datasource.username=root
spring.datasource.password=your_password

# Run the backend
mvn spring-boot:run
```

### Frontend Setup
```bash
# Navigate to frontend
cd sms-frontend

# Install dependencies
npm install

# Run the frontend
npm run dev
```

### Database Setup
```sql
CREATE DATABASE student_management_system;
```

---

## 🔐 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@sms.com | admin123 |
| Teacher | andrew@gmail.com | andrew23 |
| Student | jack@gmail.com | jack123 |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Login |
| POST | /api/auth/register | Register |
| GET | /api/students | Get all students |
| POST | /api/students | Create student |
| PUT | /api/students/{id} | Update student |
| DELETE | /api/students/{id} | Delete student |
| GET | /api/courses | Get all courses |
| POST | /api/courses | Create course |
| GET | /api/grades | Get all grades |
| POST | /api/grades | Submit grade |
| GET | /api/attendance | Get attendance |
| POST | /api/attendance | Mark attendance |

---

## 🎯 Key Features & Improvements

### 📊 Enhanced Analytics Dashboard
- **Interactive Charts**: Pie charts and bar charts with hover tooltips
- **Percentage Displays**: All charts show percentages for better insights
- **Real-time Data**: Charts update automatically with data changes
- **Multiple Metrics**: Grade distribution, pass/fail rates, attendance overview, department statistics

### 🌙 Dark Mode Implementation
- **Theme Context**: Global theme management using React Context
- **Persistent Settings**: Theme preference saved in localStorage
- **Complete Coverage**: Dark mode applied to all components and pages
- **Smooth Transitions**: CSS transitions for theme switching

### 📱 Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Adaptive Layouts**: Grid systems that adjust to viewport
- **Touch-Friendly**: Proper button sizes and spacing for mobile devices

### 🔒 Security Features
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Different permissions for Admin, Teacher, and Student roles
- **Protected Routes**: Route guards for unauthorized access prevention

---

## � Screenshots

### Dashboard Analytics
- Analytics dashboard with interactive charts showing grade distributions, pass/fail rates, and attendance statistics
- Pie charts displaying percentages for attendance and pass/fail metrics
- Bar charts with custom tooltips showing detailed percentages

### User Interfaces
- Login/Register pages with dark mode toggle
- Admin dashboard for managing students, courses, and grades
- Teacher dashboard for grade submission and attendance marking
- Student dashboard for viewing personal records

### Data Management
- Student management interface with search and filtering
- Course management with CRUD operations
- Grade submission forms with validation
- Attendance marking interface

---

## �📄 License
This project is licensed under the MIT License.
