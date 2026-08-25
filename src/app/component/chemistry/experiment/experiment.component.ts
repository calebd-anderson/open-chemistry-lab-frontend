import { Component, inject, input, output, ElementRef, AfterViewInit } from '@angular/core';
import { Element } from '../../../model/element.model';

import { FlaskComponent } from './flask/flask.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { ExperimentService } from '@app/service/experiment.service';
import { MatButtonModule } from '@angular/material/button';
import { InfoIcon } from '@app/info-icon.component.svg';
import { MatIconModule } from '@angular/material/icon';

interface RemoveElement {
  index: number;
  element: Element;
}
@Component({
  selector: 'app-experiment',
  imports: [
    FlaskComponent,
    MatProgressBarModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    InfoIcon,
  ],
  templateUrl: './experiment.component.html',
  styleUrls: ['./experiment.component.scss'],
})
export class ExperimentComponent implements AfterViewInit {
  elementsInCompound = input.required<Element[]>();
  isTableExpanded = input<boolean>(false);

  removeElement = output<RemoveElement>();
  runExperiment = output<void>();
  clearExperiment = output<void>();

  public experimentService: ExperimentService = inject(ExperimentService);
  private elementRef: ElementRef;

  constructor(elementRef: ElementRef) {
    this.elementRef = elementRef;
  }

  ngAfterViewInit() {
    // Add animation classes to elements when they're added
    const compoundContainer = this.elementRef.nativeElement.querySelector('.compound');
    if (compoundContainer) {
      // Observe new elements being added
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1) {
                // Check if the node has the class we're looking for
                const elementNode = node as HTMLElement;
                if (elementNode.classList && elementNode.classList.contains('element-in-compound')) {
                  // Add animation class for new elements
                  setTimeout(() => {
                    elementNode.classList.add('add');
                    setTimeout(() => {
                      elementNode.classList.remove('add');
                    }, 500);
                  }, 10);
                }
              }
            });
          }
        });
      });

      observer.observe(compoundContainer, { childList: true, subtree: true });
    }
  }

  public removeElementFromCompound(i: number, element: Element) {
    // Add animation class for removing elements
    const elementToRemove = this.elementRef.nativeElement.querySelector(`.element-in-compound[data-element="${element.symbol}"]`);
    if (elementToRemove) {
      elementToRemove.classList.add('remove');
      setTimeout(() => {
        this.removeElement.emit({ index: i, element: element });
      }, 500);
    } else {
      this.removeElement.emit({ index: i, element: element });
    }
  }

  // Get the count of each element in the compound
  getElementCount(elementSymbol: string): number {
    return this.elementsInCompound().filter(e => e.symbol === elementSymbol).length;
  }
}
