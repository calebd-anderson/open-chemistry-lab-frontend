import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from './security/guard/authentication.guard';
import { PeriodicTableComponent } from './component/chemistry/periodic-table/periodic-table.component';
import { UserComponent } from './user_manager/user/user.component';
import { QuizComponent } from './quiz/quiz.component';
import { FlashcardComponent } from './flashcard/flashcard.component';
import { AuthorizationGuard } from './security/guard/authorization.guard';
import { ProfileComponent } from './user_manager/profile/profile.component';
import { AboutComponent } from './about/about.component';
import { DiscoveriesComponent } from './component/discoveries/discoveries.component';
import { GlobalDiscoveriesComponent } from './global-discoveries/global-discoveries.component';

const routes: Routes = [
  { path: 'about', component: AboutComponent },
  { path: 'sandbox', component: PeriodicTableComponent },
  { path: 'globaldiscoveries', component: GlobalDiscoveriesComponent, canActivate: [AuthenticationGuard, AuthorizationGuard] },
  { path: 'discoveries', component: DiscoveriesComponent, canActivate: [AuthenticationGuard] },
  { path: 'user/management', component: UserComponent, canActivate: [AuthenticationGuard, AuthorizationGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthenticationGuard] },
  { path: 'quiz', component: QuizComponent, canActivate: [AuthenticationGuard] },
  { path: 'flashcard', component: FlashcardComponent, canActivate: [AuthenticationGuard] },
  { path: '', redirectTo: 'sandbox', pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
