# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## App Summary
This is an Angular 21/22 frontend for backend. The backend is a Spring Boot API in a different repository. The purpose for the app is a fun yet educational chemistry web app featuring an interactive periodic table of elements allowing users to create molecules/compounds and learn about their properties based on different combinations of elements from the periodic table. The anonymous mode allows anyone who visits the website to experiment with chemistry by manipulating the interactive periodic table of elements. The authenticated mode allows users to save their molecule/compound discoveries to their account. 

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

#### Distilled aesthetics prompt
<frontend_aesthetics>
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
</frontend_aesthetics>
