import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';

import { MsalGuard, MsalModule, MsalRedirectComponent } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { HttpClientModule } from '@angular/common/http';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent
    
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    MsalModule.forRoot( new PublicClientApplication({
      // auth: {
      //   clientId: '6fdea934-6fb1-4189-89f1-d5a4c208e769',
      //   authority: 'https://login.microsoftonline.com/efc007d7-20d8-4fee-b63e-752a6459e31c', 
      //   redirectUri: 'http://localhost:4200'
      // },
      // cache: {
      //   cacheLocation: 'localStorage',
      //   storeAuthStateInCookie: isIE, // Set to true for Internet Explorer 11
      // }
      auth: {
        clientId: "d3e93fcd-c7fa-4962-b8e0-c458f5ff70e2", //This is your client ID
        authority: "https://login.microsoftonline.com/common", 
        redirectUri: "http://localhost:4200", 
        navigateToLoginRequestUrl: false,
    },
    cache: {
        cacheLocation: 'localStorage', // Needed to avoid "User login is required" error.
        storeAuthStateInCookie: true  // Recommended to avoid certain IE/Edge issues.
    }
    }), {
      interactionType: InteractionType.Redirect, // MSAL Guard Configuration
      authRequest: {
        scopes: ['user.read'],
        // extraQueryParameters: {"id_token_hint" : idToken}
      }
  }, {
    interactionType: InteractionType.Redirect, // MSAL Interceptor Configuration
    protectedResourceMap: new Map([ 
        ['https://graph.microsoft.com/v1.0/me', ['user.read']]
    ])
  })
  ],
  providers: [MsalGuard],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }