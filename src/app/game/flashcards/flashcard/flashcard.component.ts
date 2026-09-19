import { Flashcard } from '@/app/model/flashcard.model';
import { FlashCardService } from '@/app/service/flashcard.service';
import { Component, inject, input, OnDestroy, output } from '@angular/core';
import { ButtonComponent } from '@/app/component/button/button.component';
import { NotificationService } from '@/app/service/notification.service';
import { NotificationType } from '@/app/model/enum/notification-type.enum';
import { SubSink } from 'subsink';

@Component({
  imports: [ButtonComponent],
  selector: 'app-flashcard',
  styleUrl: './flashcard.component.scss',
  templateUrl: './flashcard.component.html',
})
export class FlashcardComponent implements OnDestroy {
  private service = inject(FlashCardService);
  private notificationService = inject(NotificationService);
  private subs = new SubSink();
  deleteEvent = output<string>();

  flashcard = input.required<Flashcard>();

  flipCard(): void {
    this.flashcard().flipped = !this.flashcard().flipped;
  }

  delete(): void {
    this.subs.add(
      this.service.deleteUserFlashcard(this.flashcard().question).subscribe({
        next: () => {
          this.deleteEvent.emit(this.flashcard().question);
          this.notificationService.notify(
            NotificationType.SUCCESS,
            'Deleted flashcard.',
          );
        },
        error: () => {
          console.error('delete error');
        },
      }),
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
