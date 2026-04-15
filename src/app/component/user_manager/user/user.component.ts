import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
} from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { SubSink } from 'subsink';
import { NotificationType } from '../../../model/enum/notification-type.enum';
import { Role } from '../../../model/enum/role.enum';
import { CustomHttpResponse } from '../../../model/custom-http-response';
import { FileUploadStatus } from '../../../model/file-upload-status';
import { User } from '../../../model/user';
import { AuthenticationService } from '../../../service/security/authentication.service';
import { NotificationService } from '../../../service/notification.service';
import { UserService } from '../../../service/user.service';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthorizationService } from '@app/service/security/authorization.service';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DialogData } from '../edit-user/edit-user.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  // imports: [CommonModule, FormsModule, MatDialogContent],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    DatePipe,
  ],
})
export class UserComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  public refreshing: boolean;
  readonly dialogRef = inject(MatDialogRef<UserComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  private titleSubject = new BehaviorSubject<string>('Users');
  public titleAction$ = this.titleSubject.asObservable();
  public user: User;
  public selectedUser: User = this.data.user;
  public profileImg: File;

  public fileStatus = new FileUploadStatus();

  private authenticationService: AuthenticationService = inject(
    AuthenticationService,
  );
  private authorizationService: AuthorizationService =
    inject(AuthorizationService);
  private userService: UserService = inject(UserService);
  private notificationService: NotificationService =
    inject(NotificationService);

  public isAdmin = this.authorizationService.isAdmin;
  public isManager = this.authorizationService.isManager;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public changeTitle(title: string): void {
    this.titleSubject.next(title);
  }

  public onUpdateCurrentUser(user: User): void {
    this.refreshing = true;
    const formData = this.userService.createUserFormData(
      this.currentUsername,
      user,
      this.profileImg,
    );
    this.subs.add(
      this.userService.updateUser(formData).subscribe({
        next: (response: User) => {
          this.authenticationService.addUserToLocalCache(response);
          // this.getUsers(false);
          // this.fileName = null;
          // this.profileImg = null;
          this.authenticationService.updateUser(response);
          this.notificationService.notify(
            NotificationType.SUCCESS,
            `${response.firstName} ${response.lastName} updated successfully.`,
          );
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificationService.notify(
            NotificationType.ERROR,
            errorResponse.error.message,
          );
          this.refreshing = true;
          // this.profileImg = null;
        },
      }),
    );
  }

  public onUpdateProfileImage() {
    const formData = new FormData();
    formData.append('username', this.user.username);
    formData.append('profileImg', this.profileImg);
    this.subs.add(
      this.userService.updateProfileImage(formData).subscribe({
        next: (event: HttpEvent<any>) => {
          this.reportUploadProgress(event);
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificationService.notify(
            NotificationType.ERROR,
            errorResponse.error.message,
          );
          this.fileStatus.status = 'done';
        },
      }),
    );
  }

  private reportUploadProgress(event: HttpEvent<any>): void {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        this.fileStatus.percentage = Math.round(
          (100 * event.loaded) / event.total,
        );
        this.fileStatus.status = 'progress';
        break;
      case HttpEventType.Response:
        if (event.status === 200) {
          this.user.profileImgUrl = `${
            event.body.profileImgUrl
          }?time=${new Date().getTime()}`;
          this.notificationService.notify(
            NotificationType.SUCCESS,
            `${event.body.firstName}\'s profile image updated successfully.`,
          );
          this.fileStatus.status = 'done';
          break;
        } else {
          this.notificationService.notify(
            NotificationType.ERROR,
            'Unable to upload image. Please try again.',
          );
          break;
        }
      default:
        'end';
    }
  }

  public updateProfileImage(): void {
    // this.clickButton('profile-image-input');
  }

  public onLogOut(): void {
    this.authenticationService.logOut();
    // this.loggedInUser.emit(null);
    this.notificationService.notify(
      NotificationType.SUCCESS,
      "You've been successfully logged out.",
    );
    this.router.navigate(['lab']);
  }

  public onResetPassword(emailForm: NgForm): void {
    this.refreshing = true;
    const emailAddress = emailForm.value['reset-password-email'];
    this.subs.add(
      this.userService.resetPassword(emailAddress).subscribe({
        next: (response: CustomHttpResponse) => {
          this.notificationService.notify(
            NotificationType.SUCCESS,
            response.message,
          );
          this.refreshing = false;
        },
        error: (error: HttpErrorResponse) => {
          this.notificationService.notify(
            NotificationType.WARNING,
            error.error.message,
          );
          this.refreshing = false;
        },
        complete: () => emailForm.reset(),
      }),
    );
  }

  public get currentUsername(): string {
    return this.authenticationService.getUserFromLocalCache().username;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
