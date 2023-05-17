import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateSOWComponent } from './create-sow/create-sow.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { AgGridModule } from 'ag-grid-angular';
import { SowTrackerComponent } from './sow-tracker/sow-tracker.component';
import { EditsowComponent } from './editsow/editsow.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { EditDialogComponent } from './editsow/edit-dialog/edit-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReviewSoWComponent } from './review-so-w/review-so-w.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ReviewDialogComponent } from './review-so-w/review-dialog/review-dialog.component';
import { DashboardService } from './dashboard/dashboard.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSpinnerModule } from "ngx-spinner";
import { ChooseSowComponent } from './choose-sow/choose-sow.component';
import { StoreModule } from '@ngrx/store';
import { sowReducer } from './Sow-store/reducers/sow-reducer';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { MsalGuard, MsalInterceptor, MsalModule, MsalRedirectComponent } from '@azure/msal-angular';
import { SpinnerComponent } from './spinner/spinner.component';
import { CommonService } from './common.service';
const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CreateSOWComponent,
    SowTrackerComponent,
    EditsowComponent,
    EditDialogComponent,
    ReviewSoWComponent,
    ReviewDialogComponent,
    ChooseSowComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSelectModule,
    FormsModule, MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
    AgGridModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatExpansionModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
    StoreModule.forRoot({ choosenSow: sowReducer }),
    MsalModule.forRoot(new PublicClientApplication({
      auth: {
        clientId: '7a7a5a7e-9063-48c0-a54f-1d5514a807d8',
        authority: 'https://login.microsoftonline.com/c8b73668-844c-4d10-8763-6bdaacb121cd',
        redirectUri: 'https://sow-tracker.azurewebsites.net/'

      },
      cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: isIE, 
      }
    }
    ), {
      interactionType: InteractionType.Redirect,
      authRequest: {
        scopes: ['user.read']
      }
    },
      {
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map(
          [
            ['https://graph.microsoft.com/v1.0/me', ['user.read']]
          ]
        )
      }),
  ],
  exports: [
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [MatDatepickerModule, DashboardService,MsalGuard,CommonService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },],
  bootstrap: [AppComponent,MsalRedirectComponent]
})
export class AppModule { }
