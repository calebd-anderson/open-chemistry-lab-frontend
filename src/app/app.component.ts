import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationType } from './enum/notification-type.enum';
import { User } from './model/user';
import { AuthenticationService } from './service/authentication.service';
import { AuthorizationService } from './service/authorization.service';
import { NotificationService } from './service/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  
  title = 'Chem Lab';

  public user: User;
  public isLoggedIn: boolean;

  private authenticationService: AuthenticationService = inject(AuthenticationService)
  private authorizationService: AuthorizationService = inject(AuthorizationService)
  private notificationService: NotificationService = inject(NotificationService)

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.authenticationService.currentUser.subscribe(user => this.user = user);
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }

  getLoggedIn(newItem: User) {
    this.user = newItem;
    this.isLoggedIn = true;
  }

  public onClickProfile(): void {
    this.router.navigate(['/profile']);
  }

  public onClickLogout(): void {
    this.authenticationService.logOut();
    this.sendNotification(NotificationType.SUCCESS, "You've been successfully logged out.");
    this.isLoggedIn = false;
    this.user = null;
    document.getElementById("navDrawr").click();
    this.router.navigate(['sandbox']);
  }
  
  public get isAdmin(): boolean {
    if(this.isLoggedIn)
      return this.authorizationService.isAdmin;
    else return false;
  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, "An error occured. Please try again.");
    }
  }
}
