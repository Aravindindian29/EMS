# Employee Details Management System

A full-stack employee management application with a glossy UI featuring a professional Red & Gold color scheme.

## Features

- ✅ **Authentication**: Signup, Login, Password Reset with JWT tokens
- ✅ **Dashboard**: Real-time headcount statistics (Full Time, Interns, Contract)
- ✅ **Employee Management**: View, search, filter, and export employee data
- ✅ **Exit Trends**: Quarterly exit analysis with interactive charts
- ✅ **Team Analytics**: Team-wise employee distribution
- ✅ **Admin Panel**: Bulk import employees from CSV/Excel
- ✅ **Role-Based Access**: Admin and User roles with different permissions
- ✅ **Glossy UI**: Modern professional interface with red and gold colors

## Tech Stack

### Backend
- Django 5.0
- Django REST Framework
- JWT Authentication (Simple JWT)
- SQLite Database
- CORS Headers
- Pandas & OpenPyXL for data import/export

### Frontend
- React 18
- Vite
- TailwindCSS (with custom glossy red & gold theme)
- Recharts for data visualization
- Axios for API calls
- React Router for navigation
- Lucide React for icons

## Installation

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Run migrations:
```bash
python manage.py migrate
```

4. Populate sample data:
```bash
python manage.py populate_data
```

5. Start the Django server:
```bash
python manage.py runserver
```

Backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install Node dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Default Credentials

After running `populate_data`, use these credentials:

- **Admin User**: 
  - Username: `admin`
  - Password: `admin123`

- **Regular User**:
  - Username: `user`
  - Password: `user123`

## API Endpoints

### Authentication
- `POST /api/auth/signup/` - Create new account
- `POST /api/auth/login/` - Login
- `POST /api/auth/token/refresh/` - Refresh JWT token
- `POST /api/auth/password-reset/` - Request password reset
- `POST /api/auth/password-reset/confirm/` - Confirm password reset

### Dashboard
- `GET /api/dashboard/stats/` - Get headcount statistics

### Employees
- `GET /api/employees/` - List all employees (with filters)
- `POST /api/employees/` - Create employee (Admin only)
- `GET /api/employees/{id}/` - Get employee details
- `PUT /api/employees/{id}/` - Update employee (Admin only)
- `DELETE /api/employees/{id}/` - Delete employee (Admin only)
- `POST /api/employees/import_employees/` - Bulk import (Admin only)
- `GET /api/employees/export/` - Export to CSV/Excel

### Teams
- `GET /api/teams/` - List all teams
- `POST /api/teams/` - Create team (Admin only)
- `GET /api/teams/export/` - Export teams to CSV

### Exit Trends
- `GET /api/exit-trends/?year=2026` - Get quarterly exit trends

## Features Overview

### 1. Dashboard
- Total headcount by employee type
- Visual stat cards with glossy effects
- Percentage breakdowns
- Real-time data updates

### 2. Active Employees Page
- Searchable employee table
- Filters by type, status, and team
- Pagination (50 rows per page)
- Export to CSV/Excel
- Admin: Add, Edit, Delete employees
- Displays: Employee ID, Title, Name, Email, Joining Date, Tenure, Prior Experience, Type, Status, Reporting To, Team, VP India

### 3. Exit Trends Page
- Quarterly exit data table
- Bar chart: Voluntary vs Terminations comparison
- Pie chart: Overall distribution
- Line chart: Difference between voluntary and terminations
- Year filter
- Export functionality

### 4. Team Wise Count Page
- Team listing with employee counts
- Search by team name or team heads
- Horizontal bar chart visualization
- Export to CSV
- Displays: US Team Head, India Head, Team Name, Employee Count

### 5. Admin Panel
- Bulk import employees from CSV/Excel
- Drag-and-drop file upload
- Import validation and error reporting
- Detailed import instructions

## Glossy Red & Gold Theme

The application features a custom glossy theme with:

- **Primary Colors**: 
  - Primary Red: `#C8102E`
  - Accent Gold: `#FFD700`
  - Dark Background: `#1A1A1A`

- **Glossy Effects**:
  - Gradient backgrounds
  - Box shadows with glow effects
  - Backdrop blur
  - Hover animations
  - Pulse effects
  - Smooth transitions

- **Components**:
  - Glossy cards with shine effects
  - Gradient buttons with hover animations
  - Glossy input fields
  - Themed tables with alternating rows
  - Custom scrollbars

## Project Structure

```
employee-management/
├── backend/
│   ├── config/
│   │   ├── settings.py
│   │   └── urls.py
│   ├── employees/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── permissions.py
│   │   └── management/commands/populate_data.py
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/layout/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ActiveEmployees.jsx
│   │   │   ├── ExitTrends.jsx
│   │   │   ├── TeamWiseCount.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── services/api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

## Sample Data

The `populate_data` command creates:
- 2 users (1 admin, 1 regular user)
- 7 teams
- 60 employees (mix of Full Time, Interns, Contracts)
- ~20% exited employees with exit dates and types

## Development

- Backend runs on port 8000
- Frontend runs on port 5173
- CORS is configured for local development
- JWT tokens expire after 5 hours
- Refresh tokens expire after 1 day

## License

MIT License
