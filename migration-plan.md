# Bootstrap to Tailwind CSS Migration Plan

## Overview
This document outlines the systematic approach to migrate from Bootstrap to Tailwind CSS in the Open Chemistry Lab frontend application while preserving Material UI functionality.

## Phase 1: Preparation (Completed)
- Removed test Tailwind component from about page
- Refactored main app header and navigation components to use Tailwind classes instead of Bootstrap grid system

## Phase 2: Component-by-Component Migration

### 2.1 User Management Components
These components will be migrated to use Tailwind CSS classes:
- `/src/app/component/user_manager/login/login.component.html` *(First component - completed)*
- `/src/app/component/user_manager/register/register.component.html` 
- `/src/app/component/user_manager/profile/profile.component.html`
- `/src/app/component/user_manager/users/users.component.html`
- `/src/app/component/user_manager/add-user/add-user.component.html`
- `/src/app/component/user_manager/edit-user/edit-user.component.html`

### 2.2 Game Components
These components will be migrated to use Tailwind CSS classes:
- `/src/app/component/game/flashcard/flashcard.component.html`
- `/src/app/component/game/quiz/quiz.component.html`

### 2.3 Chemistry Lab Components
These components will be migrated to use Tailwind CSS classes:
- `/src/app/component/chemistry/experiment/experiment.component.html`
- `/src/app/component/chemistry/lab/lab.component.html`
- `/src/app/component/chemistry/experiment/validation-modal/validation-modal.component.html`
- `/src/app/component/chemistry/experiment/flask/flask.component.html`

### 2.4 Other Components
These components will be migrated to use Tailwind CSS classes:
- `/src/app/component/global-discoveries/global-discoveries.component.html`
- `/src/app/component/discoveries/discoveries.component.html`
- `/src/app/component/tabs/tabs.component.html`

## Phase 3: Material UI Preservation

### 3.1 Components That Must NOT Be Modified
The following Material UI components must preserve their functionality and styling:
- `mat-dialog` - Modal dialogs
- `mat-button` - Buttons with Material styling
- `mat-snackbar` - Notifications
- `mat-sidenav` - Side navigation
- `mat-icon` - Icons
- `mat-card` - Cards
- `mat-form-field` - Form fields

### 3.2 Special Considerations
- Navigation buttons that open dialogs (like login/register) should not be refactored as routes
- Interactive elements like the periodic table must remain unchanged
- All Material UI components must retain their functionality while using Tailwind for layout and styling

## Phase 4: Implementation Approach

### 4.1 Migration Strategy
1. Identify Bootstrap classes in each component
2. Replace with equivalent Tailwind CSS utility classes
3. Maintain same visual appearance and layout
4. Preserve all Material UI functionality
5. Test that components work correctly after migration

### 4.2 Key Patterns to Follow
- Use Tailwind's responsive utilities instead of Bootstrap's grid system
- Replace `col-*` classes with Tailwind's `w-*` and `flex-*` utilities
- Replace `btn-*` classes with Tailwind's button styling utilities
- Maintain Material UI component structure and functionality
- Avoid inline styles - use custom Tailwind classes instead

### 4.3 Testing Requirements
- Ensure all components render correctly
- Verify Material UI functionality remains intact
- Test responsive behavior
- Confirm no visual regressions

## Phase 5: Verification Process
After migrating each component:
1. Review the changes made
2. Run application to ensure no visual or functional regressions
3. Test that Material UI components still work as expected
4. Verify that all functionality is preserved
5. Only proceed to next component after successful verification

## Phase 6: Timeline
This migration will be completed in multiple steps, with each component being migrated systematically to ensure quality and maintainability.