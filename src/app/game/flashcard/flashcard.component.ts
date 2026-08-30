import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '@app/service/security/authentication.service';
import { FlashCardService, Flashcard } from '@app/service/flashcard.service';
import { NotificationType } from '@app/model/enum/notification-type.enum';
import { NotificationService } from '@app/service/notification.service';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@/app/component/button/button.component';

export interface CreateFlashcardInput extends Omit<Flashcard, 'id'> {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-flashcard',
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.scss'],
  imports: [FormsModule, ButtonComponent],
})
export class FlashcardComponent implements OnInit {
  flashcards: Flashcard[] = [];
  allCards: boolean = false;

  private notificationService = inject(NotificationService);
  private authenticationService = inject(AuthenticationService);
  private router = inject(Router);
  private service = inject(FlashCardService);

  ngOnInit(): void {
    this.loadFlashcards();
  }

  loadFlashcards(): void {
    const user = this.authenticationService.getUserFromLocalCache();
    if (!user || !user.userId) {
      this.router.navigateByUrl('/lab');
      return;
    }

    const userId = user.userId;
    this.service.getFlashcardsByUserId(userId).subscribe({
      next: (response: Flashcard[]) => {
        this.flashcards = response
          .sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
          .map((flashcard) => ({ ...flashcard, flipped: false }));
      },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.status === 401) {
          this.router.navigateByUrl('/lab');
        } else {
          this.notificationService.notify(
            NotificationType.ERROR,
            'Failed to load flashcards. Please try again.',
          );
        }
      },
    });
  }

  flipCard(index: number): void {
    if (index < 0 || index >= this.flashcards.length) return;

    this.flashcards[index].flipped = !this.flashcards[index].flipped;
  }

  public createFlashcard(flashcard: CreateFlashcardInput): void {
    const user = this.authenticationService.getUserFromLocalCache();
    if (!user || !user.userId) {
      this.notificationService.notify(
        NotificationType.ERROR,
        'You must be logged in to create flashcards.',
      );
      return;
    }

    const userId = user.userId;

    flashcard.userId = userId;

    this.service.createFlashcard(flashcard).subscribe({
      next: () => {
        this.loadFlashcards();
        this.notificationService.notify(
          NotificationType.SUCCESS,
          'Flashcard created successfully!',
        );
      },
      error: (errorResponse: HttpErrorResponse) => {
        const errorMessage =
          errorResponse.error?.message || errorResponse.status === 401
            ? 'Not authorized. Please login.'
            : 'Failed to create flashcard.';

        this.notificationService.notify(NotificationType.ERROR, errorMessage);
      },
    });
  }

  displayCards(): void {
    this.allCards = !this.allCards;
  }
}
