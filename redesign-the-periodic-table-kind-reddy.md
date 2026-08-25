---
name: redesign-periodic-table
description: Redesign the periodic table using PubChem API and CSS Grid
metadata:
  type: project
---

# Redesign the periodic table using PubChem API and CSS Grid

## Context
The current periodic table implementation uses a custom SASS-based layout where element positions are manually specified via CSS classes (e.testing, `c3 r6`). This is difficult to maintain and lacks flexibility. Additionally, the data is currently fetched from a local API. The goal is to switch to the PubChem API for a more reliable data source and use a robust CSS Grid layout for the periodic table.

## Implementation Plan

### 1. Data Layer Update (`src/app/service/element.service.ts`) [COMPLETED]
- Replace the current `getElements()` implementation to fetch data from `https://pubchem.ncbi.nlm.nih.gov/rest/pug/periodictable/JSON`.
- Implement a mapper to convert the PubChem `Cell` array into the `Element` interface.
- Since the PubChem API doesn't provide all the fields in the `Element` interface (e.g., `cPKHexColor`, `electronConfiguration`), I will provide default or calculated values.
- I will use the `GroupBlock` and `AtomicNumber` from the API to help with grid positioning.

### 2. Component Template Update (`src/app/component/chemistry/periodic-table/periodic-table.component.html`)
- Refactor the template to use CSS Grid-friendly properties.
- Use `[style.grid-column]` and `[style.grid-row]` for element positioning, derived from the element's data.
- Remove the manual `placeholder` divs for lanthanoids and actinoids, as the grid will handle the empty spaces naturally.
- Keep the `key` (legend) at the bottom, updated to reflect any changes in the data structure.

### 3. Component Logic Update (`src/app/component/chemistry/periodic-table/periodic-table.component.ts`)
- Update the `ngOnInit` method to calculate `grid-column` and `grid-row` for each element after fetching them from `ElementService`.
- Implement a robust mapping logic using `AtomicNumber` and `GroupBlock` to determine the correct CSS Grid position.
- Ensure that the `Element` interface's `tablePosition` property (or new properties) is updated with the calculated grid values.
- Handle the special positioning for lanthanoids and actinoids to ensure they appear in their designated rows (e.g., rows 6 and 7) even if they are part of the main element list.
- Ensure `selectElement` and other interactions remain functional.

### 4. Styling Update (`src/app/component/chemistry/periodic-table/periodic-table.component.sass`)
- Clean up the `.periodic-table` CSS to remove the manual `r#{$i}` and `c#{$i}` class-based positioning.
- Define a standard 18-column CSS Grid for the `.periodic-table` container.
- Maintain the existing beautiful aesthetics, including the element colors, transitions, and hover effects.

## Critical Files
- `src/app/service/element.service.ts`
- `src/app/component/chemistry/periodic-table/periodic-table.component.ts`
- `src/app/component/chemistry/periodic-table/periodic-table.component.html`
- `src/app/component/chemistry/periodic-table/periodic-table.component.sass`

## Verification
- Run the application and verify the periodic table loads with data from the PubChem API.
- Confirm that the elements are correctly positioned in an 18-column grid.
- Verify that clicking an element still triggers the correct selection event.
- Check that the color-coding by group/block is correctly applied.
- Ensure that the transition and hover effects are still working as intended.
