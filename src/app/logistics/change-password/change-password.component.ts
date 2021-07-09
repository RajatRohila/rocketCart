import { Component, OnInit } from '@angular/core';
import {AppUrls} from '../../common/Api_Url_Seeting';
import {ApiserviceService} from '../../apiservice.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  public getSingleResponse;
  constructor(private apiserviceService: ApiserviceService) { }

  ngOnInit(): void {
    this.apiserviceService.urlAuthorization();
  }

  async changePassword() {
    this.apiserviceService.SpinnerService.show();
    const oldPassword = (<HTMLInputElement>document.getElementById('oldPassword')).value;
    const newPassword = (<HTMLInputElement>document.getElementById('newPassword')).value;
    const url = AppUrls.CHANGE_USER_PASSWORD + '?oldPassword=' + oldPassword + '&newPassword=' + newPassword;
    this.getSingleResponse = await this.apiserviceService.findById (url);
    this.apiserviceService.SpinnerService.hide();
    if (this.getSingleResponse.status === 'SUCCESS') {
      alert(this.getSingleResponse.message);
      this.logout();
    } else {
      alert(this.getSingleResponse.message);
    }
  }
  logout() {
    this.apiserviceService.removeItemFromLocalStorage();
    this.apiserviceService.router.navigateByUrl('/main');
  }

}
