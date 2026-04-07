import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HeaderType } from '../../../model/enum/header-type.enum';
import { NotificationType } from '../../../model/enum/notification-type.enum';
import { User } from '../../../model/user';
import { AuthenticationService } from '../../../service/security/authentication.service';
import { NotificationService } from '../../../service/notification.service';
import {
  MatDialogContent,
  MatDialogActions,
  MatDialogModule,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatDialogModule,
  ],
})
export class LoginComponent implements OnDestroy {
  public showLoading: boolean;
  private subscriptions: Subscription[] = [];
  public isLoggedIn: boolean;
  readonly dialog = inject(MatDialog);
  readonly dialogRef = inject(MatDialogRef<LoginComponent>);

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
  ) {}

  public onClickRegister(): void {
    this.dialogRef.close('register');
  }

  public onLogin(userForm: NgForm): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.authenticationService.login(userForm.value).subscribe({
        next: (response: HttpResponse<User>) => {
          const token = response.headers.get(HeaderType.JWT_TOKEN);
          const user: User = response.body;
          this.authenticationService.saveToken(token);
          this.authenticationService.addUserToLocalCache(user);
          this.router.navigateByUrl('lab');
          userForm.reset();
          this.authenticationService.setIsLoggedIn(true);
          this.sendNotification(
            NotificationType.SUCCESS,
            "You've been successfully logged in.",
          );
          this.dialogRef.close(user);
          this.showLoading = false;
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.authenticationService.setIsLoggedIn(false);
          this.sendNotification(
            NotificationType.ERROR,
            errorResponse.error.message,
          );
          this.showLoading = false;
        },
      }),
    );
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
