import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AppUrls} from '../../common/Api_Url_Seeting';
import {ApiserviceService} from '../../apiservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    public  responseObj;
    public  userObject;
    loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  constructor(private apiserviceService: ApiserviceService, private router: Router) { }

  ngOnInit(): void {
    this.apiserviceService.removeItemFromLocalStorage();
    localStorage.setItem( 'isLogin', 'false');
  }
  handleKeyUp(e) {
    if ( e.keyCode === 13) {
      this.login();
    }
  }

  async login() {
      this.loginForm.value.username = (<HTMLInputElement>document.getElementById('inputUserId')).value;
      this.loginForm.value.password = (<HTMLInputElement>document.getElementById('inputPassword')).value;
      const url = AppUrls.LOGIN_URL;
      const body = JSON.stringify(this.loginForm.value);
      this.apiserviceService.saveData(AppUrls.LOGIN_URL, body).subscribe(result => {
        this.responseObj = result;
        if (this.responseObj.status === 'SUCCESS') {
          const allowPagesUrlMap = {};
          const allowPagesUrlArray = [];
          const allowModuleMap = {};
          if(this.responseObj.responseBody.user.role != undefined && this.responseObj.responseBody.user.role != null){
            for (const role of this.responseObj.responseBody.user.role) {
                if (role != null && role !== undefined) {
                  for (const page of role.pages) {
                    if (page != null && page !== undefined) {
                      allowPagesUrlMap[page.pageURL] = page.pageURL;
                      allowPagesUrlArray.push(page.pageURL);
                      allowModuleMap[page.module] = page.module;
                      allowModuleMap[page.subModule] = page.subModule;
                    }
                  }
                }
            }
          }

          // sessionStorage.setItem('token', this.responseObj.responseBody.token);
          // sessionStorage.setItem('isAdmin', this.responseObj.responseBody.user.admin);
          // const expireTime = this.apiserviceService.setCookieAge();

          localStorage.setItem( 'token', this.responseObj.responseBody.token);
          localStorage.setItem( 'isAdmin', this.responseObj.responseBody.user.admin);
          let json = JSON.stringify(allowPagesUrlMap);
          localStorage.setItem( 'allowPagesUrlMap', json);

          json = JSON.stringify(allowPagesUrlArray);
          localStorage.setItem( 'allowPagesUrl', json);

          json = JSON.stringify(allowModuleMap);
          localStorage.setItem('allowModuleMap', json);

          const userName = this.responseObj.responseBody.user.fisrtName + ' ' + this.responseObj.responseBody.user.lastName;
          localStorage.setItem( 'userName', userName);
          localStorage.setItem( 'userID', this.responseObj.responseBody.user.loginId);
          this.loginForm.reset();
          // this.router.navigateByUrl('/backend/home');
          this.router.navigate(['/backend/home']);
        } else {
          alert(this.responseObj.message);
        }
      });
    }
}
