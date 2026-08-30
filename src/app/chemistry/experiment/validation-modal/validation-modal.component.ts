import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ButtonComponent } from '@/app/component/button/button.component';

@Component({
  selector: 'app-validation-modal',
  templateUrl: './validation-modal.component.html',
  styleUrl: './validation-modal.scss',
  imports: [MatDialogModule, ButtonComponent],
})
export class ValidationModalComponent {
  constructor(public dialogRef: MatDialogRef<ValidationModalComponent>) {}

  public discovery: string | undefined = '';
  public confirmMessage: string = 'Let\'s see what the experiment reveals.';
  public wasSuccessful: string = 'Experiment complete';
  public isLoggedIn: string = '';

  public get isSuccess(): boolean {
    return this.wasSuccessful.toLowerCase().includes('congrat') || this.wasSuccessful.toLowerCase().includes('success');
  }

  public get hasDiscovery(): boolean {
    return !!this.discovery && this.discovery.trim() !== '' && this.discovery.trim() !== '?';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
