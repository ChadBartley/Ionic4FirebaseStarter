import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Observable, from, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { Http, Jsonp } from '@angular/http';

// Types
import {IUser} from '../models/user';

// Firebase Libraries
import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { jsonpFactory } from '@angular/http/src/http_module';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userDoc$: Observable<IUser> = of(null);
  public userDoc: IUser = <IUser>{};

  constructor(public http: Http,
                private platform: Platform,
                private afAuth: AngularFireAuth,
                private db: AngularFirestore,
                private gplus: GooglePlus) {

    // Listen for auth changes
    this.afAuth.authState.subscribe(user => {
      if (user) {
        // User still in session
      } else {
        // User signed out
      }

      const uid: string = user ? user.uid : null;
      this.setUserDoc(uid);
    });

   }

  //#region Google SignIn

  ////////////////////////////////////////////////
  //// Google Region
  googleLogin() {
    if (this.platform.is('cordova')) {
      this.nativeGoogleLogin();
    } else {
      this.webGoogleLogin();
    }

    this.afAuth.user.pipe(
      map( user => {
        if (!user) { return; }
        this.setUserDoc(user.uid);
      })
    );
  }

  async nativeGoogleLogin(): Promise<any> {
    try {

      const gplusUser = await this.gplus.login({
        'webClientId': 'INSERT-YOUR-webClientId',
        'offline': true,
        'scopes': 'profile email'
      });

      return await this.afAuth.auth.signInWithCredential(
        firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken)
      );


    } catch (err) {
      console.log(err);
    }
  }

  async webGoogleLogin(): Promise<void> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const credential = await this.afAuth.auth.signInWithPopup(provider);

    } catch (err) {
      console.log(err);
    }

  }

  //// End Google Region
  ////////////////////////////////////////////////
   //#endregion

  //#region User Doc

  private async saveUserDoc(userDoc: IUser): Promise<any> {
    return await this.db.doc<IUser>(`users/${userDoc.uid}`).update(userDoc);
  }

  public async updateUserDoc(userDoc: IUser): Promise<any> {
    return await this.saveUserDoc(userDoc);
  }

  public setUserDoc(uid: string) {
    // Local userDoc will always be the most up-to-date document from storage.
    //  We can access it without calling db each time we need it this way

    if ( !uid ) {this.userDoc$ = of(null); return; }

    this.userDoc$ = this.db.doc<IUser>(`users/${uid}`).valueChanges();

    this.userDoc$.subscribe(data => {
      this.userDoc = data;
    });

  }

  // public getUserDoc(uid: string): Observable<IUser> {
  //   // return await this.db.doc<IUser>(`users/${uid}`).get()..then((result) => {
  //   //   return result as IUser;
  //   // }).catch((err) => {
  //   //   console.error(err);
  //   // });
  // }

  //#endregion

  ////////////////////////////////////////////////
  //// Sign Out

  signOut() {
    this.afAuth.auth.signOut();
    if (this.platform.is('cordova')) {
      this.gplus.logout();
    }
  }

}
