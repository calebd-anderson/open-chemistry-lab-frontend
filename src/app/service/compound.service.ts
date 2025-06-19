import { Injectable } from '@angular/core';
import {observable, Observable, Subject} from "rxjs";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Reaction, UserReaction } from "../model/compound";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CompoundService {
  public host = environment.apiUrl;
  subject = new Subject<void>();
  constructor(private http: HttpClient) { }

  public validate(payload: { elements: any[]; userId: any; }): Observable<HttpResponse<Reaction>> {
    return this.http.post<Reaction>(`${this.host}/compound/validate`, payload, {observe: "response"});
  }

  public getUserDiscoveries(userId: string): Observable<UserReaction[]> {
    return this.http.get<UserReaction[]>(`${this.host}/compound/getByUserId`, {
      params: {userId: userId},
    });
  }
}
