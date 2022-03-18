import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { filter, Subject, takeUntil } from 'rxjs';
import { InteractionStatus } from '@azure/msal-browser';

const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';

type ProfileType = {
  givenName?: string,
  surname?: string,
  userPrincipalName?: string,
  id?: string
};

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profile!: ProfileType;

  displayedColumns: string[] = ['claim', 'value'];
  dataSource: Claim[] = [];
  private readonly _destroying$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private authService: MsalService, private msalBroadcastService: MsalBroadcastService
  ) { }

  ngOnInit() {
    // this.msalBroadcastService.inProgress$
    //   .pipe(
    //     filter((status: InteractionStatus) =>  status === InteractionStatus.None || status === InteractionStatus.HandleRedirect),
    //     takeUntil(this._destroying$)
    //   )
    //   .subscribe(() => {
    //     this.checkAndSetActiveAccount();
    //     this.getClaims(this.authService.instance.getActiveAccount()?.idTokenClaims)
    //     this.getProfile();
    //   })

    this.getProfile();
    
  }

  checkAndSetActiveAccount() {

    let activeAccount = this.authService.instance.getActiveAccount();

    if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
      let accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
    }
  }

  getClaims(claims: any) {

    let list: Claim[]  =  new Array<Claim>();

    Object.keys(claims).forEach(function(k, v){
      
      let c = new Claim()
      c.id = v;
      c.claim = k;
      c.value =  claims ? claims[k]: null;
      list.push(c);
    });
    this.dataSource = list;
  }

  getProfile() {
    let access_token = localStorage.getItem('accessToken')
    this.http.get(GRAPH_ENDPOINT, {headers: new HttpHeaders().set('Authorization', `Bearer ${access_token}`)})
      .subscribe(profile => {
        this.profile = profile;
      });
    
    // this.http.get(GRAPH_ENDPOINT)
    // .subscribe(profile => {
    //   this.profile = profile;
    // });
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  
}

export class Claim {
  id?: number;
  claim?: string;
  value?: string;
}