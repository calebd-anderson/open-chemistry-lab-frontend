import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { UserQuiz } from '../model/quiz';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private apiServerUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getQuiz(): Observable<UserQuiz[]> {
    return this.http.get<UserQuiz[]>(`${this.apiServerUrl}/quiz/all`);
  }

  public create(quiz: UserQuiz): Observable<UserQuiz> {
    return this.http.put<UserQuiz>(`${this.apiServerUrl}/quiz/add`, quiz);
  }

  public getQuizByUserId(userId: string): Observable<UserQuiz[]> {
    return this.http.get<UserQuiz[]>(
      `${this.apiServerUrl}/quiz/getbyuserid/${userId}`,
    );
  }

  public deleteQuiz(gameId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/quiz/delete/${gameId}`);
  }
}
