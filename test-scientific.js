// Test to verify the actual scientific periodic table structure

console.log("Analyzing scientific periodic table structure...\n");

// Let's look at a standard periodic table layout:
// Period 1: H(1)=col1, He(2)=col18
// Period 2: Li(3)=col1, Be(4)=col2, B(5)=col13, C(6)=col14, N(7)=col15, O(8)=col16, F(9)=col17, Ne(10)=col18
// Period 3: Na(11)=col1, Mg(12)=col2, Al(13)=col13, Si(14)=col14, P(15)=col15, S(16)=col16, Cl(17)=col17, Ar(18)=col18

// Now let's understand the correct implementation by looking at what we want:
const scientificPositions = {
  // Period 1
  1: { row: 1, col: 1 },   // H
  2: { row: 1, col: 18 },  // He

  // Period 2
  3: { row: 2, col: 1 },   // Li
  4: { row: 2, col: 2 },   // Be
  5: { row: 2, col: 13 },  // B
  6: { row: 2, col: 14 },  // C
  7: { row: 2, col: 15 },  // N
  8: { row: 2, col: 16 },  // O
  9: { row: 2, col: 17 },  // F
  10: { row: 2, col: 18 }, // Ne

  // Period 3
  11: { row: 3, col: 1 },   // Na
  12: { row: 3, col: 2 },   // Mg
  13: { row: 3, col: 13 },  // Al
  14: { row: 3, col: 14 },  // Si
  15: { row: 3, col: 15 },  // P
  16: { row: 3, col: 16 },  // S
  17: { row: 3, col: 17 },  // Cl
  18: { row: 3, col: 18 },  // Ar

  // Lanthanides (57-71)
  57: { row: 8, col: 4 },   // La
  71: { row: 8, col: 18 },  // Lu

  // Actinides (89-103)
  89: { row: 9, col: 4 },   // Ac
  103: { row: 9, col: 18 }, // Lr
};

// Now let's test what the current implementation actually produces:
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
      return { row: 2, col: 12 + (atomicNumber - 5) };
    }
  }

  // Period 3: Na(11) to Ar(18)
  if (atomicNumber >= 11 && atomicNumber <= 18) {
    if (atomicNumber <= 12) {
      // Na(11) = col 1, Mg(12) = col 2
      return { row: 3, col: atomicNumber - 10 };
    } else {
      // Al(13) = col 13, Si(14) = col 14, P(15) = col 15, S(16) = col 16, Cl(17) = col 17, Ar(18) = col 18
      return { row: 3, col: 12 + (atomicNumber - 13) };
    }
  }

  // Period 4: K(19) to Kr(36)
  if (atomicNumber >= 19 && atomicNumber <= 36) {
    if (atomicNumber <= 20) {
      // K(19) = col 1, Ca(20) = col 2
      return { row: 4, col: atomicNumber - 18 };
    } else {
      // Sc(21) to Kr(36) are in columns 13-18 of the main table
      return { row: 4, col: 12 + (atomicNumber - 21) };
    }
  }

  // Period 5: Rb(37) to Xe(54)
  if (atomicNumber >= 37 && atomicNumber <= 54) {
    if (atomicNumber <= 38) {
      // Rb(37) = col 1, Sr(38) = col 2
      return { row: 5, col: atomicNumber - 36 };
    } else {
      // Y(39) to Xe(54) are in columns 13-18 of the main table
      return { row: 5, col: 12 + (atomicNumber - 39) };
    }
  }

  // Period 6: Cs(55) to Rn(86)
  if (atomicNumber >= 55 && atomicNumber <= 86) {
    if (atomicNumber <= 56) {
      // Cs(55) = col 1, Ba(56) = col 2
      return { row: 6, col: atomicNumber - 54 };
    } else {
      // La(57) to Rn(86) are in columns 13-18 of the main table (but La is handled above)
      return { row: 6, col: 12 + (atomicNumber - 57) };
    }
  }

  // Period 7: Fr(87) to Og(118)
  if (atomicNumber >= 87 && atomicNumber <= 118) {
    if (atomicNumber <= 88) {
      // Fr(87) = col 1, Ra(88) = col 2
      return { row: 7, col: atomicNumber - 86 };
    } else {
      // Ac(89) to Og(118) are in columns 13-18 of the main table (but Ac is handled above)
      return { row: 7, col: 12 + (atomicNumber - 89) };
    }
  }

  return { row: 0, col: 0 };
}

console.log("Testing current implementation against scientific positions:");
let allCorrect = true;

for (const [atomicNumber, expected] of Object.entries(scientificPositions)) {
  const actual = getGridPosition(parseInt(atomicNumber));
  const isCorrect = actual.row === expected.row && actual.col === expected.col;

  if (!isCorrect) {
    console.log(`❌ Element ${atomicNumber}: expected row=${expected.row}, col=${expected.col}, got row=${actual.row}, col=${actual.col}`);
    allCorrect = false;
  } else {
    console.log(`✅ Element ${atomicNumber}: row=${actual.row}, col=${actual.col}`);
  }
}

if (allCorrect) {
  console.log("\n🎉 All elements positioned correctly!");
} else {
  console.log("\n❌ Some elements are positioned incorrectly");
}