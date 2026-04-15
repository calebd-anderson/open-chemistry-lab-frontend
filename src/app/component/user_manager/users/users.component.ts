import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NotificationType } from '@app/model/enum/notification-type.enum';
import { User } from '@app/model/user';
import { NotificationService } from '@app/service/notification.service';
import { AuthenticationService } from '@app/service/security/authentication.service';
import { UserService } from '@app/service/user.service';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
} from '@angular/common/http';
import { SubSink } from 'subsink';
import { AuthorizationService } from '@app/service/security/authorization.service';
import { CustomHttpResponse } from '@app/model/custom-http-response';
import { MatDialog } from '@angular/material/dialog';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { UserComponent } from '../user/user.component';
import { AddUserComponent } from '../add-user/add-user.component';

@Component({
  selector: 'app-users',
  imports: [FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  public users: User[];
  public user: User;
  public refreshing: boolean;
  readonly dialog = inject(MatDialog);

  private subs = new SubSink();

  public authenticationService: AuthenticationService = inject(
    AuthenticationService,
  );
  public authorizationService: AuthorizationService =
    inject(AuthorizationService);
  public userService: UserService = inject(UserService);
  public notificationService: NotificationService = inject(NotificationService);

  public isManager: boolean = this.authorizationService.isManager;
  public isAdmin: boolean = this.authorizationService.isAdmin;

  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache();
    this.getUsers(true);
  }

  onClickNewUser(): void {
    const dialogRef = this.dialog.open(AddUserComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        // this.animal.set(result);
      }
    });
  }

  public getUsers(showNotification: boolean): void {
    this.refreshing = true;
    this.subs.add(
      this.userService.getUsers().subscribe({
        next: (response: User[]) => {
          this.userService.addUsersToLocalCache(response);
          this.users = response;
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
      console.log('The dialog was closed');
      if (result !== undefined) {
        // this.animal.set(result);
      }
    });
  }

  public searchUsers(searchTerm: string): void {
    const results: User[] = [];
    for (const user of this.userService.getUsersFromLocalCache()) {
      if (
        user.firstName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        user.lastName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        user.username.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
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

  public onEditUser(event: MouseEvent, editUser: User): void {
    event.stopPropagation();
    // this.editUser = editUser;
    // this.clickButton('openUserEdit');
    const dialogRef = this.dialog.open(EditUserComponent, {
      data: { user: editUser },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        // this.animal.set(result);
      }
    });
  }

  public onDeleteUser(username: string): void {
    this.subs.add(
      this.userService.deleteUser(username).subscribe({
        next: (response: CustomHttpResponse) => {
          this.notificationService.notify(
            NotificationType.SUCCESS,
            response.message,
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
    return this.authenticationService.getUserFromLocalCache().username;
  }
}
