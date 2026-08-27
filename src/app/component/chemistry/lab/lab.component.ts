import { Component, inject, signal, ViewChild } from '@angular/core';
import { PeriodicTableComponent } from '../periodic-table/periodic-table.component';
import { ExperimentComponent } from '../experiment/experiment.component';
import { Element } from '@app/model/element.model';
import { NotificationType } from '@app/model/enum/notification-type.enum';
import { NotificationService } from '@app/service/notification.service';
import { ExperimentService } from '@app/service/experiment.service';
import { CompoundService } from '@app/service/compound.service';
import { AuthenticationService } from '@app/service/security/authentication.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ValidationModalComponent } from '../experiment/validation-modal/validation-modal.component';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Reaction } from '@app/model/compound';

@Component({
  selector: 'app-lab',
  standalone: true,
  imports: [PeriodicTableComponent, ExperimentComponent],
  templateUrl: './lab.component.html',
  styleUrls: ['./lab.component.scss', './lab.component.svg.scss'],
})
export class LabComponent {
  @ViewChild(PeriodicTableComponent) periodicTable!: PeriodicTableComponent;

  elementsInCompound = signal<{element: Element, id: number}[]>([]);
  atomsInCompound: Map<string, number> = new Map();
  private nextId = 0;
  private _snackBar: NotificationService = inject(NotificationService);
  public experimentService: ExperimentService = inject(ExperimentService);
  private compoundService: CompoundService = inject(CompoundService);
  private authenticationService: AuthenticationService = inject(
    AuthenticationService
  );
  dialogRef: MatDialogRef<ValidationModalComponent> | undefined;
  public dialog: MatDialog = inject(MatDialog);

  // Collapsible table state
  isTableExpanded = signal(false);

  // Collapsible tips state
  isTipsExpanded = signal(true);

  // Tab state
  activeTab = signal<'tips' | 'table'>('table');

  public addInteractedElements(element: Element) {
    // Check if adding this element would exceed the limit of 6
    if (this.elementsInCompound().length >= 10) {
      this._snackBar.notify(
        NotificationType.WARNING,
        'Maximum of 6 elements allowed in experiment. Please remove an element first.'
      );
      return;
    }

    let tempAtoms = this.atomsInCompound.get(element.symbol);
    this.elementsInCompound.update((e) => [...e, { element, id: this.nextId++ }]);
    if (tempAtoms == null) {
      this.atomsInCompound.set(element.symbol, 1);
    } else {
      this.atomsInCompound.set(element.symbol, tempAtoms + 1);
    }

    // Show notification that element was added
    this._snackBar.notify(
      NotificationType.DEFAULT,
      element.name + ' added to experiment.'
    );

    // Update the periodic table with the new elements
    this.updatePeriodicTableElements();
  }

  public getElementsInCompound(): {element: Element, id: number}[] {
    return this.elementsInCompound();
  }

  public removeElementFromCompound(index: number) {
    const element = this.elementsInCompound()[index].element;
    let tempAtoms = this.atomsInCompound.get(element.symbol);
    this.elementsInCompound.update((elements) => elements.filter((_, i) => i !== index));
    if (tempAtoms == 1) {
      this.atomsInCompound.delete(element.symbol);
      this._snackBar.notify(
        NotificationType.DEFAULT,
        element.name + ' removed from experiment.'
      );
    } else if (tempAtoms) {
      this.atomsInCompound.set(element.symbol, tempAtoms - 1);
      this._snackBar.notify(
        NotificationType.DEFAULT,
        element.name + ' removed from experiment.'
      );
    }

    // Update the periodic table with the new elements
    this.updatePeriodicTableElements();
  }

  public clearExperiment() {
    this.elementsInCompound.set([]);
    this.atomsInCompound.clear();

    // Update the periodic table with no elements
    this.updatePeriodicTableElements();
  }

  public validateCompound() {
    this.experimentService.setIsActive(true);

    let elements = [];

    // build list of elements
    for (let [key, value] of this.atomsInCompound.entries()) {
      elements.push({ symbol: key, numberOfAtoms: value });
    }

    // Add synthetic delay after flask animation starts but before API request
    setTimeout(() => {
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
        this._snackBar.notify(
          NotificationType.WARNING,
          'Unable to save discovery anonymously. Please create an account to save your findings.'
        );
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
    }, 2000); // 2 second delay
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
    this.dialogRef.componentInstance.discovery = response.body?.title;
    this.dialogRef.componentInstance.wasSuccessful = 'Congratulations!';
    this.dialogRef.componentInstance.confirmMessage = 'You discovered: ';

    if (!isLoggedIn) {
      this.dialogRef.componentInstance.isLoggedIn =
        'Create an account to save your discovery!';
    }
  }

  // Toggle the periodic table visibility
  public togglePeriodicTable() {
    this.isTableExpanded.update(prev => !prev);
  }

  // Toggle the chemistry tips visibility
  public toggleTips() {
    this.isTipsExpanded.update(prev => !prev);
  }

  // Switch between tabs
  public switchTab(tab: 'tips' | 'table') {
    this.activeTab.set(tab);
  }

  // Method to update the periodic table with current elements
  private updatePeriodicTableElements() {
    if (this.periodicTable) {
      this.periodicTable.updateElementsInExperiment(this.elementsInCompound().map(item => item.element));
    }
  }
}
