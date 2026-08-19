import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Reaction, UserReaction } from '../model/compound';
import { environment } from '../../environments/environment';

export interface ValidateCompoundPayload {
  elements: Array<{ symbol: string; numberOfAtoms: number }>;
  userId: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class CompoundService {
  public host = environment.apiUrl;
  subject = new Subject<void>();

  constructor(private http: HttpClient) { }

  public validate(payload: ValidateCompoundPayload): Observable<HttpResponse<Reaction>> {
    return this.http.post<Reaction>(`${this.host}/compound/validate`, payload, { observe: 'response' });
  }

  public getAllDiscoveries(): Observable<Reaction[]> {
    return this.http.get<Reaction[]>(`${this.host}/compound/getAllDiscoveries`);
  }

  public getUserDiscoveries(userId: string): Observable<UserReaction[]> {
    return this.http.get<UserReaction[]>(`${this.host}/compound/getByUserId`, {
      params: { userId },
    });
  }
}
