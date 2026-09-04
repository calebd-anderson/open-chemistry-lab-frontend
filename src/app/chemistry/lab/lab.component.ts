import { Component, computed, inject, signal, ViewChild } from '@angular/core';
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
import { ElementRequest } from '@/app/model/element-request.model';

@Component({
  selector: 'app-lab',
  standalone: true,
  imports: [PeriodicTableComponent, ExperimentComponent],
  templateUrl: './lab.component.html',
  styleUrls: ['./lab.component.scss', './lab.component.svg.scss'],
})
export class LabComponent {
  dialogRef: MatDialogRef<ValidationModalComponent> | undefined;
  public dialog: MatDialog = inject(MatDialog);
  private _snackBar: NotificationService = inject(NotificationService);

  public experimentService: ExperimentService = inject(ExperimentService);
  private compoundService: CompoundService = inject(CompoundService);
  private authenticationService: AuthenticationService = inject(
    AuthenticationService,
  );

  // Signal to track elements currently in the compound (experiment) and their unique IDs for rendering
  elementsInCompound = signal<{ element: Element; id: number }[]>([]);
  private nextId = 0;
  // computed signal to track the set of element symbols currently in the experiment, derived from elementsInCompound
  elementsInExperiment = computed<Set<string>>(() => {
    return new Set(
      this.elementsInCompound().map((item) => item.element.symbol),
    );
  });

  // Collapsible table state
  isTableExpanded = signal(false);

  // Collapsible tips state
  isTipsExpanded = signal(true);

  // Tab state
  activeTab = signal<'tips' | 'table'>('table');

  // this receives an event from the periodic table component when an element is selected
  public addInteractedElements(element: Element) {
    // Check if adding this element would exceed the limit of 6
    if (this.elementsInCompound().length >= 10) {
      this._snackBar.notify(
        NotificationType.WARNING,
        'Maximum of 6 elements allowed in experiment. Please remove an element first.',
      );
      return;
    }

    this.elementsInCompound.update((e) => [
      ...e,
      { element, id: this.nextId++ },
    ]);

    // Show notification that element was added
    this._snackBar.notify(
      NotificationType.DEFAULT,
      element.name + ' added to experiment.',
    );
  }

  public getElementsInCompound(): { element: Element; id: number }[] {
    return this.elementsInCompound();
  }

  public clearExperiment() {
    this.elementsInCompound.set([]);
  }

  public validateCompound() {
    this.experimentService.setIsActive(true);

    // the reduced formula form is best represented as a Map<string, number> where the key is the element symbol and the value is the number of atoms
    let formula = new Map<string, number>();
    for (let element of this.elementsInCompound()) {
      if (formula.has(element.element.symbol)) {
        formula.set(
          element.element.symbol,
          formula.get(element.element.symbol)! + 1,
        );
      } else {
        formula.set(element.element.symbol, 1);
      }
    }

    // however, the API expects an array of ElementRequest objects, so we need to convert the Map to that format
    let elements: ElementRequest[] = [];
    for (let [key, value] of formula.entries()) {
      elements.push({ symbol: key, numberOfAtoms: value });
    }

    // Add synthetic delay after flask animation starts but before API request
    setTimeout(() => {
      // to do: the subscribe method should call back an HTTP error that sends a front-end notification
      if (this.authenticationService.isLoggedIn()) {
        let payload = {
          elements,
          userId: this.authenticationService.user()?.userId || null,
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
          'Unable to save discovery anonymously. Please create an account to save your findings.',
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
      panelClass: 'validation-dialog-panel',
      width: 'min(92vw, 440px)',
      autoFocus: false,
    });

    this.dialogRef.componentInstance.wasSuccessful = 'Almost there!';
    if (response.status == 404) {
      this.dialogRef.componentInstance.confirmMessage =
        'That combination does not form a valid compound yet. Try a different mix of elements!';
    } else {
      this.dialogRef.componentInstance.confirmMessage =
        'The experiment hit a hiccup while validating your reaction. Please try again.';
    }
  }

  public openConfirmationDialogSuccess(
    response: HttpResponse<Reaction>,
    isLoggedIn: boolean,
  ) {
    this.dialogRef = this.asyncDialog(response, isLoggedIn);
  }

  private asyncDialog(response: HttpResponse<Reaction>, isLoggedIn: boolean) {
    this.dialogRef = this.dialog.open(ValidationModalComponent, {
      disableClose: false,
      panelClass: 'validation-dialog-panel',
      width: 'min(92vw, 440px)',
      autoFocus: false,
    });
    this.dialogRef.componentInstance.discovery = response.body?.title;
    this.dialogRef.componentInstance.wasSuccessful = 'Congratulations!';
    this.dialogRef.componentInstance.confirmMessage =
      'Your experiment produced a new compound.';

    if (!isLoggedIn) {
      this.dialogRef.componentInstance.isLoggedIn =
        'Create an account to save your discovery!';
    }
    return this.dialogRef;
  }

  // Toggle the periodic table visibility
  public togglePeriodicTable() {
    this.isTableExpanded.update((prev) => !prev);
  }

  // Toggle the chemistry tips visibility
  public toggleTips() {
    this.isTipsExpanded.update((prev) => !prev);
  }

  // Switch between tabs
  public switchTab(tab: 'tips' | 'table') {
    this.activeTab.set(tab);
  }
}
