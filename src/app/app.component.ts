import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { User } from './model/user';
import { AuthenticationService } from './service/security/authentication.service';
import { FooterComponent } from './footer/footer.component';
import { MainHeaderComponent } from './main-header/main-header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    RouterOutlet,
    FooterComponent,
    MainHeaderComponent,
  ],
})
export class AppComponent {
  public authenticationService: AuthenticationService = inject(
    AuthenticationService,
  );

  protected user = signal<User | null>(null);
  profileImage = signal<string | null>(null);
}
