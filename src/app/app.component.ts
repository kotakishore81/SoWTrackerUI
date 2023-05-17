import { Component, Inject } from '@angular/core';
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { CommonService } from './common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'SoWTracker';

  isIframe = false;
  username:any=''
  email:any=''
  private readonly _destroying$ = new Subject<void>();

  constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration
    ,private authService: MsalService, private msalBroadcastService: MsalBroadcastService,private commonService:CommonService) { }

  ngOnInit() {
    this.isIframe = window !== window.parent && !window.opener;
    this.msalBroadcastService.inProgress$
    .pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      takeUntil(this._destroying$)
    )
    .subscribe(() => {
      // this.login();
      this.setLoginDisplay();
    })



    this.msalBroadcastService.msalSubject$
    .pipe(
      filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
    )
    .subscribe((result: EventMessage) => {
    });
  }

  // login() {
  //   this.authService.loginRedirect();
  // }

  // setLoginDisplay() {
  //   this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  // }

  // ngOnDestroy(): void {
  //   this._destroying$.next(undefined);
  //   this._destroying$.complete();
  // }
  // login() {
  //   if (this.msalGuardConfig.authRequest){
  //     this.authService.loginRedirect({...this.msalGuardConfig.authRequest} as RedirectRequest);
  //   } else {
  //     this.authService.loginRedirect();
  //   }
  // }

  setLoginDisplay() {
    if(this.authService.instance.getAllAccounts().length>0){
      this.username=this.authService.instance.getAllAccounts()[0]?.name;
      this.commonService.setUser(this.authService.instance.getAllAccounts()[0])
    }
   
    
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
  // getProfile() {
  //   this.http.get('https://graph.microsoft.com/v1.0/me')
  //     .subscribe(profile => {
  //     console.log(profile,"this is the final ")
  //     });
  // }
}
