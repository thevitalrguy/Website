# VITALR Technologies - Cybersecurity & Homelab Education Platform

## Overview

VITALR Technologies is a modern full-stack web application focused on cybersecurity and homelab education. The platform provides comprehensive documentation, guides, resources, and community features for learners and professionals interested in networking, security, system administration, and self-hosted infrastructure.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with a custom dark theme design system
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack Query for server state management

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API design with JSON responses
- **Development Mode**: Vite integration for hot module replacement in development

### Data Storage Solutions
- **Database**: PostgreSQL with Neon serverless database
- **ORM**: Drizzle ORM for type-safe database operations
- **Migration Strategy**: Drizzle Kit for schema migrations
- **Development Storage**: In-memory storage implementation for rapid prototyping

### Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **Current State**: Authentication system is prepared but not fully implemented

## Key Components

### Database Schema
The application defines four main entities:
- **Topics**: Core learning areas (networking, security, homelab, etc.)
- **Articles**: Educational content with metadata (featured status, read time, lab availability)
- **Resources**: Downloadable content (configs, scripts, tools)
- **Community Stats**: Platform metrics and engagement data

### Frontend Components
- **Layout Components**: Header with navigation, Footer with links and branding
- **Content Components**: Hero section, Featured topics grid, Latest content showcase
- **Interactive Elements**: Code examples with copy functionality, Community stats display
- **UI System**: Comprehensive component library based on Radix UI primitives

### API Endpoints
- Topics management (`/api/topics`, `/api/topics/:slug`)
- Articles management (`/api/articles`, `/api/articles/featured`, `/api/articles/topic/:topicId`)
- Resources management (prepared but not fully implemented)
- Community stats (`/api/community-stats`)

## Data Flow

1. **Client Requests**: React components use TanStack Query for data fetching
2. **API Layer**: Express.js routes handle HTTP requests and responses
3. **Storage Layer**: Drizzle ORM interfaces with PostgreSQL database
4. **Response Handling**: JSON responses with error handling middleware
5. **State Management**: TanStack Query handles caching, loading states, and data synchronization

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight routing for React

### UI and Styling
- **@radix-ui/***: Comprehensive set of unstyled, accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe utility for creating component variants
- **lucide-react**: Icon library for consistent iconography

### Development Tools
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-runtime-error-modal**: Development error handling

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized React application to `dist/public`
- **Backend**: esbuild compiles TypeScript server code to `dist/index.js`
- **Database**: Drizzle migrations handle schema updates

### Environment Configuration
- **Development**: Hot reload with Vite development server
- **Production**: Static file serving with Express.js
- **Database**: Environment-based connection string configuration

### Hosting Considerations
- Designed for deployment on platforms supporting Node.js applications
- Static assets served from Express.js in production
- Database migrations managed through Drizzle Kit CLI
- Environment variables required for database connection and session management