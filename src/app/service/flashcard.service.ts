import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Flashcard } from '../model/flashcard.model';

@Injectable({
  providedIn: 'root',
})
export class FlashCardService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getAllFlashcard(): Observable<Flashcard[]> {
    return this.http.get<Flashcard[]>(`${this.host}/flashcards/all`);
  }

  public createFlashcard(flashcard: Flashcard): Observable<Flashcard> {
    return this.http.post<Flashcard>(`${this.host}/flashcards/add`, flashcard);
  }

  public getUserFlashcards(): Observable<Flashcard[]> {
    return this.http.get<Flashcard[]>(
      `${this.host}/flashcards`,
    );
  }

  public deleteUserFlashcard(question: string) {
    return this.http.delete(`${this.host}/flashcards/delete`, {
      params: { question: question },
    });
  }
}
