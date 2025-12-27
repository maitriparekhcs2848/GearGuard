# GearGuard

GearGuard is a comprehensive full-stack equipment management system designed to streamline the tracking, maintenance, and organization of equipment within teams. It provides a user-friendly interface for managing equipment inventory, handling maintenance requests, organizing teams, and generating reports.

## Features

- **Equipment Management**: Track equipment details, status, health scores, and maintenance history
- **Team Organization**: Manage teams and assign equipment to team members
- **Request System**: Submit and track maintenance requests with status updates
- **Dashboard**: Overview of key metrics, activity timeline, and system statistics
- **Kanban Board**: Visual task management for requests and maintenance workflows
- **Calendar View**: Schedule and track maintenance activities
- **Reports**: Generate insights and analytics on equipment usage and performance
- **Authentication**: Secure user authentication with JWT tokens
- **Responsive Design**: Modern, responsive UI with dark/light theme support

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **UUID** - Unique identifier generation

### Frontend
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **ShadCN UI** - Component library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Data Storage
- JSON files (for development/demo purposes)

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn or bun

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd GearGuard-testing
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

## Usage

### Development

1. Start the backend server:
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:5000`

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173` (default Vite port)

3. Open your browser and navigate to `http://localhost:5173`

### Production Build

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. The built files will be in the `frontend/dist` directory

## API Endpoints

### Authentication
- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration

### Equipment (Protected)
- `GET /api/equipment` - Get all equipment
- `POST /api/equipment` - Create new equipment
- `GET /api/equipment/:id` - Get equipment by ID
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment

### Teams (Protected)
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create new team
- `GET /api/teams/:id` - Get team by ID
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team

### Requests (Protected)
- `GET /api/requests` - Get all requests
- `POST /api/requests` - Create new request
- `GET /api/requests/:id` - Get request by ID
- `PUT /api/requests/:id` - Update request
- `DELETE /api/requests/:id` - Delete request

### Dashboard (Protected)
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/activity` - Get activity timeline

## Project Structure

```
GearGuard-testing/
├── backend/
│   ├── src/
│   │   ├── app.ts              # Express app setup
│   │   ├── server.ts           # Server entry point
│   │   ├── middleware/
│   │   │   └── auth.ts         # Authentication middleware
│   │   ├── routes/
│   │   │   ├── equipment.routes.ts
│   │   │   ├── teams.routes.ts
│   │   │   ├── requests.routes.ts
│   │   │   ├── dashboard.routes.ts
│   │   │   └── user.routes.ts
│   │   ├── services/
│   │   │   ├── equipment.service.ts
│   │   │   ├── teams.service.ts
│   │   │   ├── requests.service.ts
│   │   │   └── user.service.ts
│   │   ├── utils/
│   │   │   ├── errors.ts
│   │   │   ├── lifecycle.ts
│   │   │   └── response.ts
│   │   └── data/
│   │       ├── db.ts
│   │       ├── equipment.json
│   │       ├── requests.json
│   │       ├── teams.json
│   │       └── users.json
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/             # ShadCN UI components
│   │   │   ├── layout/         # Layout components
│   │   │   ├── common/         # Common components
│   │   │   ├── dashboard/      # Dashboard components
│   │   │   ├── equipment/      # Equipment components
│   │   │   ├── teams/          # Teams components
│   │   │   └── requests/       # Requests components
│   │   ├── pages/              # Page components
│   │   ├── contexts/           # React contexts
│   │   ├── hooks/              # Custom hooks
│   │   ├── lib/                # Utilities
│   │   └── types/              # TypeScript types
│   ├── public/                 # Static assets
│   ├── package.json
│   └── vite.config.ts
├── .gitignore
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
