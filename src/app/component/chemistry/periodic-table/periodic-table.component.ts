import { Component, inject, output, Signal } from '@angular/core';
import { Element } from '../../../model/element.model';
import { ElementService } from '../../../service/element.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationService } from '../../../service/notification.service';
import { NotificationType } from '../../../model/enum/notification-type.enum';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'periodic-table',
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './periodic-table.component.html',
  styleUrls: ['./periodic-table.component.sass', './periodic-table.css'],
})
export class PeriodicTableComponent {
  elementService = inject(ElementService);

  elements: Signal<Element[]> = toSignal(this.elementService.getElements(), {
    initialValue: [],
  });

  pageTitle: string = 'Lab';
  added: number = 0;
  categories: string[] = [
    'alkali-metals',
    'alkaline-earth-metals',
    'lanthanoids',
    'actinoids',
    'transition-metals',
    'post-transition-metals',
    'metalloids',
    'other-nonmetals',
    'noble-gasses',
    'unknown',
  ];
  public progressSpinner: boolean = false;

  sendElementMessage = output<Element>();

  private _snackBar: NotificationService = inject(NotificationService);

  public selectElement(event: MouseEvent) {
    const element = event.target as HTMLElement;
    let elmIndex = parseInt(element.id) - 1;

    const interactedElement = this.elements()[elmIndex];
    if (interactedElement) {
      this.sendElementMessage.emit(interactedElement);
      this._snackBar.notify(
        NotificationType.DEFAULT,
        interactedElement.name + ' added to experiment.',
      );
    }
  }

  public sortElements(input: Element[]): Element[] {
    return input.sort((a, b) => a.atomicNumber - b.atomicNumber);
  }
}
