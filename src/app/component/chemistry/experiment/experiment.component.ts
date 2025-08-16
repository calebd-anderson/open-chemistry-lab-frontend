import { Component, inject, input, Input, OnInit, signal } from '@angular/core';
import { Element } from '../../../model/element.model';
import { Observable, Subscription } from 'rxjs';
import { CompoundService } from '../../../service/compound.service';
import { AuthenticationService } from '../../../service/security/authentication.service';
import { Reaction } from '../../../model/compound';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ValidationModalComponent } from './validation-modal/validation-modal.component';
import { NotificationService } from '../../../service/notification.service';
import { NotificationType } from '../../../model/enum/notification-type.enum';
import { FlaskComponent } from './flask/flask.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { ExperimentService } from 'src/app/service/experiment.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-experiment',
  imports: [
    FlaskComponent,
    MatProgressBarModule,
    CommonModule,
    MatButtonModule,
  ],
  templateUrl: './experiment.component.html',
  styleUrls: ['./experiment.component.scss'],
})
export class ExperimentComponent implements OnInit {
  private interacted: Boolean = false;
  private eventsSubscription: Subscription;
  dialogRef: MatDialogRef<ValidationModalComponent>;
  readonly interactedElement = input<Element>();

  elementsInCompound = input.required<Element[]>();

  private _snackBar: NotificationService = inject(NotificationService);
  public experimentService: ExperimentService = inject(ExperimentService);

  constructor(
    private compoundService: CompoundService,
    private authenticationService: AuthenticationService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // this.eventsSubscription = this.events().subscribe((element) =>
    //   this.addInteractedElements(element)
    // );
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  public getInteracted(): Boolean {
    return this.interacted;
  }

  public getInteractedElement(): Element {
    return this.interactedElement();
  }
}
