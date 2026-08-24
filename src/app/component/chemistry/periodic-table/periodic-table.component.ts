import { Component, inject, output, signal, Signal, WritableSignal } from '@angular/core';
import { Element } from '../../../model/element.model';
import { ElementService } from '../../../service/element.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationService } from '../../../service/notification.service';
import { NotificationType } from '../../../model/enum/notification-type.enum';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import gsap from 'gsap';

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
      // Add animation to the clicked element
      const elementSquare = clickedElement.querySelector('.square');
      if (elementSquare) {
        // Store original styles for restoration later
        const originalStyles = {
          scale: 1,
          rotation: 0,
          boxShadow: '0 0 5px rgba(255, 255, 255, 0.3)',
          opacity: 1,
          backgroundColor: '', // Will be set to empty initially
        };

        // Save the original background color for restoration later
        const computedStyle = window.getComputedStyle(elementSquare);
        originalStyles.backgroundColor = computedStyle.backgroundColor;

        // Stop any existing animations on this element first
        gsap.killTweensOf(elementSquare);
        // Add temporary class for animation
        elementSquare.classList.add('gsap-animating');

        // Apply animation using GSAP with slower rotation
        gsap.fromTo(
          elementSquare,
          {
            scale: 1,
            rotation: 0,
            boxShadow: '0 0 5px rgba(255, 255, 255, 0.3)',
            opacity: 1,
            transformOrigin: "center",
            backgroundColor: originalStyles.backgroundColor
          },
          {
            scale: 1.4,
            rotation: 360, // 1 full rotation instead of 720 (2 rotations) for better speed control
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(59, 130, 246, 0.6)',
            opacity: 0.9,
            duration: 3.0, // Increased to 3.0 seconds for much slower animation
            ease: 'elastic.out(1.5, 0.5)',
            onComplete: () => {
              // Remove temporary class after animation
              elementSquare.classList.remove('gsap-animating');
              // Reset the element to its normal state after animation - preserve hover effects
              gsap.set(elementSquare, {
                scale: 1,
                rotation: 0,
                boxShadow: '0 0 5px rgba(255, 255, 255, 0.3)',
                opacity: 1,
                // Only reset properties that were actually changed during animation
                // Don't override background color or other hover effect properties
              });
            }
          }
        );

        // Add a secondary pulse effect for extra visual impact with longer duration
        gsap.to(elementSquare, {
          duration: 1.5, // Increased to 1.5 seconds for smoother effect
          scale: 1.1,
          repeat: 2,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

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

    // Find and restore the element's original styles if needed
    const elementSquares = document.querySelectorAll(`.square[data-symbol="${elementSymbol}"]`);
    elementSquares.forEach(elementSquare => {
      // Remove any animation-specific classes
      elementSquare.classList.remove('gsap-animating');

      // Ensure the element has proper styling for hover effects to work
      // Reset specific styles that might have been overridden by animation
      gsap.set(elementSquare, {
        scale: 1,
        rotation: 0,
        boxShadow: '0 0 5px rgba(255, 255, 255, 0.3)',
        opacity: 1,
        backgroundColor: '', // Let CSS handle background restoration
      });
    });
  }

  public sortElements(input: Element[]): Element[] {
    return input.sort((a, b) => a.atomicNumber - b.atomicNumber);
  }
}
