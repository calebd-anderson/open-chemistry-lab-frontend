import { Flashcard } from '@/app/model/flashcard.model';
import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-flashcard',
  styleUrl: './flashcard.component.scss',
  templateUrl: './flashcard.component.html',
})
export class FlashcardComponent {
  flashcard = input.required<Flashcard>();

  flipCard(): void {
    this.flashcard().flipped = !this.flashcard().flipped;
  }
}
