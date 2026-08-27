import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../service/security/authentication.service';
import { NotificationService } from '../../service/notification.service';
import { NotificationType } from '../../model/enum/notification-type.enum';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  constructor(
    private router: Router,
    public authenticationService: AuthenticationService,
    private notificationService: NotificationService
  ) {}

  goToLab() {
    this.router.navigate(['/lab']);
  }

  goToDiscoveries() {
    if (this.authenticationService.isLoggedIn()) {
      this.router.navigate(['/discover/discoveries']);
    } else {
      this.notificationService.notify(NotificationType.INFO, 'Please create an account to access your discoveries.');
    }
  }

  goToGlobalDiscoveries() {
    if (this.authenticationService.isLoggedIn()) {
      this.router.navigate(['/discoveries/global']);
    } else {
      this.notificationService.notify(NotificationType.INFO, 'Please create an account to view global discoveries.');
    }
  }

  goToQuiz() {
    if (this.authenticationService.isLoggedIn()) {
      this.router.navigate(['/quiz']);
    } else {
      this.notificationService.notify(NotificationType.INFO, 'Please create an account to take quizzes.');
    }
  }

  goToFlashcard() {
    if (this.authenticationService.isLoggedIn()) {
      this.router.navigate(['/flashcard']);
    } else {
      this.notificationService.notify(NotificationType.INFO, 'Please create an account to use flashcards.');
    }
  }

  goToAbout() {
    this.router.navigate(['/about']);
  }
}
