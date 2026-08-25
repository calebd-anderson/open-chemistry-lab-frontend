# Fix Periodic Table Grid Layout

## Context
The periodic table grid layout is currently incorrect. Elements are being placed in the wrong columns because the `getGridPosition` logic in `periodic-table.component.ts` has incorrect arithmetic for the beginning of several periods (e.g., Lithium and Beryllium are shifted). The layout is driven by hardcoded logic in the component and an 18-column CSS grid.

## Approach
Refactor the `getGridPosition` method in `src/app/component/chemistry/periodic-table/periodic-table.component.ts` to use a more reliable mapping of atomic numbers to their respective rows and columns in an 18-column grid.

### Implementation Steps
1.  **Refactor `getGridPosition`**:
    *   Implement a mapping that correctly places elements in an 18-column grid.
    *   Ensure Period 1 (H, He) is correctly placed at (1,1) and (1,18).
    *   Ensure Period 2 (Li, Be, B... Ne) is correctly placed at (2,1), (2,2), (int 13-18).
    *   Ensure Period 3 (Na, Mg, Al... Ar) is correctly placed at (3,1), (3,2), (int 13-18).
    *   Continue this for all periods (4, 5, 6, 7).
    *   Maintain the separate handling for Lanthanides (row 8) and Actinides (row 9) but ensure they are correctly aligned with the columns.
    *   Fix the specific errors found where the current logic shifts elements (e.g., Li at col 2 instead of 1).

2.  **Verification**:
    *   Manually trace the `getGridPosition` logic for key elements:
        *   H (1): (1, 1)
        *   He (2): (1, 18)
        *   Li (3): (2, 1)
        *   Be (4): (2, 2)
        *   B (5): (2, 13)
        *   Ne (10): (2, 18)
        *   Na (11): (3, 1)
        *   Mg (12): (3, 2)
        *   Al (13): (3, 13)
        *   Ar (18): (3, 18)
        *   Sc (21): (4, 3) - wait, Sc is group 3.
        *   ...and so on.
    *   Confirm that the 18-column CSS grid in `periodic-table.component.sass` is sufficient.

## Files to Modify
- `src/app/component/chemistry/periodic-table/periodic-table.component.ts`

## Verification Plan
Perform a manual code review of the new `getGridPosition` logic to ensure it correctly maps atomic numbers to the 18-column periodic table structure.
