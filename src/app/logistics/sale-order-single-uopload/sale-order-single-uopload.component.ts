import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiserviceService} from 'src/app/apiservice.service';
import {AppUrls} from '../../common/Api_Url_Seeting';

@Component({
  selector: 'app-sale-order-single-uopload',
  templateUrl: './sale-order-single-uopload.component.html',
  styleUrls: ['./sale-order-single-uopload.component.css']
})
export class SaleOrderSingleUoploadComponent implements OnInit {
  title = 'datatables';
  dtOptions: DataTables.Settings = {};
  public posts;
  public getSingleResponse;
 /* public isCodAmountActive = false;
  public paymentTypeValue;*/
  public clientList;
  paymentTypeList = ['COD', 'PREPAID'];
  saleOrderForm = new FormGroup({
    referanceNo: new FormControl(''),
    senderName: new FormControl('', [Validators.required]),
    senderMobileNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]),
    senderAltNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]),
    senderEmail: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    senderPinCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(6), Validators.maxLength(6)]),
    senderAddress: new FormControl('', [Validators.required]),
    consigneeName: new FormControl('', [Validators.required]),
    consigneeMobileNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]),
    consigneeAlternateNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]),
    consigneeEmailId: new FormControl('', [ Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    consigneePinCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(6), Validators.maxLength(6)]),
    consigneeAddress: new FormControl('', [Validators.required]),
    productSKU: new FormControl('', [Validators.required]),
    productName: new FormControl('', [Validators.required]),
    productQuantity: new FormControl('', [Validators.required]),
    productPrice: new FormControl('', [Validators.required]),
    length: new FormControl('', [Validators.required]),
    breadth: new FormControl('', [Validators.required]),
    hight: new FormControl('', [Validators.required]),
    weight: new FormControl('', [Validators.required]),
    paymentType: new FormControl('', [Validators.required]),
    codAmount: new FormControl(null),
    clientCode: new FormControl(''),
    clientOrderId: new FormControl(''),
    orderType: new FormControl(''),
    pickupLocationId: new FormControl(''),
    ewaybill: new FormControl(''),
    latitude: new FormControl(''),
    longitude: new FormControl(''),
    productImageUrl: new FormControl('')
  });

  constructor(private apiserviceService: ApiserviceService) {

  }

  async ngOnInit(): Promise<void> {
    this.apiserviceService.urlAuthorization();

    this.getClientRecords();
    console.log(this.posts);
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      processing: true,
      scrollY : '100%'
    };
  }
  /*onChangePaymentType() {
    if (this.paymentTypeValue === 'COD') {
      this.isCodAmountActive = false;
    } else {
      this.isCodAmountActive = true;
    }
  }*/

  onSubmit() {
    this.apiserviceService.SpinnerService.show();
    const body = JSON.stringify(this.saleOrderForm.value);
    this.apiserviceService.saveData(AppUrls.SALE_ORDER_SINGLE_UPLOAD_SAVE_RECORD, body).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
        this.saleOrderForm.reset();
        alert(this.getSingleResponse.message);
      } else {
        alert(this.getSingleResponse.message);
      }
    });
  }

  async getClientRecords() {
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
