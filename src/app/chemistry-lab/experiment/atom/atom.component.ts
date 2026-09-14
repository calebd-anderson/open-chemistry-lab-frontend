import { Element } from '@/app/model/element.model';
import { Component, input, output } from '@angular/core';

interface Atom { element: Element; id: number }

@Component({
  imports: [],
  selector: 'app-atom',
  styleUrl: './atom.component.scss',
  templateUrl: './atom.component.html',
})
export class AtomComponent {
  atom = input.required<Atom>();
  index = input.required<number>();
  removeAtomEvent = output<Object>();

  public removeElementFromCompound(i: number, element: Element) {
    const eventParams = {i, element} as Object;
    this.removeAtomEvent.emit(eventParams);
  }
}
