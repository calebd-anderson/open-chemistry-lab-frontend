---
name: periodic-table-refactor
description: Refactor periodic-table component to use Tailwind CSS and remove SASS/Material dependencies.
metadata:
  type: project
---

# Context
The `periodic-table` component currently relies on a complex SASS file (`periodic-table.component.sass`) for its layout, element styling, and the "dimming" effect when categories are toggled. The goal is to move as much of this styling as possible to Tailwind CSS to align with the project's new design system, while keeping the core functionality and the specialized dimming/animations intact.

# Approach

## 1. Refactor `periodic-table.component.html`
Update the HTML template to use Tailwind CSS utility classes for:
- The container (`periodic-table-container`)
- The grid structure (`periodic-table`)
- The element containers (`element`, `square`, `label`, `symbol`, etc.)
- The placeholder and gap elements.

The `element` class will still need to be dynamic to handle `element.tablePosition` and `element.groupBlock`, but the basic styling will be in Tailwind.

## 2. Refactor `periodic and component.sass`
Remove all styles that have been migrated to Tailwind.
Retain the specialized CSS logic that is difficult or overly verbose to represent in Tailwind:
- The complex sibling selectors for the category toggling effect (dimming elements and placeholders).
- The specific animation keyframes (if they can't be easily moved to Tailwind or a global CSS file).
- Any complex math-based animations (like the orbital animations if they were to be used).

## 3. Refactor `periodic-table.component.ts`
Ensure the component is cleaned up. If any logic was specifically tied to the old SASS classes, update it.

# Files to Modify
- `src/app/component/chemistry/periodic-table/periodic-table.component.html`
- `src/app/component/chemistry/periodic-table/periodic-table.component.sass`

# Verification
- Ensure the periodic table renders correctly in the grid.
- Verify that the "dimming" effect still works when selecting a category.
- Verify that the elements' specific positions and group blocks are still correctly applied.
- Ensure no broken layouts or missing styles.
