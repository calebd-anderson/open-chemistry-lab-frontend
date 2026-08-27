import { Injectable, computed } from '@angular/core';
import { Role } from '../../model/enum/role.enum';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  constructor(private authService: AuthenticationService) {}

  public readonly isAdmin = computed(() => {
    const user = this.authService.user();
    return user ? (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) : false;
  });

  public readonly isManager = computed(() => {
    const user = this.authService.user();
    return user ? (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN || user.role === Role.MANAGER) : false;
  });

  public readonly userRole = computed(() => this.authService.user()?.role || '');
}
