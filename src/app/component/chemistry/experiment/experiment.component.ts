import { Component, inject, input, output } from '@angular/core';
import { Element } from '../../../model/element.model';

import { FlaskComponent } from './flask/flask.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { ExperimentService } from 'src/app/service/experiment.service';
import { MatButtonModule } from '@angular/material/button';
import { InfoIcon } from 'src/app/info-icon.component.svg';

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
    InfoIcon,
  ],
  templateUrl: './experiment.component.html',
  styleUrls: ['./experiment.component.scss'],
})
export class ExperimentComponent {
  elementsInCompound = input.required<Element[]>();

  removeElement = output<RemoveElement>();
  runExperiment = output<void>();
  clearExperiment = output<void>();

  public experimentService: ExperimentService = inject(ExperimentService);

  public removeElementFromCompound(i: number, element: Element) {
    this.removeElement.emit({ index: i, element: element });
  }
}
