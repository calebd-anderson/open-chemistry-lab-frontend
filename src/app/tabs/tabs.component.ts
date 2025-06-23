import { Component, Input, OnInit } from '@angular/core';
import { itablink } from '../model/itablink';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  standalone: false,
})
export class TabsComponent implements OnInit {
  @Input() isLoggedIn: boolean;

  public tabLinks: Array<itablink>;

  constructor() {}

  ngOnInit(): void {
    this.tabLinks = this.getTabLinks();
  }

  public getTabLinks(): Array<itablink> {
    return [
      {
        path: 'sandbox',
        label: 'Sandbox',
      },
      {
        path: 'discoveries',
        label: 'Discoveries',
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
