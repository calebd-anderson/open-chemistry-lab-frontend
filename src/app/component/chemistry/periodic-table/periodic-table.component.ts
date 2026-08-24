import { Component, inject, output, signal, Signal, WritableSignal } from '@angular/core';
import { Element } from '../../../model/element.model';
import { ElementService } from '../../../service/element.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationService } from '../../../service/notification.service';
import { NotificationType } from '../../../model/enum/notification-type.enum';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'periodic-table',
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './periodic-table.component.html',
  styleUrls: ['./periodic-table.component.sass', './periodic-table.css'],
})
export class PeriodicTableComponent {
  elementService = inject(ElementService);

  elements = signal<Element[]>([]);

  pageTitle: string = 'Lab';
  added: number = 0;
  categories: string[] = [
    'alkali-metals',
    'alkaline-earth-metals',
    'lanthanoids',
    'actinoids',
    'transition-metals',
    'post-transition-metals',
    'metalloids',
    'other-nonmetals',
    'noble-gasses',
    'unknown',
  ];
  public progressSpinner: boolean = false;

  sendElementMessage = output<Element>();
  elementSelected = output<Element>();

  private _snackBar: NotificationService = inject(NotificationService);

  // Track which elements are currently in the experiment
  elementsInExperiment = signal<Set<string>>(new Set());

  async ngOnInit() {
    this.elements.set(await this.elementService.getElements());
  }

  public selectElement(event: MouseEvent) {
    // Get the clicked element directly
    const clickedElement = event.currentTarget as HTMLElement;

    if (!clickedElement) return;

    // Get the atomic number from the input id that's inside this element
    const inputElement = clickedElement.querySelector('.activate');
    if (!inputElement) return;

    const atomicNumber = parseInt(inputElement.id);
    let elmIndex = atomicNumber - 1;

    const interactedElement = this.elements()[elmIndex];
    if (interactedElement) {
      // Simple selection without animation
      this.sendElementMessage.emit(interactedElement);
      this._snackBar.notify(
        NotificationType.DEFAULT,
        interactedElement.name + ' added to experiment.',
      );
    }
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

  public sortElements(input: Element[]): Element[] {
    return input.sort((a, b) => a.atomicNumber - b.atomicNumber);
  }
}
