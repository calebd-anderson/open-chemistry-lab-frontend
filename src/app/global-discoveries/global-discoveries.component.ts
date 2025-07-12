import { Component, inject, OnInit } from '@angular/core';
import { CompoundService } from '../service/compound.service';
import { SubSink } from 'subsink';
import { AuthenticationService } from '../service/security/authentication.service';
import { NotificationService } from '../service/notification.service';
import { NotificationType } from '../model/enum/notification-type.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { Reaction } from '../model/compound';
import { AuthorizationService } from '../service/security/authorization.service';

@Component({
  selector: 'app-global-discoveries',
  imports: [],
  templateUrl: './global-discoveries.component.html',
  styleUrl: './global-discoveries.component.scss'
})
export class GlobalDiscoveriesComponent {

  readonly compoundService = inject(CompoundService)
  readonly authenticationService = inject(AuthenticationService)
  readonly authorizationService = inject(AuthorizationService)
  readonly _snackBar = inject(NotificationService)

  public isLoggedIn: boolean;

  public get isAdmin(): boolean {
    if(this.isLoggedIn)
      return this.authorizationService.isAdmin;
    else return false;
  }

  public discoveries: Reaction[] = []
  public loading: boolean = false;

  private subs = new SubSink();

  ngOnInit(): void {

    this.loading = true;

    if (this.authenticationService.isUserLoggedIn()) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }

    this.subs.add(
      this.compoundService.getAllDiscoveries().subscribe({
        next: (response: Reaction[]) => {
          this.discoveries = response
        },
        error: (errorResponse: HttpErrorResponse) => {
          this._snackBar.notify(NotificationType.ERROR, "Failed to get global discoveries.");
        },
        complete:() => {
          this.loading = false;
        }
      })
    );
  }
}
