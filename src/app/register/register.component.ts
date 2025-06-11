import { Component, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { User } from '../model/user';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
import { UserRegisterDto } from '../model/user-register-dto';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: false
})
export class RegisterComponent implements OnDestroy {

  public showLoading: boolean;
  private subscriptions: Subscription[] = [];

  constructor(private authenticationService: AuthenticationService, 
    private notificationService: NotificationService) { }


  public onRegister(user: UserRegisterDto): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.authenticationService.register(user).subscribe({
        next: (response: User) => {
          document.getElementById("close-register-modal").click();
          this.showLoading = false;
        	this.sendNotification(NotificationType.SUCCESS, `A new account was created for ${response.username}.`);
        },
        error: (errorResponse: HttpErrorResponse) => {
        	console.log(errorResponse);
        	this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        	this.showLoading = false;
        }
      })
    );
  }

  public onClickLogin(): void {
    document.getElementById("close-register-modal").click();
  }
  
  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
    	this.notificationService.notify(notificationType, message);
    } else {
		this.notificationService.notify(notificationType, "An error occured. Please try again.");
    }
  }

  // prevent memory leak 
  ngOnDestroy(): void {
  	this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
