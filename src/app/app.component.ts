import { Component, OnInit, effect, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NotificationType } from './model/enum/notification-type.enum';
import { User } from './model/user';
import { AuthenticationService } from './service/security/authentication.service';
import { AuthorizationService } from './service/security/authorization.service';
import { NotificationService } from './service/notification.service';
import { WelcomeComponent } from './component/welcome/welcome.component';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from './component/user_manager/register/register.component';
import { TabsComponent } from './component/tabs/tabs.component';
import { LoginComponent } from './component/user_manager/login/login.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ChemLogo as ChemLogo } from './logo.component';
import { CloseIcon } from './close.component.svg';
import { LogoutIcon } from './logout.component.svg';
import { AdminIcon } from './admin.component.svg';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    RegisterComponent,
    MatButtonModule,
    MatSidenavModule,
    TabsComponent,
    LoginComponent,
    RouterOutlet,
    RouterLink,
    MatIconModule,
    ChemLogo,
    CloseIcon,
    LogoutIcon,
    AdminIcon,
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
    this.openMenu();
  }

  public onClickLogout(): void {
    this.authenticationService.logOut();
    this.isLoggedIn = false;
    this.user = null;
    this.router.navigate(['lab']);
    this.openMenu();
    this.sendNotification(
      NotificationType.SUCCESS,
      "You've been successfully logged out."
    );
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

  public openMenu() {
    const menu = document.getElementById('user-nav-menu');
    menu.classList.toggle('active');
  }
}
