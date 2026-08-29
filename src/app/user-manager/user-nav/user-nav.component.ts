import { AdminIcon } from '@/app/user-manager/user-nav/admin.component.svg';
import { LogoutIcon } from '@/app/user-manager/user-nav/logout.component.svg';
import { User } from '@/app/model/user';
import { AuthenticationService } from '@/app/service/security/authentication.service';
import { AuthorizationService } from '@/app/service/security/authorization.service';
import { Component, inject, model } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-nav',
  imports: [LogoutIcon, AdminIcon, RouterLink],
  templateUrl: './user-nav.component.html',
  styleUrl: './user-nav.component.scss',
})
export class UserNavComponent {
  private readonly router = inject(Router);

  public authenticationService: AuthenticationService = inject(
    AuthenticationService,
  );
  protected authorizationService: AuthorizationService =
    inject(AuthorizationService);

  user = model<User | null>();
  isMenuOpen = false;

  public onClickProfile(): void {
    this.router.navigate(['/profile']);
    // Don't close the menu when navigating to profile
    // Just let it stay open
  }

  public onClickLogout(): void {
    this.authenticationService.logOut();
    this.user.set(null);
    this.router.navigate(['lab']);
  }
}
