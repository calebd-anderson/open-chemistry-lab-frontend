import {
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NotificationType } from './model/enum/notification-type.enum';
import { User } from './model/user';
import { AuthenticationService } from './service/security/authentication.service';
import { AuthorizationService } from './service/security/authorization.service';
import { NotificationService } from './service/notification.service';
import { WelcomeComponent } from './component/welcome/welcome.component';
import { MatDialog } from '@angular/material/dialog';
import { TabsComponent } from './component/tabs/tabs.component';
import { LoginComponent } from './component/user_manager/login/login.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ChemLogo as ChemLogo } from './logo.component';
import { CloseIcon } from './close.component.svg';
import { LogoutIcon } from './logout.component.svg';
import { AdminIcon } from './admin.component.svg';
import { RegisterComponent } from './component/user_manager/register/register.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    MatButtonModule,
    MatSidenavModule,
    TabsComponent,
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

  readonly user: WritableSignal<User> = signal<User>(new User());

  public isLoggedIn: boolean;

  public authenticationService: AuthenticationService = inject(
    AuthenticationService,
  );
  private authorizationService: AuthorizationService =
    inject(AuthorizationService);
  private notificationService: NotificationService =
    inject(NotificationService);

  readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  ngOnInit(): void {
    const loginStatus = this.authenticationService.getIsLoggedIn();
    if (loginStatus) {
      this.isLoggedIn = true;
      let user: User = this.authenticationService.getUserFromLocalCache();
      this.user.set(user);
    }
    this.dialog.open(WelcomeComponent);
  }

  openLogin() {
    const dialogRef = this.dialog.open(LoginComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (typeof result == 'object') {
        this.isLoggedIn = true;
        this.user.set(result);
      } else if (result === 'register') {
        this.openRegister();
      } 
    });
  }

  openRegister() {
    const dialogRef = this.dialog.open(RegisterComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.openLogin();
      }
    });
  }

  openDialog() {
    this.dialog.open(WelcomeComponent);
  }

  getLoggedIn(newItem: User) {
    this.user.set(newItem);
    this.isLoggedIn = true;
  }

  public onClickProfile(): void {
    this.router.navigate(['/profile']);
    this.openMenu();
  }

  public onClickLogout(): void {
    this.authenticationService.logOut();
    this.isLoggedIn = false;
    this.user.set(null);
    this.router.navigate(['lab']);
    this.openMenu();
    this.sendNotification(
      NotificationType.SUCCESS,
      "You've been successfully logged out.",
    );
  }

  public get isAdmin(): boolean {
    if (this.isLoggedIn) return this.authorizationService.isAdmin;
    else return false;
  }

  private sendNotification(
    notificationType: NotificationType,
    message: string,
  ): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(
        notificationType,
        'An error occured. Please try again.',
      );
    }
  }

  public openMenu() {
    const menu = document.getElementById('user-nav-menu');
    menu.classList.toggle('active');
  }
}
