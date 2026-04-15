import { Routes } from '@angular/router';
import { AuthenticationGuard } from './service/security/guard/authentication.guard';
import { QuizComponent } from './component/game/quiz/quiz.component';
import { FlashcardComponent } from './component/game/flashcard/flashcard.component';
import { AuthorizationGuard } from './service/security/guard/authorization.guard';
import { ProfileComponent } from './component/user_manager/profile/profile.component';
import { AboutComponent } from './component/about/about.component';
import { DiscoveriesComponent } from './component/discoveries/discoveries.component';
import { GlobalDiscoveriesComponent } from './component/global-discoveries/global-discoveries.component';
import { LabComponent } from './component/chemistry/lab/lab.component';
import { UsersComponent } from './component/user_manager/users/users.component';

export const routes: Routes = [
  { path: 'about', component: AboutComponent },
  { path: 'lab', component: LabComponent },
  { path: 'globaldiscoveries', component: GlobalDiscoveriesComponent, canActivate: [AuthenticationGuard, AuthorizationGuard] },
  { path: 'discoveries', component: DiscoveriesComponent, canActivate: [AuthenticationGuard] },
  { path: 'user/management', component: UsersComponent, canActivate: [AuthenticationGuard, AuthorizationGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthenticationGuard] },
  { path: 'quiz', component: QuizComponent, canActivate: [AuthenticationGuard] },
  { path: 'flashcard', component: FlashcardComponent, canActivate: [AuthenticationGuard] },
  { path: '', redirectTo: 'about', pathMatch: 'full' }
]
