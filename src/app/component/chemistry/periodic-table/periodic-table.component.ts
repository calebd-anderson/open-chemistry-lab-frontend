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
    // Period 1
    if (atomicNumber === 1) return { row: 1, col: 1 };
    if (atomicNumber === 2) return { row: 1, col: 18 };

    // Period 2
    if (atomicNumber === 3) return { row: 2, col: 1 };
    if (atomicNumber === 4) return { row: 2, col: 2 };
    if (atomicNumber >= 5 && atomicNumber <= 10) return { row: 2, col: atomicNumber + 8 }; // 5 -> 13, 10 -> 18

    // Period 3
    if (atomicNumber === 11) return { row: 3, col: 1 };
    if (atomicNumber === 12) return { row: 3, col: 2 };
    if (atomicNumber >= 13 && atomicNumber <= 18) return { row: 3, col: atomicNumber }; // 13 -> 13, 18 -> 18

    // Period 4
    if (atomicNumber >= 19 && atomicNumber <= 36) return { row: 4, col: atomicNumber - 18 }; // 19 -> 1, 36 -> 18

    // Period 5
    if (atomicNumber >= 37 && atomicNumber <= 54) return { row: 5, col: atomicNumber - 36 }; // 37 -> 1, 54 -> 18

    // Period 6
    if (atomicNumber >= 55 && atomicNumber <= 86) {
        if (atomicNumber === 55) return { row: 6, col: 1 };
        if (atomicNumber === 56) return { row: 6, col: 2 }; // Wait, I made a typo here. Let me fix it.
        if (atomicNumber >= 57 && atomicNumber <= 71) return { row: 8, col: atomicNumber - 53 }; // Lanthanides: 57 -> 4, 71 -> 18
        if (atomicNumber >= 72 && atomicNumber <= 86) return { row: 6, col: atomicNumber - 68 }; // 72 -> 4, 86 -> 18
    }

    // Period 7
    if (atomicNumber >= 87 && atomicNumber <= 118) {
        if (atomicNumber === 87) return { row: 7, col: 1 };
        if (atomicNumber === 88) return { row: 7, col: 2 };
        if (atomicNumber >= 89 && atomicNumber <= 103) return { row: 9, col: atomicNumber - 85 }; // Actinides: 89 -> 4, 103 -> 18
        if (atomicNumber >= 104 && atomicNumber <= 118) return { row: 7, col: atomicNumber - 100 }; // 104 -> 4, 118 -> 18
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