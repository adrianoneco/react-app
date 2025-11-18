# Authentication System (Sistema de Autenticação)

## Overview

This is a bilingual (Portuguese) full-stack authentication and user management system built with React, Express, and PostgreSQL. The application features a modern gradient-based design system with seamless light/dark mode switching. Users can register, login, and perform CRUD operations on user records through an intuitive dashboard interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tools**
- React 18+ with TypeScript for type-safe component development
- Vite as the build tool and development server for fast hot module replacement
- Wouter for lightweight client-side routing (replacing React Router)

**UI Component Library**
- Shadcn/ui components built on Radix UI primitives for accessible, customizable components
- Tailwind CSS for utility-first styling with custom design tokens
- Custom gradient theme system (blue to purple vertical gradients) as signature visual element

**State Management**
- React Context API for global state (authentication and theme)
- TanStack Query (React Query) for server state management, caching, and data synchronization
- React Hook Form with Zod validation for type-safe form handling

**Design System**
- Bilingual interface (Portuguese - pt-BR) for all user-facing content
- Dual theme support (light/dark) with smooth CSS transitions
- Inter font family from Google Fonts for modern typography
- Gradient-based visual identity using Tailwind gradient utilities

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for type-safe API development
- RESTful API design with route modularization in `/server/routes.ts`

**Authentication & Security**
- JWT (jsonwebtoken) for stateless authentication with 7-day token expiration
- bcrypt.js for password hashing with salt rounds
- Cookie-based token storage with HTTP-only cookies for security
- Middleware-based authentication guards (`authenticateToken`)

**Database Layer**
- Drizzle ORM for type-safe database queries and migrations
- PostgreSQL via Neon serverless driver for scalable cloud database
- Database abstraction through `IStorage` interface pattern in `/server/storage.ts`
- Schema-first approach with Zod validation matching database constraints

**File Upload System**
- Multer middleware for multipart form data handling
- MinIO object storage for avatar/profile image uploads
- Automatic bucket creation and management

**Activity Logging**
- Redis for real-time activity log storage
- Circular log buffer (1000 entries) using Redis lists
- User action tracking (login, registration, CRUD operations)

### Data Storage Solutions

**Primary Database (PostgreSQL)**
- User table with fields: id, firstName, lastName, birthDay, email, password (hashed), avatarUrl
- UUID primary keys using `gen_random_uuid()`
- Email uniqueness constraint for user authentication

**Object Storage (MinIO)**
- S3-compatible object storage for user-uploaded files
- Automatic bucket provisioning on application startup
- Support for both local and cloud deployment configurations

**Cache & Logs (Redis)**
- Activity log persistence using Redis lists
- Fast retrieval for recent user actions
- Connection retry strategy for resilience

### External Dependencies

**Cloud Services**
- Neon Database (Serverless PostgreSQL)
  - Connection pooling via `@neondatabase/serverless`
  - WebSocket-based connection for serverless compatibility
  
- MinIO (Object Storage)
  - Configured via environment variables (endpoint, access key, secret key)
  - Automatic SSL detection based on endpoint

- Redis (In-Memory Data Store)
  - Configured via host, port, and optional password
  - Used for activity logging and potential session management

**Third-Party Libraries**
- `@tanstack/react-query` - Server state synchronization
- `@radix-ui/*` - Accessible UI primitives (18+ packages)
- `zod` - Runtime type validation for forms and API data
- `drizzle-orm` & `drizzle-kit` - Type-safe ORM and migrations
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token generation and verification
- `multer` - File upload handling

**Development Tools**
- TypeScript for full-stack type safety
- ESBuild for server-side bundling
- Vite plugins for Replit integration (cartographer, dev-banner, runtime-error-modal)