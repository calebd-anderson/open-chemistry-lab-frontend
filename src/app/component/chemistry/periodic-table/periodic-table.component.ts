import { Component, inject, output, signal, Signal, WritableSignal } from '@angular/core';
import { Element } from '../../../model/element.model';
import { ElementService } from '../../../service/element.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationService } from '../../../service/notification.service';
import { NotificationType } from '../../../model/enum/notification-type.enum';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import gsap from 'gsap';

@Component({
  selector: 'periodic-table',
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './periodic-table.component.html',
  styleUrls: ['./periodic-table.component.sass', './periodic-table.css'],
})
export class PeriodicTableComponent {
  elementService = inject(ElementService);

  elements = signal<Element[]>([]);

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

  async ngOnInit() {
    this.elements.set(await this.elementService.getElements());
  }

  public selectElement(event: MouseEvent) {
    const element = event.target as HTMLElement;
    let elmIndex = parseInt(element.id) - 1;

    const interactedElement = this.elements()[elmIndex];
    if (interactedElement) {
      // Add animation to the clicked element
      const elementSquare = element.closest('.element')?.querySelector('.square');
      if (elementSquare) {
        gsap.fromTo(
          elementSquare,
          {
            scale: 1,
            rotation: 0,
            boxShadow: '0 0 0px rgba(255, 255, 255, 0.3)'
          },
          {
            scale: 1.2,
            rotation: 360,
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.8)',
            duration: 0.6,
            ease: 'elastic.out(1, 0.3)'
          }
        );
      }

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
