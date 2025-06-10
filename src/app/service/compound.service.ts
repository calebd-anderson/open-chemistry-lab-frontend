import { Injectable } from '@angular/core';
import {observable, Observable, Subject} from "rxjs";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Compound } from "../model/compound";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CompoundService {
  public host = environment.apiUrl;
  subject = new Subject<void>();
  constructor(private http: HttpClient) { }

  public validate(payload: { data: any[]; userId: any; }): Observable<HttpResponse<Compound>> {
    console.log(payload.userId)
    return this.http.post<Compound>(`${this.host}/compound/validate`, payload, {observe: "response"});
  }
}
