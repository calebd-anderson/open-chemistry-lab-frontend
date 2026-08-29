import { Routes } from '@angular/router';
import { AuthenticationGuard } from './service/security/guard/authentication.guard';
import { QuizComponent } from './game/quiz/quiz.component';
import { FlashcardComponent } from './game/flashcard/flashcard.component';
import { AuthorizationGuard } from '@service/security/guard/authorization.guard';
import { ProfileComponent } from '@/app/user-manager/account-form/profile/profile.component';
import { AboutComponent } from '@/app/about/about.component';
import { DiscoveriesComponent } from './discoveries/user-discoveries/discoveries.component';
import { GlobalDiscoveriesComponent } from './discoveries/global-discoveries/global-discoveries.component';
import { LabComponent } from './chemistry/lab/lab.component';
import { UsersComponent } from '@/app/user-manager/users/users.component';

export const routes: Routes = [
  { path: 'lab', component: LabComponent },
  { path: 'about', component: AboutComponent },
  {
    path: 'globaldiscoveries',
    component: GlobalDiscoveriesComponent,
    canActivate: [AuthenticationGuard, AuthorizationGuard],
  },
  {
    path: 'discoveries',
    component: DiscoveriesComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'user/management',
    component: UsersComponent,
    canActivate: [AuthenticationGuard, AuthorizationGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'quiz',
    component: QuizComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'flashcard',
    component: FlashcardComponent,
    canActivate: [AuthenticationGuard],
  },
  { path: '', redirectTo: 'about', pathMatch: 'full' },
];
