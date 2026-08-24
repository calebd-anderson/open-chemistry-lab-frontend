# Migration Plan: Bootstrap to Tailwind CSS

## Overview
This document outlines the systematic approach to migrate the Open Chemistry Lab frontend application from Bootstrap to Tailwind CSS while preserving Material UI components and maintaining the chemistry-themed aesthetic.

## Migration Strategy
1. **Systematic Component-by-Component Approach**: Migrate one component at a time, testing after each change
2. **Preserve Material UI Components**: Keep all Angular Material components (mat-dialog, mat-button, etc.) intact
3. **Maintain Chemistry-Themed Aesthetic**: Follow the guidelines in CLAUDE.md for typography, color, and design
4. **Avoid Inline Styles**: Use Tailwind's utility classes instead of inline styles or simple wrapper classes
5. **Preserve Periodic Table Component**: Do not modify the periodic table component during this migration

## Migration Phases

### Phase 1: Core Application Components
- `src/app/app.component.html` - Right vertical flyout menu with animation
- `src/app/app.component.scss` - Menu animation and visibility control
- `src/app/app.component.ts` - Menu toggle functionality

### Phase 2: User Management Pages
- `src/app/component/user_manager/login/login.component.html`
- `src/app/component/user_manager/login/login.component.scss`
- `src/app/component/user_manager/register/register.component.html`
- `src/app/component/user_manager/register/register.component.scss`
- `src/app/component/user_manager/profile/profile.component.html`
- `src/app/component/user_manager/profile/profile.component.scss`

### Phase 3: Chemistry Lab Components
- `src/app/component/chemistry_lab/periodic_table/periodic_table.component.html`
- `src/app/component/chemistry_lab/periodic_table/periodic_table.component.scss`
- `src/app/component/chemistry_lab/molecule_builder/molecule_builder.component.html`
- `src/app/component/chemistry_lab/molecule_builder/molecule_builder.component.scss`

### Phase 4: Game Components
- `src/app/component/game/quiz/quiz.component.html`
- `src/app/component/game/quiz/quiz.component.scss`
- `src/app/component/game/flashcard/flashcard.component.html`
- `src/app/component/game/flashcard/flashcard.component.scss`

### Phase 5: Other UI Components
- `src/app/component/shared/header/header.component.html`
- `src/app/component/shared/header/header.component.scss`
- `src/app/component/shared/footer/footer.component.html`
- `src/app/component/shared/footer/footer.component.scss`

## Implementation Guidelines

### CSS Migration Rules
1. **Use @apply directive**: Import Tailwind CSS using `@use "../../../tailwind.css";` in SCSS files
2. **Replace Bootstrap classes**: Convert all Bootstrap grid classes (col-sm-8, offset-2) to Tailwind equivalents
3. **Fix invalid classes**: Replace decimal values like h-1.5 with valid Tailwind classes (h-2)
4. **Maintain responsive design**: Use Tailwind's responsive prefixes (sm:, md:, lg:, xl:)
5. **Preserve Material UI**: Do not modify Angular Material components or their styling

### Component-Specific Considerations
1. **Right Vertical Flyout Menu**:
   - Only visible when user is logged in
   - Animates on click of profile image
   - Uses CSS transforms for smooth animation
   - Follows chemistry-themed color palette

2. **Profile Component**:
   - Migrated to Tailwind classes
   - Fixed invalid Tailwind class issues (h-1.5 → h-2, etc.)
   - Maintained Material UI functionality

3. **Quiz Component**:
   - Removed Bootstrap grid classes
   - Replaced with Tailwind equivalents
   - Preserved existing functionality

### Testing Requirements
1. **Build Verification**: Ensure both development and production builds work
2. **Functionality Testing**: Verify all components work as expected
3. **Responsive Design**: Test on different screen sizes
4. **Material UI Integration**: Confirm Angular Material components still work correctly

## Timeline and Milestones
- Phase 1: Complete core application components (2-3 hours)
- Phase 2: Complete user management pages (3-4 hours)
- Phase 3: Complete chemistry lab components (4-5 hours)
- Phase 4: Complete game components (2-3 hours)
- Phase 5: Complete other UI components (2-3 hours)
- Testing and Final Review: 2 hours

## Risk Mitigation
1. **Component Isolation**: Work on one component at a time to prevent cascading issues
2. **Backup Strategy**: Create git commits after each phase for easy rollback if needed
3. **Testing**: Run build tests after each migration step
4. **Documentation**: Keep detailed notes of changes made for future reference

## Success Criteria
1. All components compile without errors
2. Application functions as expected
3. Material UI components work correctly
4. Responsive design is maintained
5. Chemistry-themed aesthetic is preserved
6. No breaking changes to existing functionality