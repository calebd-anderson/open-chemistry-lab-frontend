import { Component, inject, model } from '@angular/core';
import { ChemLogo } from '@app/assets/logo.component';
import { User } from '../../model/user';
import { AuthenticationService } from '../../service/security/authentication.service';
import { LoginComponent } from '../user_manager/login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from '../user_manager/register/register.component';

@Component({
  selector: 'app-main-header',
  imports: [ChemLogo],
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
    const menu = document.getElementById('user-nav-menu');
    if (menu) {
      // Close the menu when clicking outside of it
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

      // Toggle the menu
      menu.classList.toggle('active');
    }
  }
}
