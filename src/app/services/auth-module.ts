import { NgModule } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { HttpModule } from '@angular/http';

@NgModule({
  imports: [
    AngularFireAuthModule,
    AngularFirestoreModule,
    HttpModule
  ],
  providers: [AuthService]
})
export class AuthModule { }
