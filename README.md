<div align="center">

# 🚀 NEXUS — HR Portal
### _Smart Human Resource Management for Modern Startups_

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)

<br/>

> **NEXUS** is a full-featured, role-based HR management portal built for startups and growing teams.
> Manage employees, attendance, payroll, and teams — all from one elegant dashboard.

<br/>

</div>

---

## 🖼️ Screenshots

<div align="center">

### 📊 User Management Dashboard
![NEXUS Dashboard](./public/hr1.png)

<br/>

### � Attendance Module
![NEXUS Attendance](./public/hr2.png)

</div>

---

## �📸 Overview

NEXUS delivers a clean, responsive interface with a **dark glassmorphism sidebar** and **role-aware navigation** — every user sees exactly what they need, nothing more.

| Role | Dashboard Access |
|---|---|
| 🔴 **Super Admin** | Full control — users, payroll, attendance review |
| 🟠 **HR Manager** | User management, attendance review, payroll |
| 🟡 **Department Manager** | Team overview & team member management |
| 🟢 **Employee** | Personal dashboard & self-service attendance |

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based login with **token persistence** across page refresh
- **Protected routes** — unauthorized users auto-redirected to login
- **Role-based navigation** — sidebar adapts dynamically per user role

### 👥 Employee Management _(Admin / HR)_
- Full **CRUD** — Create, Read, Update, Delete employee profiles
- **Grant portal access** to any employee with one click (creates their login credentials)

### 📅 Attendance
- Employee **Clock In / Clock Out** with real-time status display
- Full **attendance history** per employee
- **Admin review panel** for HR and Super Admin

### 💰 Payroll _(Admin / HR)_
- Generate payroll — **single or bulk**
- Status tracking — `Pending` → `Due` → `Paid`
- **Paginated** payroll records
- **Loan requests** — employees apply, HR reviews per employee

### 🏢 Team Management _(Dept. Manager)_
- View and manage your own department's team members

### 📊 Dashboard Overview
- Personalized KPI dashboard for every role on login

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19 | UI Library |
| **Vite** | 7 | Build Tool & Dev Server |
| **Redux Toolkit** | 2.x | Global State Management |
| **React Router DOM** | 7 | Client-side Routing |
| **Axios** | 1.x | HTTP API Calls |
| **Tailwind CSS** | 4 | Styling |
| **Framer Motion** | 12 | Animations |
| **Lucide React** | latest | Icons |

> **Backend:** Laravel REST API _(separate repository)_

---

## 📁 Project Structure

```
hr-portal/
├── src/
│   ├── App.jsx                 # Root with route guards
│   ├── config/navigation.js    # Role definitions & nav config
│   ├── features/               # Redux slices
│   │   ├── auth/               # Login, logout, token
│   │   ├── employee/           # Employee CRUD + portal login
│   │   ├── attendance/         # Clock in/out, history
│   │   ├── payroll/            # Payroll + loans
│   │   ├── role/               # Role management
│   │   └── team/               # Team management
│   ├── components/
│   │   ├── layout/             # DashboardLayout, Sidebar, Header
│   │   ├── superAdmin/         # Admin panels
│   │   ├── departmentPanel/    # Dept Manager panels
│   │   └── employeePanel/      # Employee self-service
│   ├── pages/login/            # Login page
│   └── routes/                 # Route definitions
├── public/
│   ├── hr1.png                 # Dashboard screenshot
│   └── hr2.png                 # Attendance screenshot
├── index.html
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **npm** v9+
- Running **Laravel backend**

### Setup

```bash
# Clone & install
git clone https://github.com/Shameer412/Sbresto-HR.git
cd hr-portal
npm install

# Configure environment
echo "VITE_API_BASE_URL=http://your-api-url.com/api" > .env

# Start dev server
npm run dev
```

App runs at → **`http://localhost:5173`**

---

## 🔗 API Reference

All requests use `Bearer <token>` auth header (auto-set by Axios).

| Feature | Method | Endpoint |
|---|---|---|
| Login | `POST` | `/login` |
| All Employees | `GET` | `/hr/employees` |
| Create Employee | `POST` | `/hr/employees` |
| Update Employee | `PUT` | `/hr/employees/{id}` |
| Delete Employee | `DELETE` | `/hr/employees/{id}` |
| Create Portal Login | `POST` | `/hr/employees/{id}/create-user` |
| Clock In | `POST` | `/hr/attendance/clock-in` |
| Clock Out | `POST` | `/hr/attendance/clock-out` |
| Today's Attendance | `GET` | `/hr/attendance/today?employee_id={id}` |
| Attendance History | `GET` | `/hr/attendance/history?employee_id={id}` |
| Get Payrolls | `GET` | `/hr/payrolls?page={n}` |
| Create Payroll | `POST` | `/hr/payrolls` |
| Update Payroll Status | `PUT` | `/hr/payrolls/{id}` |
| Request Loan | `POST` | `/hr/employee/loan/request` |
| Employee Loans | `GET` | `/hr/employee/{id}/loan/requests` |

---

## 🗺️ Roadmap

- [ ] Leave management module
- [ ] Performance review system
- [ ] Employee document uploads
- [ ] Real-time notifications
- [ ] PDF / Excel report exports
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

1. Fork the repo
2. Create branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m 'Add your feature'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request ✅

---

## 📄 License

Licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with ❤️ by the **Sbresto Team**
_Empowering startups to manage people, smarter._

</div>
