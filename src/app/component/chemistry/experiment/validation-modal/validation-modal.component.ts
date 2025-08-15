import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-validation-modal',
  templateUrl: './validation-modal.component.html',
  styleUrl: './validation-modal.scss',
  imports: [MatButtonModule, MatDialogModule],
})
export class ValidationModalComponent {
  constructor(public dialogRef: MatDialogRef<ValidationModalComponent>) {}

  public discovery: string;
  public confirmMessage: string;
  public wasSuccessful: string;
  public isLoggedIn: string;
}
