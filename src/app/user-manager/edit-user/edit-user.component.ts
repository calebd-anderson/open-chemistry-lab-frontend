import {
  ChangeDetectionStrategy,
  Component,
  ChangeDetectorRef,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserService } from '@app/service/user.service';
import { SubSink } from 'subsink';
import { MatInputModule } from '@angular/material/input';
import { NotificationType } from '@app/model/enum/notification-type.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '@app/service/notification.service';
import { User } from '@app/model/user';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogTitle,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { AuthorizationService } from '@app/service/security/authorization.service';

export interface DialogData {
  user: User;
}

@Component({
  selector: 'app-edit-user',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditUserComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  public userService: UserService = inject(UserService);
  notificationService = inject(NotificationService);
  authorizationService = inject(AuthorizationService);

  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  public editUser = this.data.user;
  public fileName: string = '?';
  public profileImg: File | undefined = undefined;
  public profileImageUrl = '';
  private profileImageObjectUrl: string | undefined;
  private changeDetectorRef = inject(ChangeDetectorRef);

  ngOnInit(): void {
    if (!this.editUser.profileImgUrl) return;

    this.subs.add(
      this.userService.getUserProfileImage(this.editUser.profileImgUrl).subscribe({
        next: (image: Blob) => {
          this.setProfileImageUrl(URL.createObjectURL(image));
          this.changeDetectorRef.markForCheck();
        },
      }),
    );
  }

  public isManager = this.authorizationService.isManager;
  public isAdmin = this.authorizationService.isAdmin;

  public onProfileImageChange(fileName: string, profileImag: File): void {
    this.fileName = fileName;
    this.profileImg = profileImag;
    this.setProfileImageUrl(URL.createObjectURL(profileImag));
  }

  private setProfileImageUrl(imageUrl: string): void {
    if (this.profileImageObjectUrl) {
      URL.revokeObjectURL(this.profileImageObjectUrl);
    }

    this.profileImageObjectUrl = imageUrl;
    this.profileImageUrl = imageUrl;
  }

  public onUpdateUser(): void {
    const formData = this.userService.createEditUserFormData(
      this.editUser.userId,
      this.editUser,
      this.profileImg,
    );
    this.subs.add(
      this.userService.updateUser(formData).subscribe({
        next: (response: User) => {
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
        },
      }),
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    if (this.profileImageObjectUrl) {
      URL.revokeObjectURL(this.profileImageObjectUrl);
    }
  }
}
