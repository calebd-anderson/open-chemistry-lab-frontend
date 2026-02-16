import { Component, inject, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { NotificationType } from '../../../model/enum/notification-type.enum';
import { User } from '../../../model/user';
import { AuthenticationService } from '../../../service/security/authentication.service';
import { NotificationService } from '../../../service/notification.service';
import { UserRegisterDto } from '../../../model/user-register-dto';
import { FormsModule } from '@angular/forms';
import {
  MatDialog,
  MatDialogContent,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [FormsModule, MatDialogContent, MatButtonModule, MatDialogModule],
})
export class RegisterComponent implements OnDestroy {
  public showLoading: boolean;
  private subscriptions: Subscription[] = [];
  readonly dialog = inject(MatDialog);

  constructor(
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
  ) {}

  public onRegister(user: UserRegisterDto): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.authenticationService.register(user).subscribe({
        next: (response: User) => {
          this.dialog.closeAll();
          this.showLoading = false;
          this.sendNotification(
            NotificationType.SUCCESS,
            `A new account was created for ${response.username}.`,
          );
        },
        error: (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);
          this.sendNotification(
            NotificationType.ERROR,
            errorResponse.error.message,
          );
          this.showLoading = false;
        },
      }),
    );
  }

  public onClickLogin(): void {
    this.dialog.closeAll();
    this.dialog.open(LoginComponent);
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

  // prevent memory leak
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
