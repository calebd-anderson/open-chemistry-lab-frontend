import {
  Component,
  signal,
  Signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ButtonComponent } from '@/app/component/button/button.component';
import { D3FdgComponent } from './d3-fdg/d3-fdg.component';
import { ClusterMapResponse } from '@/app/model/clustmapresp.model';

@Component({
  selector: 'graphics-modal',
  templateUrl: './graphics-modal.component.html',
  styleUrl: './graphics-modal.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatDialogModule, ButtonComponent, D3FdgComponent],
})
export class GraphicsModalComponent {
  constructor(public dialogRef: MatDialogRef<GraphicsModalComponent>) {}

  // public discovery: string | undefined = '';
  public confirmMessage: string = "Let's see what the experiment reveals.";
  public wasSuccessful: string = 'Experiment complete';
  public isLoggedIn: string = '';

  public data = signal<ClusterMapResponse>({ nodes: [], links: [] });

  public get isSuccess(): boolean {
    return (
      this.wasSuccessful.toLowerCase().includes('congrat') ||
      this.wasSuccessful.toLowerCase().includes('success')
    );
  }

  // public get hasDiscovery(): boolean {
  //   return !!this.discovery && this.discovery.trim() !== '' && this.discovery.trim() !== '?';
  // }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
