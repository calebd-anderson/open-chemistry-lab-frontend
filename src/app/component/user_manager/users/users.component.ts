import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NotificationType } from 'src/app/model/enum/notification-type.enum';
import { User } from 'src/app/model/user';
import { NotificationService } from 'src/app/service/notification.service';
import { AuthenticationService } from 'src/app/service/security/authentication.service';
import { UserService } from 'src/app/service/user.service';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
} from '@angular/common/http';
import { SubSink } from 'subsink';
import { AuthorizationService } from 'src/app/service/security/authorization.service';
import { CustomHttpResponse } from 'src/app/model/custom-http-response';

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

  private subs = new SubSink();

  public authenticationService: AuthenticationService = inject(
    AuthenticationService,
  );
  public authorizationService: AuthorizationService =
    inject(AuthorizationService);
  public userService: UserService = inject(UserService);
  public notificationService: NotificationService = inject(NotificationService);

  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache();
    this.getUsers(true);
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
          this.notificationService.notify(
            NotificationType.ERROR,
            errorResponse.error.message,
          );
        },
      }),
    );
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

  public onEditUser(editUser: User): void {
    this.editUser = editUser;
    this.clickButton('openUserEdit');
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
}
