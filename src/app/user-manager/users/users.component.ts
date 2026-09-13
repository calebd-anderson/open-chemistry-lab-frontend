import {
  Component,
  inject,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NotificationType } from '@app/model/enum/notification-type.enum';
import { User } from '@app/model/user';
import { NotificationService } from '@app/service/notification.service';
import { AuthenticationService } from '@app/service/security/authentication.service';
import { UserService } from '@app/service/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SubSink } from 'subsink';
import { AuthorizationService } from '@app/service/security/authorization.service';
import { CustomHttpResponse } from '@app/model/custom-http-response';
import { MatDialog } from '@angular/material/dialog';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { UserComponent } from '../user-card/user.component';
import { AddUserComponent } from '../add-user/add-user.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@/app/component/button/button.component';

interface TableDef {
  id: string;
  label: string;
}

@Component({
  selector: 'app-users',
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    CommonModule,
    ButtonComponent,
  ],
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnDestroy {
  public users: User[] = [];
  public profileImageUrls: Record<string, string> = {};
  public user: User = {} as User;
  public refreshing: boolean = false;
  readonly dialog = inject(MatDialog);

  private subs = new SubSink();

  public authenticationService = inject(AuthenticationService);
  public authorizationService = inject(AuthorizationService);
  public userService: UserService = inject(UserService);
  public notificationService = inject(NotificationService);

  public isManager: boolean = this.authorizationService.isManager();
  public isAdmin: boolean = this.authorizationService.isAdmin();

  tableDef: TableDef[] = [
    { id: 'profileImgUrl', label: 'Photo' },
    { id: 'userId', label: 'User Id' },
    { id: 'firstName', label: 'First Name' },
    { id: 'lastName', label: 'Last Name' },
    { id: 'username', label: 'Username' },
    { id: 'email', label: 'Email' },
    { id: 'active', label: 'Status' },
    { id: 'actions', label: 'Actions' },
  ];
  columnsToDisplay: string[] = this.tableDef.map((data) => data.id);

  ngOnInit(): void {
    const cachedUser = this.authenticationService.getUserFromLocalCache();
    if (cachedUser) {
      this.user = cachedUser;
    }
    this.getUsers(true);
  }

  onClickNewUser(): void {
    const dialogRef = this.dialog.open(AddUserComponent);
    dialogRef.afterClosed().subscribe(() => {
      this.getUsers(false);
    });
  }

  public getUsers(showNotification: boolean): void {
    this.refreshing = true;
    this.subs.add(
      this.userService.getUsers().subscribe({
        next: (response: User[]) => {
          this.userService.addUsersToLocalCache(response);
          this.revokeProfileImageUrls();
          this.users = response;
          this.loadProfileImages(response);
          this.refreshing = false;
          if (showNotification) {
            this.notificationService.notify(
              NotificationType.SUCCESS,
              `${response.length} user(s) loaded successfully.`,
            );
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.refreshing = false;
          this.notificationService.notify(
            NotificationType.ERROR,
            errorResponse.error.message,
          );
        },
      }),
    );
  }

  public onSelectUser(selectedUser: User): void {
    // this.selectedUser = selectedUser;
    // this.clickButton('openUserInfo');
    const dialogRef = this.dialog.open(UserComponent, {
      data: { user: selectedUser },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        // this.animal.set(result);
      }
    });
  }

  public searchUsers(searchTerm: string): void {
    const results: User[] = [];
    const users = this.userService.getUsersFromLocalCache();
    if (users)
      for (const user of users) {
        if (
          user.firstName.toLowerCase().indexOf(searchTerm.toLowerCase()) !==
            -1 ||
          user.lastName.toLowerCase().indexOf(searchTerm.toLowerCase()) !==
            -1 ||
          user.username.toLowerCase().indexOf(searchTerm.toLowerCase()) !==
            -1 ||
          user.userId.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
        ) {
          results.push(user);
        }
      }
    this.users = results;
    if (results.length === 0 || !searchTerm) {
      this.users = this.userService.getUsersFromLocalCache();
    }
  }

  public onEditUser(event: Event, editUser: User): void {
    event.stopPropagation();
    // this.editUser = edit
    // this.clickButton('openUserEdit');
    const dialogRef = this.dialog.open(EditUserComponent, {
      data: { user: editUser },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        // this.animal.set(result);
      }
    });
  }

  public onDeleteUser(event: Event, username: string): void {
    event.stopPropagation();
    this.subs.add(
      this.userService.deleteUser(username).subscribe({
        next: (response: CustomHttpResponse) => {
          this.notificationService.notify(
            NotificationType.SUCCESS,
            `Deleted user: ${username}.`,
          );
          this.getUsers(false);
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

  public get currentUsername(): string {
    const user = this.authenticationService.getUserFromLocalCache();
    return user?.username || '';
  }

  private loadProfileImages(users: User[]): void {
    for (const user of users) {
      if (!user.profileImgUrl) continue;

      this.subs.add(
        this.userService.getUserProfileImage(user.profileImgUrl).subscribe({
          next: (image: Blob) => {
            this.profileImageUrls[user.userId] = URL.createObjectURL(image);
          },
        }),
      );
    }
  }

  private revokeProfileImageUrls(): void {
    for (const imageUrl of Object.values(this.profileImageUrls)) {
      URL.revokeObjectURL(imageUrl);
    }
    this.profileImageUrls = {};
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.revokeProfileImageUrls();
  }
}
