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
  private readonly CACHE_NAME = 'elements-cache';

  public getElements(): Element[] {
    const request = new Request(`${this.host}/elements/list`);
    let elements: Element[] = [];

    caches
      .open(this.CACHE_NAME)
      .then((cache) => cache.match(request.url))
      .then((response) => {
        if (response) {
          // Do something with the cached response
          console.log('tada');
          response.json().then((json: Element[]) => {
            elements = json;
          });
        } else {
          // The response is not cached, fetch it from the network
          fetch(request.url).then((response: Response) => {
            // Clone the response as it can only be consumed once
            const clonedResponse = response.clone();
            caches
              .open(this.CACHE_NAME)
              .then((cache) => cache.put(request, clonedResponse));
            response.json().then((json: Element[]) => {
              elements = json;
            });
          });
        }
      });
    // return this.http.get<Element[]>(request.url);
    return elements;
  }
}
