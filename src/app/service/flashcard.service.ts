import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FlashCardService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public createFlashcard(item: any): Observable<any> {
    // console.log(item);
    return this.http.post<any>(`${this.host}/flashcards/add`, item);
  }

  public getAllFlashcard(): Observable<any> {
    return this.http.get<any>(`${this.host}/flashcards/all`);
  }

  public getFlashcardsByUserId(userId: string): Observable<any> {
    return this.http.get<any>(`${this.host}/flashcards/userflashcards/${userId}`);
  }

}
