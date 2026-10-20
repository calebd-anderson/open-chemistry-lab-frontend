import { Component, inject, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { CompoundService } from '@service/compound.service';
import { SubSink } from 'subsink';
import { AuthenticationService } from '@service/security/authentication.service';
import { NotificationService } from '@service/notification.service';
import { NotificationType } from '@model/enum/notification-type.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { UserReaction } from '@model/compound';

@Component({
  selector: 'app-discoveries',
  imports: [],
  templateUrl: './discoveries.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './discoveries.component.scss',
})
export class DiscoveriesComponent implements OnInit, OnDestroy {
  readonly compoundService = inject(CompoundService);
  readonly authenticationService = inject(AuthenticationService);
  readonly _snackBar = inject(NotificationService);

  public loading: boolean = false;

  public userReactions: UserReaction[] = [];

  private subs = new SubSink();

  ngOnInit(): void {
    this.loading = true;
    this.subs.add(
      this.authenticationService.getCurrentUser().subscribe({
        next: (user) => {
          this.subs.add(
            this.compoundService.getUserDiscoveries(user.userId).subscribe({
              next: (response: UserReaction[]) => {
                this.userReactions = response;
                this.loading = false;
              },
              error: (errorResponse: HttpErrorResponse) => {
                this._snackBar.notify(
                  NotificationType.ERROR,
                  'Failed to get user discoveries.',
                );
                this.loading = false;
              },
            }),
          );
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.loading = false;
          this._snackBar.notify(
            NotificationType.WARNING,
            'You must be logged in to see your discoveries.',
          );
        },
      }),
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
