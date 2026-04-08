import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Element } from '../model/element.model';

@Injectable({
  providedIn: 'root',
})
export class ElementService {
  private host = environment.apiUrl;
  private readonly CACHE_NAME = 'elements-cache';

  public async getElements(): Promise<Element[]> {
    const request = new Request(`${this.host}/elements/list`);
    let elements: Element[] = [];

    const cache = await caches.open(this.CACHE_NAME);
    const response = await cache.match(request.url);
    if (response) {
      // Do something with the cached response
      elements = await response.json();
      return elements;
    } else {
      // The response is not cached, fetch it from the network
      const response = await fetch(request.url);
      // Clone the response as it can only be consumed once
      const clonedResponse = response.clone();
      cache.put(request, clonedResponse);
      elements = await response.json();
      return elements;
    }
  }
}
