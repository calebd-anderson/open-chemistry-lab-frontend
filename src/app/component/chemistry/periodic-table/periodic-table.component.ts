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

  public sortElements(input: Element[]): Element[] {
    return input.sort((a, b) => a.atomicNumber - b.atomicNumber);
  }
}