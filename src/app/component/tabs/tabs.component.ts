import { Component, effect, inject, OnInit } from '@angular/core';
import { itablink } from '../../model/itablink';
import { AuthenticationService } from '../../service/security/authentication.service';
import { AuthorizationService } from '../../service/security/authorization.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  standalone: false,
})
export class TabsComponent implements OnInit {

  readonly authenticationService = inject(AuthenticationService)
  readonly authorizationService = inject(AuthorizationService)

  public get isAdmin(): boolean {
    if(this.authenticationService.getIsLoggedIn())
      return this.authorizationService.isAdmin;
    else return false;
  }

  public tabLinks: Array<itablink>;

  constructor() {
    effect(() => {
      this.populateTabs()
    });
  }

  ngOnInit(): void {
    this.populateTabs()
  }

  private populateTabs(): void {
    if(!this.authenticationService.getIsLoggedIn()) {
      // not logged in
      let excludeTabs = ["globaldiscoveries", "discoveries", "flashcard", "quiz"]
      let tabLinks = this.getTabLinks().filter((tab) => {
        return !excludeTabs.includes(tab.path);
      });
      this.tabLinks = tabLinks;
    } else if(!this.isAdmin) {
      // logged in yet not admin
      let excludeTabs = ["globaldiscoveries"]
      this.tabLinks = this.getTabLinks().filter((tab) => {
        let stuff = excludeTabs.includes(tab.path);
        return !excludeTabs.includes(tab.path);
      });
    } else {
      // logged in as admin
      this.tabLinks = this.getTabLinks();
    }
  }

  private getTabLinks(): Array<itablink> {
    return [
      {
        path: 'sandbox',
        label: 'Sandbox',
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
      }
    ];
  }
}
