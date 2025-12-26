import { Component, computed, inject, Signal } from '@angular/core';
import { itablink } from '../../model/itablink';
import { AuthenticationService } from '../../service/security/authentication.service';
import { AuthorizationService } from '../../service/security/authorization.service';
import { MatTabNavPanel, MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  imports: [MatTabNavPanel, MatTabsModule, RouterModule],
})
export class TabsComponent {
  readonly authenticationService = inject(AuthenticationService);
  readonly authorizationService = inject(AuthorizationService);

  tabLinks: Signal<itablink[]> = computed(() => this.populateTabs());

  private get isAdmin(): boolean {
    if (this.authenticationService.getIsLoggedIn())
      return this.authorizationService.isAdmin;
    else return false;
  }

  private populateTabs(): itablink[] {
    if (!this.authenticationService.getIsLoggedIn()) {
      // not logged in
      let excludeTabs = [
        'globaldiscoveries',
        'discoveries',
        'flashcard',
        'quiz',
      ];
      let tabLinks = this.getTabLinks().filter((tab) => {
        return !excludeTabs.includes(tab.path);
      });
      return tabLinks;
    } else if (!this.isAdmin) {
      // logged in yet not admin
      let excludeTabs = ['globaldiscoveries'];
      return this.getTabLinks().filter((tab) => {
        let stuff = excludeTabs.includes(tab.path);
        return !excludeTabs.includes(tab.path);
      });
    } else {
      // logged in as admin
      return this.getTabLinks();
    }
  }

  private getTabLinks(): Array<itablink> {
    return [
      {
        path: 'lab',
        label: 'Lab',
      },
      {
        path: 'globaldiscoveries',
        label: 'Global Discoveries',
      },
      {
        path: 'discoveries',
        label: 'My Discoveries',
      },
      {
        path: 'flashcard',
        label: 'Flashcards',
      },
      {
        path: 'quiz',
        label: 'Quiz',
      },
      {
        path: 'about',
        label: 'About',
      },
    ];
  }
}
