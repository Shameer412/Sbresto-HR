<div align="center">

# 🚀 NEXUS — HR Portal
### _Smart Human Resource Management for Modern Startups_

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

> **NEXUS** is a full-featured, role-based HR management portal built for startups and growing teams.
> Manage employees, attendance, payroll, and teams — all from one elegant dashboard.

</div>

---

## 📸 Overview

NEXUS provides a clean, responsive interface with a **dark sidebar** design and **role-aware navigation** — every user sees exactly what they need:

| Role | Access |
|---|---|
| 🔴 **Super Admin** | Full system control: users, payroll, attendance review |
| 🟠 **HR Manager** | Dashboard, user management, attendance review, payroll |
| 🟡 **Department Manager** | Team overview and team member management |
| 🟢 **Employee** | Personal dashboard and self-service attendance |

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- **JWT-based login** with token stored in `localStorage`
- **Protected routes** — unauthenticated users are redirected to login automatically
- **Role-based navigation** — sidebar menu items change dynamically based on the logged-in user's role
- **Session persistence** — users stay logged in on page refresh

### 👥 Employee Management _(Super Admin / HR)_
- Create new employee profiles
- View all employees with full details
- Update existing employee information
- Delete employees
- **Create portal login** for any employee — gives them access to the self-service dashboard

### 📅 Attendance Management
- **Employee self-service**: Clock In and Clock Out with a single click
- **Today's status**: Real-time display of current attendance state (`clocked_in`, `clocked_out`, `not started`)
- **History view**: Full attendance log for each employee
- **Admin / HR review panel**: Super Admins and HR can review all employee attendance records

### 💰 Payroll Management _(Super Admin / HR)_
- Generate payroll for **individual employees** or in **bulk**
- Track payroll status — `Pending`, `Due`, `Paid`
- Update payroll status with a single action
- **Paginated payroll list** for easy navigation through large records
- **Loan Management**:
  - Employees can request loans
  - HR can view and manage loan requests per employee

### 🏢 Team Management _(Department Manager)_
- Department Managers can view and manage their own team members
- View team overview from a dedicated dashboard

### 📊 Overview Dashboard
- All roles get a personalized overview page on login
- Displays relevant KPIs and quick-access tools based on role

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19 | UI Library |
| **Vite** | 7 | Build Tool & Dev Server |
| **Redux Toolkit** | 2.x | Global State Management |
| **React Redux** | 9 | React-Redux binding |
| **React Router DOM** | 7 | Client-side routing |
| **Axios** | 1.x | HTTP API calls |
| **Tailwind CSS** | 4 | Utility-first CSS styling |
| **Framer Motion** | 12 | Animations & transitions |
| **Lucide React** | 0.5+ | Icon library |
| **ESLint** | 9 | Code linting |

**Backend:** Laravel REST API (separate repository)

---

## 📁 Project Structure

```
hr-portal/
├── src/
│   ├── App.jsx                  # Root app with route guards
│   ├── main.jsx                 # Entry point
│   ├── config/
│   │   └── navigation.js        # Role definitions & sidebar nav config
│   ├── features/                # Redux slices (state management)
│   │   ├── auth/                # Login, logout, token handling
│   │   ├── employee/            # Employee CRUD + create portal user
│   │   ├── attendance/          # Clock in/out, today status, history
│   │   ├── payroll/             # Payroll create/fetch/update + loans
│   │   ├── role/                # Roles management
│   │   └── team/                # Team management
│   ├── components/
│   │   ├── layout/              # DashboardLayout, Sidebar, Header
│   │   ├── superAdmin/          # Admin-specific: overview, users, attendance, payroll
│   │   ├── departmentPanel/     # Dept Manager: team management
│   │   └── employeePanel/       # Employee self-service: attendance
│   ├── pages/
│   │   └── login/               # Login page
│   ├── routes/
│   │   ├── index.js             # Core route definitions (role-gated)
│   │   └── AppRoutes.jsx        # Route renderer
│   └── utils/
│       └── api.js               # Axios instance (base URL + auth header)
├── public/
├── index.html
├── vite.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- A running **Laravel backend** (HR API)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/hr-portal.git
cd hr-portal

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://your-backend-url.com/api
```

> Replace `http://your-backend-url.com/api` with your actual Laravel API base URL.

### Running the App

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

The app will be available at `http://localhost:5173`

---

## 🔗 API Endpoints Reference

All requests are authenticated via `Bearer <token>` header (set automatically by Axios).

| Feature | Method | Endpoint |
|---|---|---|
| Login | `POST` | `/login` |
| Get all employees | `GET` | `/hr/employees` |
| Create employee | `POST` | `/hr/employees` |
| Get employee by ID | `GET` | `/hr/employees/{id}` |
| Update employee | `PUT` | `/hr/employees/{id}` |
| Delete employee | `DELETE` | `/hr/employees/{id}` |
| Create portal login for employee | `POST` | `/hr/employees/{id}/create-user` |
| Clock In | `POST` | `/hr/attendance/clock-in` |
| Clock Out | `POST` | `/hr/attendance/clock-out` |
| Today's attendance | `GET` | `/hr/attendance/today?employee_id={id}` |
| Attendance history | `GET` | `/hr/attendance/history?employee_id={id}` |
| Get payrolls | `GET` | `/hr/payrolls?page={n}` |
| Create payroll | `POST` | `/hr/payrolls` |
| Update payroll status | `PUT` | `/hr/payrolls/{id}` |
| Request loan | `POST` | `/hr/employee/loan/request` |
| Get employee loans | `GET` | `/hr/employee/{id}/loan/requests` |

---

## 🎨 Color Scheme

| Token | Hex | Usage |
|---|---|---|
| Primary 50 | `#eff6ff` | Light backgrounds |
| Primary 500 | `#3b82f6` | Buttons, links |
| Primary 600 | `#2563eb` | Hover states |
| Primary 700 | `#1d4ed8` | Active states |
| Gray 500 | `#6b7280` | Secondary text |
| Gray 900 | `#111827` | Primary text |
| Success | `#10b981` | Positive states |
| Warning | `#f59e0b` | Caution states |
| Error | `#ef4444` | Error states |
| Sidebar | `#1e293b` | Dark sidebar bg |

---

## 🗺️ Roadmap

- [ ] Leave management module
- [ ] Performance review system
- [ ] Employee document uploads
- [ ] Notifications system (real-time)
- [ ] Export reports (PDF / Excel)
- [ ] Dark mode toggle

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ for startups by **Sbresto Team**

</div>
