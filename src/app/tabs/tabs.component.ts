import { Component, inject, OnInit } from '@angular/core';
import { itablink } from '../model/itablink';
import { AuthenticationService } from '../service/security/authentication.service';
import { AuthorizationService } from '../service/security/authorization.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  standalone: false,
})
export class TabsComponent implements OnInit {
  private isLoggedIn: boolean;
  private authSubscription!: Subscription;

  readonly authenticationService = inject(AuthenticationService)
  readonly authorizationService = inject(AuthorizationService)

  public get isAdmin(): boolean {
    if(this.isLoggedIn)
      return this.authorizationService.isAdmin;
    else return false;
  }

  public tabLinks: Array<itablink>;

  constructor() {}

  ngOnInit(): void {

    this.authSubscription = this.authenticationService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      if(!this.isLoggedIn) {
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
    });

  }

  public getTabLinks(): Array<itablink> {
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

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe(); // Prevent memory leaks
    }
  }
}
