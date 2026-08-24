# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## App Purpose Overview
This is an Angular 21/22 frontend for backend. The backend is a Spring Boot API in a different repository. The purpose for the app is a fun yet educational chemistry web app featuring an interactive periodic table of elements allowing users to create molecules/compounds and learn about their properties based on different combinations of elements from the periodic table. The anonymous mode allows anyone who visits the website to experiment with chemistry by manipulating the interactive periodic table of elements. The authenticated mode allows users to save their molecule/compound discoveries to their account.

## Project Overview

This is a frontend application for an open chemistry lab platform built with Angular 22. The application features:

- A responsive UI using Tailwind CSS and Angular Material
- User authentication and authorization system
- Chemistry lab simulation components
- Interactive educational tools like quizzes and flashcards
- Profile management and user administration

## Key Technologies

- Angular 22 (with Angular CLI 13.2.5 upgraded to v22)
- TypeScript 5.9.3
- Tailwind CSS
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

NOTE: Automated testing is currently not implemented for this project. As such, do not attempt to run automated tests as part of the development process. Manual verification and build checks should be used instead.

## Styling

The application uses:
- SCSS for styling
- Tailwind CSS for responsive layout
- Angular Material components for UI elements
- Custom styles for specific components

## Security

- JWT-based authentication
- HTTP interceptors for adding authentication headers
- Route guards to protect protected routes

## Frontend Aesthetics
You tend to converge toward generic, "on distribution" outputs. In frontend design, this creates what users call the "AI slop" aesthetic. Avoid this: make creative, distinctive frontends that surprise and delight. Focus on:

Typography: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics.

Color & Theme: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes. Draw from IDE themes and cultural aesthetics for inspiration.

Motion: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions.

Backgrounds: Create atmosphere and depth rather than defaulting to solid colors. Layer CSS gradients, use geometric patterns, or add contextual effects that match the overall aesthetic.

Avoid generic AI-generated aesthetics:
- Overused font families (Inter, Roboto, Arial, system fonts)
- Clichéd color schemes (particularly purple gradients on white backgrounds)
- Predictable layouts and component patterns
- Cookie-cutter design that lacks context-specific character

Interpret creatively and make unexpected choices that feel genuinely designed for the context. Vary between light and dark themes, different fonts, different aesthetics. You still tend to converge on common choices (Space Grotesk, for example) across generations. Avoid this: it is critical that you think outside the box!

## Using Tailwind CSS
When using Tailwind CSS in SCSS or Sass stylesheets, you'll need to import the src/tailwind.css file with `@use "@/tailwind.css";` or from a component you'll need to map the path to where 'tailwind.css' actually is. The application has been configured to support this usage pattern.

For components that use Tailwind CSS classes in SCSS files, follow this pattern:
1. Import Tailwind at the top of your SCSS file using `@use "@/tailwind.css";` (this works regardless of component nesting level due to tsconfig path mapping)
2. Use Tailwind's @apply directive to apply utility classes within your custom styles

Example:
```scss
@use "@/tailwind.css";

article {
    margin: 2rem;
}

/* Tailwind CSS test */
.tailwind-test {
    @apply bg-yellow-100 border border-yellow-400 text-yellow-700 p-4 rounded mt-4;
}
```

This ensures Tailwind's utility classes are available for use in your component styles.