import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationType } from './model/enum/notification-type.enum';
import { User } from './model/user';
import { AuthenticationService } from './service/authentication.service';
import { AuthorizationService } from './service/authorization.service';
import { NotificationService } from './service/notification.service';
import { WelcomeComponent } from './component/welcome/welcome.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  title = 'Chem Lab';
  private authSubscription!: Subscription;
  
  public user: User;
  public isLoggedIn: boolean;

  private authenticationService: AuthenticationService = inject(AuthenticationService)
  private authorizationService: AuthorizationService = inject(AuthorizationService)
  private notificationService: NotificationService = inject(NotificationService)

  readonly dialog = inject(MatDialog);

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.authSubscription = this.authenticationService.isLoggedIn$.subscribe(loggedIn => {
        this.isLoggedIn = loggedIn;
    });
    this.dialog.open(WelcomeComponent);
  }

  openDialog() {
    this.dialog.open(WelcomeComponent);
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

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe(); // Prevent memory leaks
    }
  }
}
