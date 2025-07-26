import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExperimentService {
	public isActive = signal(false);

  getIsActive(): boolean {
    return this.isActive();
  }
  
  setIsActive(activeStatus: boolean): void {
    this.isActive.update(() => activeStatus)
  }
}
