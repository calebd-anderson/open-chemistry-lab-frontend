import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Element } from '../model/element.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ElementService {
  private host = environment.apiUrl;

  private http = inject(HttpClient);

  public getElements(): Observable<Element[]> {
    return this.http.get<Element[]>(`${this.host}/elements/list`);
  }
}
