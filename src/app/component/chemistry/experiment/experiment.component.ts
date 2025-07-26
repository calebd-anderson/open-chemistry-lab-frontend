import { Component, inject, Input, OnInit } from '@angular/core';
import { Element } from '../../../model/element.model';
import { Observable, Subscription } from "rxjs";
import { CompoundService } from "../../../service/compound.service";
import { AuthenticationService } from '../../../service/security/authentication.service';
import { Reaction } from "../../../model/compound";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ValidationModalComponent } from "./validation-modal/validation-modal.component";
import { NotificationService } from '../../../service/notification.service';
import { NotificationType } from '../../../model/enum/notification-type.enum';
import { FlaskComponent } from './flask/flask.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { ExperimentService } from 'src/app/service/experiment.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-experiment',
  imports: [FlaskComponent, MatProgressBarModule, CommonModule, MatButtonModule],
  templateUrl: './experiment.component.html',
  styleUrls: ['./experiment.component.scss']
})
export class ExperimentComponent implements OnInit {
  private interacted: Boolean = false;
  private eventsSubscription: Subscription;
  elementsInCompound: Element[] = [];
  dialogRef: MatDialogRef<ValidationModalComponent>;
  atomsInCompound: Map<String, number> = new Map();
  @Input() interactedElement: Element;
  @Input() events: Observable<Element>;

  private _snackBar: NotificationService = inject(NotificationService);
  public experimentService: ExperimentService = inject(ExperimentService)
  

  constructor(private compoundService: CompoundService, private authenticationService: AuthenticationService, 
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.eventsSubscription = this.events.subscribe((element) => this.addInteractedElements(element));
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  public getInteracted(): Boolean {
    return this.interacted;
  }

  public getInteractedElement(): Element {
    return this.interactedElement;
  }

  public getElementsInCompound(): Element[] {
    return this.elementsInCompound;
  }

  public addInteractedElements(element: Element) {
    if(this.elementsInCompound.length == 0)
      window.scrollTo({ top: 0, behavior: 'smooth' });
    let tempAtoms = this.atomsInCompound.get(element.symbol);
    this.elementsInCompound.push(element);
    if (tempAtoms == null) {
      this.atomsInCompound.set(element.symbol, 1);
    } else {
      this.atomsInCompound.set(element.symbol, tempAtoms + 1);
    }
  }

  public removeElementFromCompound(index: number, element: Element) {
    let tempAtoms = this.atomsInCompound.get(element.symbol);
    this.elementsInCompound.splice(index, 1);
    if (tempAtoms == 1) {
      this.atomsInCompound.delete(element.symbol);
      this._snackBar.notify(NotificationType.DEFAULT, element.name + " removed from experiment.");
    } else {
      this.atomsInCompound.set(element.symbol, tempAtoms - 1);
      this._snackBar.notify(NotificationType.DEFAULT, element.name + " removed from experiment.");
    }
  }

  public clearExperiment() {
    this.elementsInCompound = [];
    this.atomsInCompound.clear();
  }

  public openConfirmationDialogFail(response: HttpErrorResponse) {
    this.dialogRef = this.dialog.open(ValidationModalComponent, {
      disableClose: false
    });

    this.dialogRef.componentInstance.wasSuccessful = "Uh oh!"
    if (response.status == 404) {
      this.dialogRef.componentInstance.confirmMessage = "It doesn't look like that is a valid compound, please try again!";
    } else {
      this.dialogRef.componentInstance.confirmMessage = "We're having trouble validating. Please try again.";
    }
  }

  public openConfirmationDialogSuccess(response: HttpResponse<Reaction>, isLoggedIn: boolean) {
    this.dialogRef = this.dialog.open(ValidationModalComponent, {
      disableClose: false
    });
    this.dialogRef.componentInstance.discovery = response.body.title;
    this.dialogRef.componentInstance.wasSuccessful = "Congratulations!";
    this.dialogRef.componentInstance.confirmMessage = "You discovered: ";

    if (!isLoggedIn) {
      this.dialogRef.componentInstance.isLoggedIn = "Create an account to save your discovery!";
    }
  }

  public validateCompound() {
    this.experimentService.setIsActive(true);

    let elements = [];

    // build list of elements
    for(let [key, value] of this.atomsInCompound.entries()) {
      elements.push({"symbol": key, "numberOfAtoms": value});
    }

    // to do: the subscribe method should call back an HTTP error that sends a front-end notification
    if(this.authenticationService.isUserLoggedIn()) {
      let payload = {
        elements,
        userId: this.authenticationService.getUserFromLocalCache().userId
      }
      // careful of memory leak
      this.compoundService
        .validate(payload)
          .subscribe({
            next: (response: HttpResponse<Reaction>,) => {
              this.openConfirmationDialogSuccess(response, true);
              this.experimentService.setIsActive(false);

            },
            error: (errorResponse: HttpErrorResponse) => {
              this.openConfirmationDialogFail(errorResponse);
              this.experimentService.setIsActive(false);
            }
          });
    } else {
      console.warn("Unable to save findings, no user is logged in.");
      let payload = {
        elements,
        userId: null
      }
      // careful of memory leak
      this.compoundService
        .validate(payload)
        .subscribe({
          next: (response: HttpResponse<Reaction>) => {
            this.openConfirmationDialogSuccess(response, false);
            this.experimentService.setIsActive(false);
          },
          error: (errorResponse: HttpErrorResponse) => {
            this.openConfirmationDialogFail(errorResponse);
            this.experimentService.setIsActive(false);
          }
        });
    }
  }
}
