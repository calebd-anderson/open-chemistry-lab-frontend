import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { AuthenticationService } from './service/authentication.service';
import { UserService } from './service/user.service';
import { AuthenticationGuard } from './guard/authentication.guard';
import { NotificationService } from './service/notification.service';
import { LoginComponent } from './user_manager/login/login.component';
import { RegisterComponent } from './user_manager/register/register.component';
import { UserComponent } from './user_manager/user/user.component';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PeriodicTableComponent } from './periodic-table/periodic-table.component';
import { QuizComponent } from './quiz/quiz.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ElementService } from './service/element.service';
import { CompoundComponent } from './chemistry/compound/compound.component';
import { TabsComponent } from './tabs/tabs.component';
import { FlashcardComponent } from './flashcard/flashcard.component';
import { ProfileComponent } from './profile/profile.component';
import { ValidationModalComponent } from './chemistry/compound/validation-modal/validation-modal.component';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({ declarations: [
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
        ValidationModalComponent
    ],
    bootstrap: [AppComponent],
    imports: [BrowserModule,
        AppRoutingModule,
        FormsModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatTabsModule,
        MatDialogModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        MatProgressBarModule,
        WelcomeComponent],
        providers: [MatSnackBar, 
            NotificationService,
            AuthenticationGuard,
            AuthenticationService,
            ElementService,
            UserService,
            { provide: HTTP_INTERCEPTORS, 
                useClass: AuthInterceptor,
                multi: true },
            provideHttpClient(withInterceptorsFromDi())
    ]})
export class AppModule { }
