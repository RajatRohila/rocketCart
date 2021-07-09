import {Component, OnInit} from '@angular/core';
import {ApiserviceService} from '../../apiservice.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AppUrls} from '../../common/Api_Url_Seeting';

@Component({
  selector: 'app-serviceable-couriers',
  templateUrl: './serviceable-couriers.component.html',
  styleUrls: ['./serviceable-couriers.component.css']
})
export class ServiceableCouriersComponent implements OnInit {
  title = 'datatables';
  dtOptions: DataTables.Settings = {};

  public posts;
  public getSingleResponse;
  public serviceableCouriersResponse;
  public isDisplay = false;
  public isfound = false;
  public clientList;
  paymentTypeList = ['COD', 'PREPAID'];
  serviceablecourierForm = new FormGroup({
    clientCode: new FormControl('', [Validators.required]),
    paymentType: new FormControl('', [Validators.required]),
    sourcePincode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(6), Validators.maxLength(6)]),
    destinationPincode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(6), Validators.maxLength(6)]),
    length: new FormControl(''),
    breadth: new FormControl(''),
    height: new FormControl(''),
    weight: new FormControl('', [Validators.required]),
    codAmount: new FormControl(''),
  });


  constructor(private apiserviceService: ApiserviceService) {

  }

  ngOnInit(): void {
    this.apiserviceService.urlAuthorization();
    this.getAllClientRecords();
  }

  async onCalculate() {
    this.apiserviceService.SpinnerService.show();
    const body = JSON.stringify(this.serviceablecourierForm.value);
    this.apiserviceService.serviceableCouriers(AppUrls.GET_SEVICEABLE_COURIERS, body).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
        this.serviceableCouriersResponse = this.getSingleResponse.responseBody;
        this.isDisplay = true;
        this.isfound = true;
      } else {
        alert(this.getSingleResponse.message);
        this.isfound = false;
        this.isDisplay = true;
      }
    });
  }

  async getAllClientRecords() {
    this.apiserviceService.SpinnerService.show();
    this.posts = await this.apiserviceService.fetchAllRecords(AppUrls.ALL_CLIENT);
    this.apiserviceService.SpinnerService.hide();
    if (this.posts.status === 'SUCCESS') {
      this.clientList = this.posts.responseBody;
    }
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
