# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development
- `npm start`: Start the development server (`ng serve`).
- `npm run build:dev`: Create a development build.
- `npm run watch`: Run build in watch mode.

### Testing
- `npm test`: Run unit tests using Karma and Jasmine.

### Building & Analysis
- `npm run build`: Create a production build.
- `npm run analyze`: Run a production build and launch the webpack bundle analyzer.
- `npm run analyze:quick`: Run a production build with minimal optimization and launch the analyzer.

## Architecture & Structure

This is an Angular 22 frontend application for the Open Chemistry Lab, following a layered architecture:

### Core Layers
- `src/app/component/`: UI components organized by domain.
- `src/app/model/`: TypeScript models and interfaces (e.g., `element.model.ts`, `user.ts`).
- `src/app/service/`: Business logic and data services (e.g., `element.service.ts`, `authentication.service.ts`).

### Key Domains
- **Chemistry (`src/app/component/chemistry/`)**: 
    - `periodic-table`: Interactive periodic table using GSAP animations.
    - `experiment`: Core logic for molecule/compound creation and validation.
    - `lab`: Orchestrates the overall laboratory experience.
- **User Management (`src/app/component/user_manager/`)**: Authentication (JWT-based), registration, and user profile management. Includes `AuthInterceptor` for secure API communication.
- **Learning (`src/app/component/game/`)**: Educational modules including `flashcard` and `quiz` components.
- **Discoveries (`src/app/component/discoveries/`)**: Browsing scientific findings and global discoveries.

### Styling & UI
- **Tailwind CSS**: Used for utility-first styling and layout.
- **Angular Material**: Used for complex UI components and theming.
- **GSAP**: Used for high-fidelity animations, particularly within the periodic table and experiment modules.
