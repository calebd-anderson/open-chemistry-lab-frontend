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
import { MatDialog } from '@angular/material/dialog';
import { TabsComponent } from './component/tabs/tabs.component';
import { LoginComponent } from './component/user_manager/login/login.component';
import { ChemLogo as ChemLogo } from './logo.component';
import { RegisterComponent } from './component/user_manager/register/register.component';
import { FooterComponent } from './component/footer/footer.component';
import { UserNavComponent } from './component/user_manager/user-nav/user-nav.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    TabsComponent,
    RouterOutlet,
    ChemLogo,
    FooterComponent,
    UserNavComponent
  ],
})
export class AppComponent implements OnInit {
  protected user: WritableSignal<User> = signal<User>(new User());

  public authenticationService: AuthenticationService = inject(
    AuthenticationService,
  );

  private notificationService: NotificationService =
    inject(NotificationService);

  public isLoggedIn: boolean = this.authenticationService.getIsLoggedIn();
  public isMenuOpen: boolean = false;

  readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  ngOnInit(): void {
    const loginStatus = this.authenticationService.getIsLoggedIn();
    if (loginStatus) {
      this.isLoggedIn = true;
      let user: User = this.authenticationService.getUserFromLocalCache();
      this.user.set(user);
    }
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

  getLoggedIn(newItem: User) {
    this.user.set(newItem);
    this.isLoggedIn = true;
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
    if (menu) {
      // Close the menu when clicking outside of it
      const handleClickOutside = (event: MouseEvent) => {
        const isClickInsideMenu = menu.contains(event.target as Node);
        const isClickOnProfileImage = (event.target as Element).closest('.profileInfo');

        if (!isClickInsideMenu && !isClickOnProfileImage) {
          menu.classList.remove('active');
          this.isMenuOpen = false;
          document.removeEventListener('click', handleClickOutside);
        }
      };

      // Toggle the menu
      menu.classList.toggle('active');
      console.log(menu.classList)
    }
  }
}
