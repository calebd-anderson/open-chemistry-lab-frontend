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
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';

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
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  public users: User[] | null = [];
  public user: User = new User();
  public refreshing: boolean = false;
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
    this.user = this.authenticationService.getUserFromLocalCache();
    this.getUsers(true);
  }

  onClickNewUser(): void {
    const dialogRef = this.dialog.open(AddUserComponent);

    dialogRef.afterClosed().subscribe((result) => {
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

  public onEditUser(event: MouseEvent, editUser: User): void {
    event.stopPropagation();
    // this.editUser = editUser;
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
