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

  public discovery: string | undefined = '?';
  public confirmMessage: string = '?';
  public wasSuccessful: string = '?';
  public isLoggedIn: string = '?';

  onNoClick(): void {
    this.dialogRef.close();
  }
}
