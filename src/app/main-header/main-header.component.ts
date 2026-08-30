import { Component, inject, model } from '@angular/core';
import { ChemLogo } from '@app/assets/logo.component';
import { User } from '@model/user';
import { AuthenticationService } from '@service/security/authentication.service';
import { LoginComponent } from '../user-manager/account-form/login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from '../user-manager/account-form/register/register.component';
import { ButtonComponent } from '../component/button/button.component';

@Component({
  selector: 'app-main-header',
  imports: [ChemLogo, ButtonComponent],
  templateUrl: './main-header.component.html',
  styleUrl: './main-header.component.scss',
})
export class MainHeaderComponent {
  user = model<User | null>();
  readonly dialog = inject(MatDialog);
  public isMenuOpen: boolean = false;

  public authenticationService: AuthenticationService = inject(
    AuthenticationService,
  );

  openLogin() {
    const dialogRef = this.dialog.open(LoginComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (typeof result == 'object') {
        this.user.set(result);
      } else if (result === 'register') {
        this.openRegister();
      }
    });
  }

  openRegister() {
    const dialogRef = this.dialog.open(RegisterComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.openLogin();
      }
    });
  }

  public openMenu() {
    if (!this.authenticationService.isLoggedIn()) {
      return;
    }

    const menu = document.getElementById('user-nav-menu');
    if (!menu) {
      return;
    }

    const shouldOpen = !menu.classList.contains('active');
    menu.classList.toggle('active', shouldOpen);
    this.isMenuOpen = shouldOpen;

    if (!shouldOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const isClickInsideMenu = menu.contains(event.target as Node);
      const isClickOnProfileImage = (event.target as Element).closest(
        '.profile-icon',
      );

      if (!isClickInsideMenu && !isClickOnProfileImage) {
        menu.classList.remove('active');
        this.isMenuOpen = false;
        document.removeEventListener('click', handleClickOutside);
      }
    };

    document.addEventListener('click', handleClickOutside);
  }
}
