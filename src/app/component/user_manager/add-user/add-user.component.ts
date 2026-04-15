import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NotificationType } from '@app/model/enum/notification-type.enum';
import { User } from '@app/model/user';
import { NotificationService } from '@app/service/notification.service';
import { AuthorizationService } from '@app/service/security/authorization.service';
import { UserService } from '@app/service/user.service';
import { SubSink } from 'subsink';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-user',
  imports: [
    FormsModule,
    MatDialogActions,
    MatDialogTitle,
    MatDialogClose,
    MatButtonModule,
    MatDialogContent,
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddUserComponent implements OnDestroy {
  private userService: UserService = inject(UserService);
  private notificationService: NotificationService =
    inject(NotificationService);
  private authorizationService: AuthorizationService =
    inject(AuthorizationService);
  public isAdmin: boolean = this.authorizationService.isAdmin;
  public isManager: boolean = this.authorizationService.isManager;

  private subs = new SubSink();

  public fileName: string;
  private profileImg: File;

  public onProfileImageChange(fileName: string, profileImag: File): void {
    this.fileName = fileName;
    this.profileImg = profileImag;
  }

  public onAddNewUser(userForm: NgForm): void {
    const formData = this.userService.createUserFormData(
      null,
      userForm.value,
      this.profileImg,
    );
    this.subs.add(
      this.userService.addUser(formData).subscribe({
        next: (response: User) => {
          // this.clickButton('new-user-close');
          // this.getUsers(false);
          // this.fileName = null;
          // this.profileImg = null;
          userForm.reset();
          this.notificationService.notify(
            NotificationType.SUCCESS,
            `${response.firstName} ${response.lastName} added successfully.`,
          );
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.notificationService.notify(
            NotificationType.ERROR,
            errorResponse.error.message,
          );
        },
      }),
    );
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
