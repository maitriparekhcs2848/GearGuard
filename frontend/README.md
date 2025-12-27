# GearGuard Frontend

This is the frontend application for GearGuard, a comprehensive equipment management system. Built with modern React technologies, it provides a user-friendly interface for managing equipment inventory, maintenance requests, teams, and analytics.

## Tech Stack

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
- **Next Themes** - Theme management

## Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or bun

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Development

Start the development server:
```bash
npm run dev
```

The application will run on `http://localhost:5173` (default Vite port).

## Build

Build for production:
```bash
npm run build
```

The built files will be in the `dist` directory.

## Features

- **Dashboard**: Overview with statistics and activity timeline
- **Equipment Management**: CRUD operations for equipment
- **Team Management**: Organize and manage teams
- **Request System**: Handle maintenance requests
- **Kanban Board**: Visual task management
- **Calendar View**: Schedule maintenance activities
- **Reports**: Analytics and insights
- **Authentication**: Secure login/registration
- **Responsive Design**: Works on desktop and mobile
- **Dark/Light Theme**: Theme switching support

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/             # ShadCN UI components
│   │   ├── layout/         # Layout components (Header, Sidebar, MainLayout)
│   │   ├── common/         # Common components (GlobalSearch, HealthScore, StatusBadge)
│   │   ├── dashboard/      # Dashboard components (ActivityTimeline, StatCard)
│   │   ├── equipment/      # Equipment components (EquipmentForm)
│   │   ├── teams/          # Teams components (TeamForm)
│   │   ├── requests/       # Requests components (RequestForm)
│   │   └── pages/          # Page components
│   ├── contexts/           # React contexts (AuthContext, DataContext, ThemeContext)
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utilities and mock data
│   ├── types/              # TypeScript type definitions
│   └── pages/              # Page components
├── public/                 # Static assets
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Environment Variables

Create a `.env` file in the frontend directory with:

```
VITE_API_URL=http://localhost:5000/api
```

## Contributing

1. Follow the existing code style and structure
2. Use TypeScript for type safety
3. Follow React best practices
4. Test your changes thoroughly
5. Update documentation as needed

## License

This project is part of GearGuard and follows the same license terms.
