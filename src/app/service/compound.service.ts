import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Reaction, UserReaction } from '../model/compound';
import { environment } from '../../environments/environment';
import { ClusterMapResponse } from '../model/clustmapresp.model';

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

  public validate(payload: ValidateCompoundPayload, context?: HttpContext): Observable<HttpResponse<Reaction>> {
    return this.http.post<Reaction>(`${this.host}/compound/validate`, payload, {
      observe: 'response',
      context: context || new HttpContext()
    });
  }

  public analyze(payload: ValidateCompoundPayload, context?: HttpContext): Observable<HttpResponse<ClusterMapResponse>> {
    return this.http.post<ClusterMapResponse>(`${this.host}/compound/analyze`, payload, {
      observe: 'response',
      context: context || new HttpContext()
    });
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
