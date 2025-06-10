import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { AuthenticationService } from './service/authentication.service';
import { UserService } from './service/user.service';
import { AuthenticationGuard } from './guard/authentication.guard';
import { NotificationModule } from './notification.module';
import { NotificationService } from './service/notification.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { FormsModule } from '@angular/forms';
import { MatLegacyCardModule as MatCardModule } from "@angular/material/legacy-card";
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
// import { FlexLayoutModule } from "@angular/flex-layout";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PeriodicTableComponent } from './periodic-table/periodic-table.component';
import { QuizComponent } from './quiz/quiz.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ElementService } from './service/element.service';
import { CompoundComponent } from './compound/compound.component';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { TabsComponent } from './tabs/tabs.component';
import { FlashcardComponent } from './flashcard/flashcard.component';
import { ProfileComponent } from './profile/profile.component';
import { ValidationModalComponent } from './compound/validation-modal/validation-modal.component';
import {MatLegacyDialogModule as MatDialogModule, MatLegacyDialogRef as MatDialogRef} from "@angular/material/legacy-dialog";
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PeriodicTableComponent,
    RegisterComponent,
    UserComponent,
    QuizComponent,
    CompoundComponent,
    TabsComponent,
    UserComponent,
    FlashcardComponent,
    ProfileComponent,
    ValidationModalComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NotificationModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatTabsModule,
    MatDialogModule,
    MatToolbarModule,
    MatButtonModule,
    // FlexLayoutModule,
    MatIconModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatProgressSpinnerModule
  ],
  providers: [NotificationService, AuthenticationGuard, AuthenticationService, ElementService, UserService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
