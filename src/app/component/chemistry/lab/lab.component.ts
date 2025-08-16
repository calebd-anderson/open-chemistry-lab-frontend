import { Component, inject, signal } from '@angular/core';
import { PeriodicTableComponent } from '../periodic-table/periodic-table.component';
import { ExperimentComponent } from '../experiment/experiment.component';
import { Element } from 'src/app/model/element.model';
import { NotificationType } from 'src/app/model/enum/notification-type.enum';
import { NotificationService } from 'src/app/service/notification.service';
import { ExperimentService } from 'src/app/service/experiment.service';
import { CompoundService } from 'src/app/service/compound.service';
import { AuthenticationService } from 'src/app/service/security/authentication.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ValidationModalComponent } from '../experiment/validation-modal/validation-modal.component';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Reaction } from 'src/app/model/compound';

@Component({
  selector: 'app-lab',
  imports: [PeriodicTableComponent, ExperimentComponent],
  templateUrl: './lab.component.html',
  styleUrl: './lab.component.scss',
})
export class LabComponent {
  elementsInCompound = signal<Element[]>([]);
  atomsInCompound: Map<String, number> = new Map();
  private _snackBar: NotificationService = inject(NotificationService);
  public experimentService: ExperimentService = inject(ExperimentService);
  private compoundService: CompoundService = inject(CompoundService);
  private authenticationService: AuthenticationService = inject(
    AuthenticationService
  );
  dialogRef: MatDialogRef<ValidationModalComponent>;
  public dialog: MatDialog = inject(MatDialog);

  public addInteractedElements(element: Element) {
    if (this.elementsInCompound.length == 0)
      window.scrollTo({ top: 0, behavior: 'smooth' });
    let tempAtoms = this.atomsInCompound.get(element.symbol);
    this.elementsInCompound.update((e) => [...e, element]);
    if (tempAtoms == null) {
      this.atomsInCompound.set(element.symbol, 1);
    } else {
      this.atomsInCompound.set(element.symbol, tempAtoms + 1);
    }
  }

  public getElementsInCompound(): Element[] {
    return this.elementsInCompound();
  }

  public removeElementFromCompound(index: number, element: Element) {
    let tempAtoms = this.atomsInCompound.get(element.symbol);
    this.elementsInCompound().splice(index, 1);
    if (tempAtoms == 1) {
      this.atomsInCompound.delete(element.symbol);
      this._snackBar.notify(
        NotificationType.DEFAULT,
        element.name + ' removed from experiment.'
      );
    } else {
      this.atomsInCompound.set(element.symbol, tempAtoms - 1);
      this._snackBar.notify(
        NotificationType.DEFAULT,
        element.name + ' removed from experiment.'
      );
    }
  }

  public clearExperiment() {
    this.elementsInCompound.set([]);
    this.atomsInCompound.clear();
  }

  public validateCompound() {
    this.experimentService.setIsActive(true);

    let elements = [];

    // build list of elements
    for (let [key, value] of this.atomsInCompound.entries()) {
      elements.push({ symbol: key, numberOfAtoms: value });
    }

    // to do: the subscribe method should call back an HTTP error that sends a front-end notification
    if (this.authenticationService.isUserLoggedIn()) {
      let payload = {
        elements,
        userId: this.authenticationService.getUserFromLocalCache().userId,
      };
      // careful of memory leak
      this.compoundService.validate(payload).subscribe({
        next: (response: HttpResponse<Reaction>) => {
          this.openConfirmationDialogSuccess(response, true);
          this.experimentService.setIsActive(false);
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.openConfirmationDialogFail(errorResponse);
          this.experimentService.setIsActive(false);
        },
      });
    } else {
      console.warn('Unable to save findings, no user is logged in.');
      let payload = {
        elements,
        userId: null,
      };
      // careful of memory leak
      this.compoundService.validate(payload).subscribe({
        next: (response: HttpResponse<Reaction>) => {
          this.openConfirmationDialogSuccess(response, false);
          this.experimentService.setIsActive(false);
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.openConfirmationDialogFail(errorResponse);
          this.experimentService.setIsActive(false);
        },
      });
    }
  }

  public openConfirmationDialogFail(response: HttpErrorResponse) {
    this.dialogRef = this.dialog.open(ValidationModalComponent, {
      disableClose: false,
    });

    this.dialogRef.componentInstance.wasSuccessful = 'Uh oh!';
    if (response.status == 404) {
      this.dialogRef.componentInstance.confirmMessage =
        "It doesn't look like that is a valid compound, please try again!";
    } else {
      this.dialogRef.componentInstance.confirmMessage =
        "We're having trouble validating. Please try again.";
    }
  }

  public openConfirmationDialogSuccess(
    response: HttpResponse<Reaction>,
    isLoggedIn: boolean
  ) {
    this.dialogRef = this.dialog.open(ValidationModalComponent, {
      disableClose: false,
    });
    this.dialogRef.componentInstance.discovery = response.body.title;
    this.dialogRef.componentInstance.wasSuccessful = 'Congratulations!';
    this.dialogRef.componentInstance.confirmMessage = 'You discovered: ';

    if (!isLoggedIn) {
      this.dialogRef.componentInstance.isLoggedIn =
        'Create an account to save your discovery!';
    }
  }
}
