# Periodic Table Layout Analysis

## Standard Periodic Table Structure (18-column grid)

The periodic table has 7 periods (rows) and is organized into:
- Period 1: H, He (2 elements)
- Period 2: Li, Be, B, C, N, O, F, Ne (8 elements) 
- Period 3: Na, Mg, Al, Si, P, S, Cl, Ar (8 elements)
- Period 4: K, Ca, Sc, Ti, V, Cr, Mn, Fe, Co, Ni, Cu, Zn, Ga, Ge, As, Se, Br, Kr (18 elements)
- Period 5: Rb, Sr, Y, Zr, Nb, Mo, Tc, Ru, Rh, Pd, Ag, Cd, In, Sn, Sb, Te, I, Xe (18 elements)
- Period 6: Cs, Ba, La, Hf, Ta, W, Re, Os, Ir, Pt, Au, Hg, Tl, Pb, Bi, Po, At, Rn (18 elements)
- Period 7: Fr, Ra, Ac, Rf, Db, Sg, Bh, Hs, Mt, Ds, Rg, Cn, Nh, Fl, Mc, Lv, Ts, Og (18 elements)

## Lanthanides and Actinides
- Lanthanides (57-71): La, Ce, Pr, Nd, Pm, Sm, Eu, Gd, Tb, Dy, Ho, Er, Tm, Yb, Lu (15 elements)
  - Placed in row 8, columns 4-18 (positions 4-18 of row 8)
- Actinides (89-103): Ac, Th, Pa, U, Np, Pu, Am, Cm, Bk, Cf, Es, Fm, Md, No, Lr (15 elements)  
  - Placed in row 9, columns 4-18 (positions 4-18 of row 9)

## Current Issues in getGridPosition Method

Looking at the current implementation:
1. Period 2: atomicNumber >= 3 && <= 10 maps to row 2, but the column calculation is complex
2. Period 3: atomicNumber >= 11 && <= 18 maps to row 3, but the column calculation is complex  
3. The logic for periods 6 and 7 has special cases that don't work properly

## Key Problems Identified:
1. Elements like Li (atomic number 3) should be at row 2, col 1
2. Elements like Be (atomic number 4) should be at row 2, col 2
3. The logic for calculating columns is inconsistent and error-prone
4. Lanthanides/Actinides overlap with main periods in the conditions

## Correct Approach:
Instead of complex conditional logic, implement a cleaner mapping approach:
1. Handle special cases (Lanthanides and Actinides first)
2. Map period numbers directly to rows (Period 1 = row 1, Period 2 = row 2, etc.)
3. Calculate column positions based on the atomic number within that period
4. Use a lookup or simple arithmetic instead of complex nested conditions

## Test Cases:
- H (1): row 1, col 1
- He (2): row 1, col 18  
- Li (3): row 2, col 1
- Be (4): row 2, col 2
- B (5): row 2, col 3
- Ne (10): row 2, col 10
- Na (11): row 3, col 1
- Mg (12): row 3, col 2
- Al (13): row 3, col 3
- Ar (18): row 3, col 10
- Sc (21): row 4, col 3
- La (57): row 8, col 4
- Ac (89): row 9, col 4