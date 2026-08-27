import {
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NotificationType } from './model/enum/notification-type.enum';
import { User } from './model/user';
import { AuthenticationService } from './service/security/authentication.service';
import { NotificationService } from './service/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { TabsComponent } from './component/tabs/tabs.component';
import { FooterComponent } from './component/footer/footer.component';
import { UserNavComponent } from './component/user-manager/user-nav/user-nav.component';
import { MainHeaderComponent } from './component/main-header/main-header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    TabsComponent,
    RouterOutlet,
    FooterComponent,
    UserNavComponent,
    MainHeaderComponent,
  ],
})
export class AppComponent implements OnInit {
  protected user: WritableSignal<User | null> = signal<User | null>(null);

  public authenticationService: AuthenticationService = inject(
    AuthenticationService,
  );

  private notificationService: NotificationService =
    inject(NotificationService);

  public isLoggedIn: boolean = this.authenticationService.isLoggedIn();

  readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  ngOnInit(): void {
    const loginStatus = this.authenticationService.isLoggedIn();
    if (loginStatus) {
      this.isLoggedIn = true;
      let user = this.authenticationService.getUserFromLocalCache();
      if (user) {
        this.user.set(user);
      }
    }
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
}
