# Final Plan: Fix Periodic Table Layout

## Context
The periodic table layout in the frontend is currently incorrect and does not follow the standard periodic table shape. The grid positioning for elements is broken, causing them to clump together instead of forming the characteristic periodic table structure. This change will implement a robust mapping from atomic number to CSS Grid coordinates.

## Implementation Approach

I will implement a precise mapping of each element's atomic number to its corresponding `grid-row` and `grid-column` in an 18-column CSS grid.

### 1. Component Logic Update
In `src/app/component/chemistry/periodic-table/periodic-table.component.ts`:
- Implement a robust `getGridPosition(atomicNumber: number)` method. This method will use a `switch` statement or a lookup table to return the correct `{ row, col }` for all 118 elements.
- Specifically handle:
  - The gaps in the first three periods.
  - The transition metals (columns 3-12).
  - The lanthanides and actinides (positioned in rows 8 and 9 respectively, to maintain the standard layout).
- Restore the `sortElements` method which was accidentally removed.

### 2. Template Update
In `src/app/component/chemistry/periodic-table/periodic-table.component.html`:
- Update the `@for` loop for element cards to include style bindings:
  - `[style.grid-row]="getGridPosition(element.atomicNumber).row"`
  - `[style.grid-column]="getGridPosition(element.atomicNumber).col"`

## Files to be Modified
- `src/app/component/chemistry/periodic-table/periodic-table.component.ts`
- `src/app/component/chemistry/periodic-table/periodic-table.component.html`

## Verification Plan
- **Visual Inspection**: Launch the application and verify that the periodic table displays the correct 18-column structure with elements in their standard positions (e.g., Hydrogen at 1,1, Helium at 1,18, etc.).
- **Completeness Check**: Ensure all 118 elements are rendered and correctly placed, particularly the lanthanides and actinides.
- **Functionality Check**: Verify that clicking on elements still triggers the `selectElement` event and that the "in experiment" styling works as expected.
