# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a frontend application for an open chemistry lab platform built with Angular 22. The application features:

- A responsive UI using Bootstrap 5.3.8 and Angular Material
- User authentication and authorization system
- Chemistry lab simulation components
- Interactive educational tools like quizzes and flashcards
- Profile management and user administration

## Key Technologies

- Angular 22 (with Angular CLI 13.2.5 upgraded to v22)
- TypeScript 5.9.3
- Bootstrap 5.3.8
- Angular Material for UI components
- GSAP for animations
- Karma for unit testing

## Development Setup

### Prerequisites
- Node.js v. 24 (recommended via nvm)
- npm package manager

### Common Commands

```bash
# Start development server
ng serve

# Build for development
ng build --configuration development

# Build for production
ng build --configuration production

# Run unit tests
ng test

# Run end-to-end tests
ng e2e

# Generate new components, services, etc.
ng generate component component-name
ng generate service service-name
```

## Project Structure

The main application structure is organized as follows:

- `src/app/` - Main application code
  - `component/` - UI components organized by feature (chemistry lab, user management, games, etc.)
  - `service/` - Application services for data handling and business logic
  - `model/` - Data models and interfaces
  - `app.component.ts` - Main application component with routing and authentication logic
  - `app-routes.ts` - Application routing configuration
  - `app.config.ts` - Angular application configuration

## Key Features

- User authentication and authorization system using JWT tokens
- Chemistry lab simulation with interactive elements
- Educational tools including quizzes and flashcards
- Profile management for users
- Admin functionality for user management
- Responsive design using Bootstrap and Angular Material

## Authentication Flow

The application uses a guard-based authentication system:
- `AuthenticationGuard` - Checks if user is logged in
- `AuthorizationGuard` - Checks if user has proper permissions (admin)
- Authentication service handles token storage and retrieval
- User management components include login, registration, and profile pages

## Testing

Unit tests are run using Karma with Jasmine. Tests are organized alongside the code they test in the same directory structure.

## Styling

The application uses:
- SCSS for styling
- Bootstrap 5.3.8 for responsive layout
- Angular Material components for UI elements
- Custom styles for specific components

## Security

- JWT-based authentication
- HTTP interceptors for adding authentication headers
- Route guards to protect protected routes