import { Component, OnInit } from '@angular/core';

import {AuthService} from '../../services/auth.service';
import { Observable, } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import {IUser} from '../../models/user';

@Component({
  selector: 'app-google-login',
  templateUrl: './google-login.component.html',
  styleUrls: ['./google-login.component.scss']
})
export class GoogleLoginComponent implements OnInit {

  private user: IUser = <IUser>{};

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
  }

  googleLogin() {
    this.authService.googleLogin();
  }

}
