import { Component, inject, output, signal, Signal } from '@angular/core';
import { Element } from '../../../model/element.model';
import { ElementService } from '../../../service/element.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationService } from '../../../service/notification.service';
import { NotificationType } from '../../../model/enum/notification-type.enum';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'periodic-table',
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './periodic-table.component.html',
  styleUrls: ['./periodic-table.component.sass', './periodic-table.css'],
})
export class PeriodicTableComponent {
  elementService = inject(ElementService);

  elements = signal<Element[]>([]);
  filteredElements = signal<Element[]>([]);

  // Group blocks for CSS grid organization
  groupBlocks = [
    'Alkali metal',
    'Alkaline earth metal',
    'Transition metal',
    'Post-transition metal',
    'Metalloid',
    'Nonmetal',
    'Halogen',
    'Noble gas',
    'Lanthanide',
    'Actinide'
  ];

  pageTitle: string = 'Lab';
  public progressSpinner: boolean = false;

  sendElementMessage = output<Element>();
  elementSelected = output<Element>();

  private _snackBar: NotificationService = inject(NotificationService);

  // Track which elements are currently in the experiment
  elementsInExperiment = signal<Set<string>>(new Set());

  // Signal to control table visibility
  isTableExpanded = signal(true);

  // Current filter state
  currentFilter = signal<string>('all');

  async ngOnInit() {
    try {
      const allElements = await this.elementService.getElements();
      this.elements.set(allElements);
      this.filteredElements.set(allElements);

      // Initialize with all elements shown
      this.updateFilteredElements('all');
    } catch (error) {
      console.error('Error loading elements:', error);
    }
  }

  public selectElement(element: Element) {
    this.sendElementMessage.emit(element);
  }

  // Method to update the set of elements currently in the experiment
  public updateElementsInExperiment(elements: Element[]) {
    const elementSymbols = new Set<string>(elements.map(e => e.symbol));
    this.elementsInExperiment.set(elementSymbols);
  }

  // Method to check if an element is currently in the experiment
  public isElementInExperiment(symbol: string): boolean {
    return this.elementsInExperiment().has(symbol);
  }

  // Method to remove an element from the experiment and restore its original state
  public removeFromExperiment(elementSymbol: string) {
    const currentElements = this.elementsInExperiment();
    currentElements.delete(elementSymbol);
    this.elementsInExperiment.set(currentElements);
  }

  // Filter elements by group block
  public filterElements(groupBlock: string) {
    this.currentFilter.set(groupBlock);
    this.updateFilteredElements(groupBlock);
  }

  private updateFilteredElements(groupBlock: string) {
    if (groupBlock === 'all') {
      this.filteredElements.set(this.elements());
    } else {
      const filtered = this.elements().filter(element =>
        element.groupBlock === groupBlock
      );
      this.filteredElements.set(filtered);
    }
  }

  // Get the CSS class for element styling based on group block
  getElementClass(groupBlock: string): string {
    switch (groupBlock) {
      case 'Alkali metal': return 'alkali-metal';
      case 'Alkaline earth metal': return 'alkaline-earth-metal';
      case 'Transition metal': return 'transition-metal';
      case 'Post-transition metal': return 'post-transition-metal';
      case 'Metalloid': return 'metalloid';
      case 'Nonmetal': return 'nonmetal';
      case 'Halogen': return 'halogen';
      case 'Noble gas': return 'noble-gas';
      case 'Lanthanide': return 'lanthanide';
      case 'Actinide': return 'actinide';
      default: return 'unknown';
    }
  }

  // Get the grid position for an element based on its atomic number
  public getGridPosition(atomicNumber: number): { row: number, col: number } {
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

  // Sort elements by atomic number
  public sortElements() {
    const sorted = [...this.elements()].sort((a, b) => a.atomicNumber - b.atomicNumber);
    this.elements.set(sorted);
    this.filteredElements.set(sorted);
  }

}