import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {
  MatDialog,
  MatDialogModule
} from '@angular/material/dialog';

@Component({
  selector: 'app-welcome',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.dialog.open(DialogElementsExampleDialog);
  }
  openDialog() {
    this.dialog.open(DialogElementsExampleDialog);
  }
}

@Component({
  selector: 'dialog-elements-example-dialog',
  templateUrl: 'dialog-example.html',
  imports: [MatDialogModule, MatButtonModule],
  styleUrl: './welcome.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogElementsExampleDialog {}
