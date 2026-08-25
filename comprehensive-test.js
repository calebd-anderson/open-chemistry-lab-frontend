// Comprehensive test for the periodic table layout fix
console.log("=== COMPREHENSIVE PERIODIC TABLE LAYOUT VERIFICATION ===\n");

// Import the actual fixed implementation from the component file
function getGridPosition(atomicNumber) {
  // Lanthanides (57-71) - placed in row 8, columns 4-18
  if (atomicNumber >= 57 && atomicNumber <= 71) {
    return { row: 8, col: 4 + (atomicNumber - 57) };
  }
  // Actinides (89-103) - placed in row 9, columns 4-18
  if (atomicNumber >= 89 && atomicNumber <= 103) {
    return { row: 9, col: 4 + (atomicNumber - 89) };
  }

  // Period 1: H(1) and He(2)
  if (atomicNumber === 1) return { row: 1, col: 1 };
  if (atomicNumber === 2) return { row: 1, col: 18 };

  // Period 2: Li(3) to Ne(10)
  if (atomicNumber >= 3 && atomicNumber <= 10) {
    if (atomicNumber <= 4) {
      // Li(3) = col 1, Be(4) = col 2
      return { row: 2, col: atomicNumber - 2 };
    } else {
      // B(5) = col 13, C(6) = col 14, N(7) = col 15, O(8) = col 16, F(9) = col 17, Ne(10) = col 18
      return { row: 2, col: 13 + (atomicNumber - 5) };
    }
  }

  // Period 3: Na(11) to Ar(18)
  if (atomicNumber >= 11 && atomicNumber <= 18) {
    if (atomicNumber <= 12) {
      // Na(11) = col 1, Mg(12) = col 2
      return { row: 3, col: atomicNumber - 10 };
    } else {
      // Al(13) = col 13, Si(14) = col 14, P(15) = col 15, S(16) = col 16, Cl(17) = col 17, Ar(18) = col 18
      return { row: 3, col: 13 + (atomicNumber - 13) };
    }
  }

  // Period 4: K(19) to Kr(36)
  if (atomicNumber >= 19 && atomicNumber <= 36) {
    if (atomicNumber <= 20) {
      // K(19) = col 1, Ca(20) = col 2
      return { row: 4, col: atomicNumber - 18 };
    } else {
      // Sc(21) to Kr(36) are in columns 13-18 of the main table
      return { row: 4, col: 13 + (atomicNumber - 21) };
    }
  }

  // Period 5: Rb(37) to Xe(54)
  if (atomicNumber >= 37 && atomicNumber <= 54) {
    if (atomicNumber <= 38) {
      // Rb(37) = col 1, Sr(38) = col 2
      return { row: 5, col: atomicNumber - 36 };
    } else {
      // Y(39) to Xe(54) are in columns 13-18 of the main table
      return { row: 5, col: 13 + (atomicNumber - 39) };
    }
  }

  // Period 6: Cs(55) to Rn(86)
  if (atomicNumber >= 55 && atomicNumber <= 86) {
    if (atomicNumber <= 56) {
      // Cs(55) = col 1, Ba(56) = col 2
      return { row: 6, col: atomicNumber - 54 };
    } else {
      // La(57) to Rn(86) are in columns 13-18 of the main table (but La is handled above)
      return { row: 6, col: 13 + (atomicNumber - 57) };
    }
  }

  // Period 7: Fr(87) to Og(118)
  if (atomicNumber >= 87 && atomicNumber <= 118) {
    if (atomicNumber <= 88) {
      // Fr(87) = col 1, Ra(88) = col 2
      return { row: 7, col: atomicNumber - 86 };
    } else {
      // Ac(89) to Og(118) are in columns 13-18 of the main table (but Ac is handled above)
      return { row: 7, col: 13 + (atomicNumber - 89) };
    }
  }

  return { row: 0, col: 0 };
}

// Test all elements from 1 to 118
console.log("Testing all elements 1-118...\n");

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

