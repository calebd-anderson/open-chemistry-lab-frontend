import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { NotificationType } from '../../../model/enum/notification-type.enum';
import { AuthenticationService } from '../authentication.service';
import { NotificationService } from '../../notification.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationGuard {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.authenticationService.isLoggedIn();
  }
}
