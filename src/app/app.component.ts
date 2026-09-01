import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { User } from './model/user';
import { AuthenticationService } from './service/security/authentication.service';
import { TabsComponent } from './component/tabs/tabs.component';
import { FooterComponent } from './footer/footer.component';
import { UserNavComponent } from './user-manager/user-nav/user-nav.component';
import { MainHeaderComponent } from './main-header/main-header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    TabsComponent,
    RouterOutlet,
    FooterComponent,
    UserNavComponent,
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
