import { Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { Element } from '../../model/element.model';
import { ElementService } from '../../service/element.service';

import { SubSink } from 'subsink';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from "rxjs";
import { NotificationService } from '../../service/notification.service';
import { NotificationType } from '../../model/enum/notification-type.enum';

@Component({
  selector: 'periodic-table',
  templateUrl: './periodic-table.component.html',
  styleUrls: ['./periodic-table.component.sass'],
  standalone: false
})
export class PeriodicTableComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  showFiller = false;
  elements: Element[] = [];
  pageTitle: string = 'Sandbox'
  interactedElement: Element;
  eventsSubject: Subject<Element> = new Subject<Element>();
  added: number = 0;
  categories: string[] = ['alkali-metals','alkaline-earth-metals','lanthanoids','actinoids','transition-metals','post-transition-metals','metalloids','other-nonmetals','noble-gasses','unknown'];
  public progressSpinner: boolean = false;

  @Output() sendElementMessage = new EventEmitter<Element>();

  private _snackBar: NotificationService = inject(NotificationService);
  
  constructor(private elementService: ElementService) { }

  ngOnInit(): void {
    this.getElements();
  }

  // select element event
  public selectElement(event: { target: any; }) {
    let elmIndex = event.target.attributes.id?.value - 1;
    this.interactedElement = this.elements[elmIndex];
    if(this.interactedElement) {
      this.sendElementMessage.emit(this.interactedElement);
      this._snackBar.notify(NotificationType.DEFAULT, this.interactedElement.name + " added to experiment.");
    }
  }

  async getElements() {
    this.progressSpinner = true;
    this.subs.add(
      this.elementService.getElements().subscribe({
        next: (response: Element[]) => {
          this.elements = this.sortElements(response);
          this.progressSpinner = false;
        },
        error: (errorResponse: HttpErrorResponse) => {
          this._snackBar.notify(NotificationType.ERROR, "Failed to load periodic table data.");
        }
      })
    );
  }

  private sortElements(input: Element[]): Element[] {
    return input.sort((a,b) => a.atomicNumber - b.atomicNumber);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
