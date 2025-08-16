import { Component, OnInit, effect, inject, output } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NotificationType } from './model/enum/notification-type.enum';
import { User } from './model/user';
import { AuthenticationService } from './service/security/authentication.service';
import { AuthorizationService } from './service/security/authorization.service';
import { NotificationService } from './service/notification.service';
import { WelcomeComponent } from './component/welcome/welcome.component';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from './component/user_manager/register/register.component';
import { MatDrawerContainer } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
// import { f } from '@angular/material';
import { MatDrawer } from '@angular/material/sidenav';
// import { AppRoutingModule } from './app-routing.module';
import { TabsComponent } from './component/tabs/tabs.component';
import { LoginComponent } from './component/user_manager/login/login.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Element } from './model/element.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    RegisterComponent,
    MatButtonModule,
    MatDrawerContainer,
    MatToolbar,
    MatDrawer,
    TabsComponent,
    LoginComponent,
    RouterOutlet,
    MatIconModule,
  ],
})
export class AppComponent implements OnInit {
  title = 'Chem Lab';

  public user: User;
  public isLoggedIn: boolean;

  public authenticationService: AuthenticationService = inject(
    AuthenticationService
  );
  private authorizationService: AuthorizationService =
    inject(AuthorizationService);
  private notificationService: NotificationService =
    inject(NotificationService);

  readonly dialog = inject(MatDialog);

  constructor(private router: Router) {
    effect(() => {
      console.log(
        `The current login status is: ${this.authenticationService.getIsLoggedIn()}`
      );
      let user: User = this.authenticationService.getUserFromLocalCache();
      this.user = user;
    });
  }

  ngOnInit(): void {
    const loginStatus = this.authenticationService.getIsLoggedIn();
    if (loginStatus) {
      this.isLoggedIn = true;
    }
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
    this.sendNotification(
      NotificationType.SUCCESS,
      "You've been successfully logged out."
    );
    this.isLoggedIn = false;
    this.user = null;
    document.getElementById('navDrawr').click();
    this.router.navigate(['lab']);
  }

  public get isAdmin(): boolean {
    if (this.isLoggedIn) return this.authorizationService.isAdmin;
    else return false;
  }

  private sendNotification(
    notificationType: NotificationType,
    message: string
  ): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(
        notificationType,
        'An error occured. Please try again.'
      );
    }
  }
}
