import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/service/security/authentication.service';
import { FlashCardService } from '@app/service/flashcard.service';
import { NotificationType } from '@app/model/enum/notification-type.enum';
import { NotificationService } from '@app/service/notification.service';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@/app/component/button/button.component';
import { FlashcardComponent } from './flashcard/flashcard.component';
import { Flashcard } from '@/app/model/flashcard.model';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

export interface CreateFlashcardInput extends Omit<Flashcard, 'id'> {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-flashcards',
  templateUrl: './flashcards.component.html',
  styleUrls: ['./flashcards.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormsModule, ButtonComponent, FlashcardComponent],
})
export class FlashcardsComponent implements OnInit {
  flashcards: Flashcard[] = [];
  allCards: boolean = false;

  private notificationService = inject(NotificationService);
  private authenticationService = inject(AuthenticationService);
  private router = inject(Router);
  private service = inject(FlashCardService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.loadFlashcards();
  }

  loadFlashcards(): void {
    this.authenticationService
      .getCurrentUser()
      .pipe(
        switchMap((user) =>
          this.getFlashcardsForUser(user.userId).pipe(
            catchError((error: HttpErrorResponse) => {
              this.handleFlashcardLoadError(error);
              return EMPTY;
            }),
          ),
        ),
        catchError(() => {
          this.router.navigateByUrl('/lab');
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((flashcards) => {
        this.flashcards = flashcards;
      });
  }

  public createFlashcard(flashcard: CreateFlashcardInput): void {
    this.authenticationService
      .getCurrentUser()
      .pipe(
        switchMap((user) =>
          this.service
            .createFlashcard({ ...flashcard, userId: user.userId })
            .pipe(
              tap(() =>
                this.notificationService.notify(
                  NotificationType.SUCCESS,
                  'Flashcard created successfully!',
                ),
              ),
              catchError((errorResponse: HttpErrorResponse) => {
                const errorMessage =
                  errorResponse.error?.message ||
                  (errorResponse.status === 401
                    ? 'Not authorized. Please login.'
                    : 'Failed to create flashcard.');

                this.notificationService.notify(
                  NotificationType.ERROR,
                  errorMessage,
                );
                return EMPTY;
              }),
              switchMap(() =>
                this.getFlashcardsForUser(user.userId).pipe(
                  catchError((error: HttpErrorResponse) => {
                    this.handleFlashcardLoadError(error);
                    return EMPTY;
                  }),
                ),
              ),
            ),
        ),
        catchError(() => {
          this.notificationService.notify(
            NotificationType.ERROR,
            'You must be logged in to create flashcards.',
          );
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((flashcards) => {
        this.flashcards = flashcards;
      });
  }

  private getFlashcardsForUser(userId: string): Observable<Flashcard[]> {
    return this.service.getFlashcardsByUserId(userId).pipe(
      map((response) =>
        [...response]
          .sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
          .map((flashcard) => ({ ...flashcard, flipped: false })),
      ),
    );
  }

  private handleFlashcardLoadError(error: HttpErrorResponse): void {
    if (error.status === 401) {
      this.router.navigateByUrl('/lab');
    } else {
      this.notificationService.notify(
        NotificationType.ERROR,
        'Failed to load flashcards. Please try again.',
      );
    }
  }

  displayCards(): void {
    this.allCards = !this.allCards;
  }

  onDelete(question: string): void {
    this.flashcards = this.flashcards.filter(
      (flashcard) => flashcard.question !== question,
    );
  }
}
