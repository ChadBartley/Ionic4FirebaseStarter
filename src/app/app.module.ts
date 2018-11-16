import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import {CommonModule} from '@angular/common';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import {AngularFireModule} from 'angularfire2';
import {AngularFirestoreModule} from 'angularfire2/firestore';

import {environmentDev} from '../environments/environment';
import {environmentProd} from '../environments/environment.prod';

import { GooglePlus } from '@ionic-native/google-plus/ngx';

// Services
import {AuthModule} from './services/auth-module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(),
              AppRoutingModule,
              AngularFirestoreModule,
              AuthModule,
              environmentProd.production ? AngularFireModule.initializeApp(environmentProd.firebase) : [],
              environmentDev.production ? AngularFireModule.initializeApp(environmentDev.firebase) : []
            ],
  providers: [
    GooglePlus,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