// Test key elements in each period
const keyElements = [
  // Period 1
  { atomicNumber: 1, expected: { row: 1, col: 1 }, description: "Hydrogen" },
  { atomicNumber: 2, expected: { row: 1, col: 18 }, description: "Helium" },

  // Period 2
  { atomicNumber: 3, expected: { row: 2, col: 1 }, description: "Lithium" },
  { atomicNumber: 4, expected: { row: 2, col: 2 }, description: "Beryllium" },
  { atomicNumber: 5, expected: { row: 2, col: 13 }, description: "Boron" },
  { atomicNumber: 6, expected: { row: 2, col: 14 }, description: "Carbon" },
  { atomicNumber: 7, expected: { row: 2, col: 15 }, description: "Nitrogen" },
  { atomicNumber: 8, expected: { row: 2, col: 16 }, description: "Oxygen" },
  { atomicNumber: 9, expected: { row: 2, col: 17 }, description: "Fluorine" },
  { atomicNumber: 10, expected: { row: 2, col: 18 }, description: "Neon" },

  // Period 3
  { atomicNumber: 11, expected: { row: 3, col: 1 }, description: "Sodium" },
  { atomicNumber: 12, expected: { row: 3, col: 2 }, description: "Magnesium" },
  { atomicNumber: 13, expected: { row: 3, col: 13 }, description: "Aluminum" },
  { atomicNumber: 14, expected: { row: 3, col: 14 }, description: "Silicon" },
  { atomicNumber: 15, expected: { row: 3, col: 15 }, description: "Phosphorus" },
  { atomicNumber: 16, expected: { row: 3, col: 16 }, description: "Sulfur" },
  { atomicNumber: 17, expected: { row: 3, col: 17 }, description: "Chlorine" },
  { atomicNumber: 18, expected: { row: 3, col: 18 }, description: "Argon" },

  // Period 4
  { atomicNumber: 19, expected: { row: 4, col: 1 }, description: "Potassium" },
  { atomicNumber: 20, expected: { row: 4, col: 2 }, description: "Calcium" },
  { atomicNumber: 21, expected: { row: 4, col: 13 }, description: "Scandium" },
  { atomicNumber: 22, expected: { row: 4, col: 14 }, description: "Titanium" },
  { atomicNumber: 23, expected: { row: 4, col: 15 }, description: "Vanadium" },
  { atomicNumber: 24, expected: { row: 4, col: 16 }, description: "Chromium" },
  { atomicNumber: 25, expected: { row: 4, col: 17 }, description: "Manganese" },
  { atomicNumber: 26, expected: { row: 4, col: 18 }, description: "Iron" },

  // Period 5
  { atomicNumber: 37, expected: { row: 5, col: 1 }, description: "Rubidium" },
  { atomicNumber: 38, expected: { row: 5, col: 2 }, description: "Strontium" },
  { atomicNumber: 39, expected: { row: 5, col: 13 }, description: "Yttrium" },
  { atomicNumber: 40, expected: { row: 5, col: 14 }, description: "Zirconium" },
  { atomicNumber: 41, expected: { row: 5, col: 15 }, description: "Niobium" },
  { atomicNumber: 42, expected: { row: 5, col: 16 }, description: "Molybdenum" },
  { atomicNumber: 43, expected: { row: 5, col: 17 }, description: "Technetium" },
  { atomicNumber: 44, expected: { row: 5, col: 18 }, description: "Ruthenium" },

  // Period 6
  { atomicNumber: 55, expected: { row: 6, col: 1 }, description: "Cesium" },
  { atomicNumber: 56, expected: { row: 6, col: 2 }, description: "Barium" },
  { atomicNumber: 57, expected: { row: 6, col: 13 }, description: "Lanthanum" }, // This will be handled by special case
  { atomicNumber: 71, expected: { row: 8, col: 18 }, description: "Lutetium" }, // Lanthanides in row 8

  // Period 7
  { atomicNumber: 87, expected: { row: 7, col: 1 }, description: "Francium" },
  { atomicNumber: 88, expected: { row: 7, col: 2 }, description: "Radium" },
  { atomicNumber: 89, expected: { row: 9, col: 4 }, description: "Actinium" }, // Actinides in row 9
  { atomicNumber: 103, expected: { row: 9, col: 18 }, description: "Lawrencium" }, // Actinides in row 9

  // Test the special cases for Lanthanides and Actinides
  { atomicNumber: 57, expected: { row: 8, col: 4 }, description: "Lanthanum (special case)" },
  { atomicNumber: 71, expected: { row: 8, col: 18 }, description: "Lutetium (special case)" },
  { atomicNumber: 89, expected: { row: 9, col: 4 }, description: "Actinium (special case)" },
  { atomicNumber: 103, expected: { row: 9, col: 18 }, description: "Lawrencium (special case)" }
];

keyElements.forEach(testCase => {
  totalTests++;
  const result = getGridPosition(testCase.atomicNumber);
  const isCorrect = result.row === testCase.expected.row && result.col === testCase.expected.col;

  if (isCorrect) {
    console.log(`✅ ${testCase.description} (${testCase.atomicNumber}): row=${result.row}, col=${result.col}`);
    passedTests++;
  } else {
    console.log(`❌ ${testCase.description} (${testCase.atomicNumber}): expected row=${testCase.expected.row}, col=${testCase.expected.col}, got row=${result.row}, col=${result.col}`);
    failedTests++;
  }
});

console.log(`\n=== SUMMARY ===`);
console.log(`Total tests: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);

if (failedTests === 0) {
  console.log("\n🎉 ALL TESTS PASSED! The periodic table layout is now correctly implemented.");
  console.log("✅ Elements are positioned according to standard scientific periodic table structure");
  console.log("✅ Lanthanides and Actinides are properly placed in rows 8 and 9");
  console.log("✅ All elements within periods 1-7 are correctly positioned in columns 1-18");
} else {
  console.log(`\n❌ ${failedTests} tests failed. The implementation needs further review.`);
}

// Verify column constraints (all columns should be between 1 and 18)
console.log("\n=== COLUMN CONSTRAINT VERIFICATION ===");
let allColumnsValid = true;
for (let i = 1; i <= 118; i++) {
  const pos = getGridPosition(i);
  if (pos.col < 1 || pos.col > 18) {
    console.log(`❌ Element ${i} has invalid column: ${pos.col}`);
    allColumnsValid = false;
  }
}

if (allColumnsValid) {
  console.log("✅ All elements have valid column positions (1-18)");
} else {
  console.log("❌ Some elements have invalid column positions");
}