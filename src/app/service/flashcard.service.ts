import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

export interface Flashcard {
  id?: number;
  term: string;
  question: string;
  answer: string;
  userId?: string;
  flipped?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FlashCardService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public createFlashcard(flashcard: Flashcard): Observable<Flashcard> {
    return this.http.post<Flashcard>(`${this.host}/flashcards/add`, flashcard);
  }

  public getAllFlashcard(): Observable<Flashcard[]> {
    return this.http.get<Flashcard[]>(`${this.host}/flashcards/all`);
  }

  public getFlashcardsByUserId(userId: string): Observable<Flashcard[]> {
    return this.http.get<Flashcard[]>(`${this.host}/flashcards/userflashcards/${userId}`);
  }

}
