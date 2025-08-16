import {
  Component,
  inject,
  input,
  Input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { Element } from '../../../model/element.model';
import { Subscription } from 'rxjs';
import { CompoundService } from '../../../service/compound.service';
import { AuthenticationService } from '../../../service/security/authentication.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ValidationModalComponent } from './validation-modal/validation-modal.component';
import { NotificationService } from '../../../service/notification.service';
import { FlaskComponent } from './flask/flask.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { ExperimentService } from 'src/app/service/experiment.service';
import { MatButtonModule } from '@angular/material/button';

interface RemoveElement {
  index: number,
  element: Element
}
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
export class ExperimentComponent {
  private interacted: Boolean = false;
  private eventsSubscription: Subscription;
  dialogRef: MatDialogRef<ValidationModalComponent>;
  readonly interactedElement = input<Element>();

  elementsInCompound = input.required<Element[]>();

  removeElement = output<RemoveElement>();

  private _snackBar: NotificationService = inject(NotificationService);
  public experimentService: ExperimentService = inject(ExperimentService);

  constructor(
    private compoundService: CompoundService,
    private authenticationService: AuthenticationService,
    public dialog: MatDialog
  ) {}

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  public getInteracted(): Boolean {
    return this.interacted;
  }

  public getInteractedElement(): Element {
    return this.interactedElement();
  }

  public removeElementFromCompound(i: number, element: Element) {
    this.removeElement.emit({index: i, element: element});
  }
}
