import { Component, inject, OnInit } from '@angular/core';
import { CompoundService } from '../../service/compound.service';
import { SubSink } from 'subsink';
import { AuthenticationService } from '../../service/authentication.service';
import { NotificationService } from '../../service/notification.service';
import { NotificationType } from '../../model/enum/notification-type.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { UserReaction } from '../../model/compound';

@Component({
  selector: 'app-discoveries',
  imports: [],
  templateUrl: './discoveries.component.html',
  styleUrl: './discoveries.component.scss'
})
export class DiscoveriesComponent implements OnInit {

  readonly compoundService = inject(CompoundService)
  readonly authenticationService = inject(AuthenticationService)
  readonly _snackBar = inject(NotificationService)

  public userReactions: UserReaction[] = []

  private subs = new SubSink();

  ngOnInit(): void {
    let userId: string = this.authenticationService.getUserFromLocalCache().userId
    this.subs.add(
      this.compoundService.getUserDiscoveries(userId).subscribe({
        next: (response: UserReaction[]) => {
          this.userReactions = response
        },
        error: (errorResponse: HttpErrorResponse) => {
          this._snackBar.notify(NotificationType.ERROR, "Failed to get user discoveries.");
        }
      })
    );
  }
}
