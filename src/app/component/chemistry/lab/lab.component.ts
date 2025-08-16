import { Component } from '@angular/core';
import { PeriodicTableComponent } from '../periodic-table/periodic-table.component';
import { ExperimentComponent } from '../experiment/experiment.component';

@Component({
  selector: 'app-lab',
  // imports: [PeriodicTableComponent, ExperimentComponent],
  imports: [PeriodicTableComponent],
  templateUrl: './lab.component.html',
  styleUrl: './lab.component.scss',
})
export class LabComponent {}
