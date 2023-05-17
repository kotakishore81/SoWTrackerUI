import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { BrowserUtils } from '@azure/msal-browser';
import { ChooseSowComponent } from './choose-sow/choose-sow.component';
import { CreateSOWComponent } from './create-sow/create-sow.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditsowComponent } from './editsow/editsow.component';
import { ReviewSoWComponent } from './review-so-w/review-so-w.component';
import { SowTrackerComponent } from './sow-tracker/sow-tracker.component';

const routes: Routes = [
  { path: '', component: DashboardComponent
  //, canActivate: [MsalGuard]
 },
  { path: 'chooseSOW', component: ChooseSowComponent , canActivate: [MsalGuard]},
  { path: 'createSOW', component: CreateSOWComponent , canActivate: [MsalGuard]},
  { path: 'sowTracker', component: SowTrackerComponent, canActivate: [MsalGuard] },
  { path: 'editSOW', component: EditsowComponent , canActivate: [MsalGuard]},
  { path: 'reviewSOW', component: ReviewSoWComponent, canActivate: [MsalGuard] },
  { path: '**', component: DashboardComponent, canActivate: [MsalGuard] }
];
const isIframe = window !== window.parent && !window.opener;

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      // Don't perform initial navigation in iframes or popups
     initialNavigation: !BrowserUtils.isInIframe() && !BrowserUtils.isInPopup() ? 'enabledNonBlocking' : 'disabled' // Set to enabledBlocking to use Angular Universal
    // initialNavigation: !isIframe ? 'enabled' : 'disabled'  
    // initialNavigation: !isIframe ? 'enabled' : 'disabled' // Don't perform initial navigation in iframes
  
  }
   )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
