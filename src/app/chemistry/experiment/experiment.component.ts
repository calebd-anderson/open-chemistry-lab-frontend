import {
  Component,
  inject,
  input,
  output,
  ElementRef,
  AfterViewInit,
  model,
} from '@angular/core';
import { Element } from '@model/element.model';

import { FlaskComponent } from './flask/flask.component';
import { CommonModule } from '@angular/common';
import { ExperimentService } from '@app/service/experiment.service';
import { InfoIcon } from '@app/assets/info-icon.component.svg';
import { ButtonComponent } from '@/app/component/button/button.component';

@Component({
  selector: 'app-experiment',
  imports: [FlaskComponent, CommonModule, InfoIcon, ButtonComponent],
  templateUrl: './experiment.component.html',
  styleUrls: ['./experiment.component.scss'],
})
export class ExperimentComponent {
  elementsInCompound = model.required<{ element: Element; id: number }[]>();
  isTableExpanded = input<boolean>(false);

  // removeElement = output<RemoveElement>();
  runExperiment = output<void>();
  clearExperiment = output<void>();

  public experimentService: ExperimentService = inject(ExperimentService);
  private elementRef: ElementRef;

  constructor(elementRef: ElementRef) {
    this.elementRef = elementRef;
  }

  public removeElementFromCompound(i: number, element: Element) {
    // Add animation class for removing elements

    if (this.elementsInCompound().length === 1) {
      setTimeout(() => {
        this.elementsInCompound.update((elements) =>
          elements.filter((_, index) => index !== i),
        );
      }, 500);
    } else {
      this.elementsInCompound.update((elements) =>
        elements.filter((_, index) => index !== i),
      );
    }
  }

  // Get the count of each element in the compound
  getElementCount(elementSymbol: string): number {
    return this.elementsInCompound().filter(
      (item) => item.element.symbol === elementSymbol,
    ).length;
  }
}
