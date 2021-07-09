import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {ApiserviceService} from '../../apiservice.service';
import {AppUrls} from '../../common/Api_Url_Seeting';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ExternalLibraryService} from './util';
import {RazorpayRequestBean} from './RazorpayRequestBean';
import {PaymentGetWayCredentialBean} from './PaymentGetWayCredentialBean';
import {saveAs} from 'file-saver';

declare var Razorpay: any;

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  tableSetting: DataTables.Settings = {};
  transactionTableSetting: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  title = 'datatables';
  public paymentgetWayLogArray  = [];
  public readyToShipArray  = [];
  public getSingleResponse;

  public data;
  // used for razorpay
  public order_id = null;
  public clientToken = null;
  public clientWalletAmount = '0.0';
  public clientRewardAmount = '0.0';
  public razorPayRequestBean = new RazorpayRequestBean();
  public paymentGetWayCredentialBean = new PaymentGetWayCredentialBean();
  showModal = false;

  checkoutForm = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    amount: new FormControl('', [Validators.required]),
  });



  RAZORPAY_OPTIONS = {
    'key': 'rzp_test_CQGY7s6xBcJFoN',
    'amount': '',
    'name': 'Novopay',
    'order_id': '',
    'description': 'Load Wallet',
    'image': 'https://www.couriercart.in/images/LOGONEW.png',
    'prefill': {
      'name': '',
      'email': 'test@test.com',
      'contact': '',
      'method': ''
    },
    'modal': {},
    'theme': {
      'color': '#0096C5'
    }
  };

  constructor(private apiserviceService: ApiserviceService,
              private razorpayService: ExternalLibraryService,
              private cd:  ChangeDetectorRef) { }

  async ngOnInit(): Promise<void> {
    this.apiserviceService.urlAuthorization();
    this.razorpayService.lazyLoadLibrary('https://checkout.razorpay.com/v1/checkout.js').subscribe();
    this.tableSetting = this.paymentgetWayLogDataTable(AppUrls.GET_ALL_PAYMENT_GET_WAY_LOG);
    this.transactionTableSetting = this.readyToShipDataTable(AppUrls.GET_ALL_SALE_ORDER_TRANSACTION_LOG);
    await this.loadPaymentCredentials();
  }

  public  async proceed() {
    this.order_id = null;
    this.clientToken = null;
    if (this.paymentGetWayCredentialBean == null || this.paymentGetWayCredentialBean === undefined) {
      return false;
    }
    const amount: number = +(<HTMLInputElement>document.getElementById('amount')).value;
    if (amount == null || amount === undefined || amount < 1) {
      alert('Minimum wallet recharge amount should be Rs-1000');
      return false;
    }
    if (this.paymentGetWayCredentialBean.authorizedForRecharge === 'Not') {
          alert(this.paymentGetWayCredentialBean.authorizedMsg);
          return false;
    }

    // Order creation start hear
    const request = {};
    request['amount'] = amount * 100;
    request['currency'] = 'INR';
    this.apiserviceService.SpinnerService.show();
    const body = JSON.stringify(request);
    this.getSingleResponse = await this.apiserviceService.postCall(AppUrls.CREATE_PAYMENT_GET_WAY_ORDER, body);
    this.apiserviceService.SpinnerService.hide();
    if (this.getSingleResponse.status === 'SUCCESS') {
      this.order_id = this.getSingleResponse.responseBody.orderId;
      this.clientToken = this.getSingleResponse.responseBody.clientToken;
    }else{
      alert("Razorpay order id creation fail, Please try again.");
      return false;
    }

    this.razorPayRequestBean.amount = amount * 100;
    this.razorPayRequestBean.key = this.paymentGetWayCredentialBean.apiKey;
    this.razorPayRequestBean.image = this.paymentGetWayCredentialBean.paymentGetWalLogo;
    this.razorPayRequestBean.order_id = this.order_id;
    this.razorPayRequestBean.currency = 'INR';
    this.razorPayRequestBean.prefill.contact = '';
    this.razorPayRequestBean.prefill.email = '';
    // binding this object to both success and dismiss handler
    this.razorPayRequestBean['handler'] = this.razorPaySuccessHandler.bind(this);
    // this.showPopup();
    const razorpay = new Razorpay(this.razorPayRequestBean);
    razorpay.open();
  }
  public async razorPaySuccessHandler(response) {
    // this.showModal = true;
    // this.cd.detectChanges();
    const requestMap = new Map();
    requestMap['razorpay_payment_id'] = response.razorpay_payment_id;
    requestMap['razorpay_order_id'] = response.razorpay_order_id;
    requestMap['razorpay_signature'] = response.razorpay_signature;
    requestMap['clientToken'] = this.clientToken;
    await this.saveGetWayLog(requestMap);
  }
  private async loadPaymentCredentials() {
    this.getSingleResponse = await this.apiserviceService.findById(AppUrls.GET_PAYMENT_GET_WAY_CREDENTIAL);
    if (this.getSingleResponse.status === 'SUCCESS') {
      this.paymentGetWayCredentialBean = this.getSingleResponse.responseBody;
      this.clientWalletAmount = this.paymentGetWayCredentialBean.walletAmount;
      this.clientRewardAmount = this.paymentGetWayCredentialBean.rewardAmount;
    } else {
      this.paymentGetWayCredentialBean = null;
    }
  }

  public async getOrderId() {
    this.order_id = null;
    const amount: number = +(<HTMLInputElement>document.getElementById('amount')).value;
    const request = {};
    request['amount'] = amount * 100;
    request['currency'] = 'INR';
    this.apiserviceService.SpinnerService.show();
    const body = JSON.stringify(request);
    this.getSingleResponse = await this.apiserviceService.postCall(AppUrls.CREATE_PAYMENT_GET_WAY_ORDER, body);
    this.apiserviceService.SpinnerService.hide();
    if (this.getSingleResponse.status === 'SUCCESS') {
      this.order_id = this.getSingleResponse.responseBody;
    }else{
      return false;
    }
    return true;
  }

  private saveGetWayLog(jsonObj) {
    const body = JSON.stringify(jsonObj);
    this.apiserviceService.SpinnerService.show();
    this.apiserviceService.saveData(AppUrls.SAVE_PAYMENT_GET_WAY_LOG, body).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {

        window.location.reload();
        //this.clientWalletAmount = this.getSingleResponse.responseBody.walletAmount;
        //this.clientRewardAmount = this.getSingleResponse.responseBody.rewardAmount;
        //this.rerenderDatatable();
      }
    });
  }

  paymentgetWayLogDataTable(url: string): DataTables.Settings {
    return {
      pagingType: 'full_numbers',
      processing: false,
      serverSide: true,
      pageLength: 10,
      destroy: true,
      searching: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.apiserviceService.SpinnerService.show();
        this.apiserviceService.saveData(url, dataTablesParameters)
          .subscribe
          (resp => {
            this.apiserviceService.SpinnerService.hide();
            if (resp.data.length > 0) {
              this.paymentgetWayLogArray = resp.data;

              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            }
          });
      },
      columns: [
        {data: 'clientCode'},
        {data: 'paymentId'},
        {data: 'amount' , searchable: false, orderable: false},
        {data: 'status',  searchable: false, orderable: false},
        {data: 'method',  searchable: false, orderable: false},
        {data: 'email',  searchable: false, orderable: false},
        {data: 'contact',  searchable: false, orderable: false},
        {data: 'remarks',  searchable: false, orderable: false},
        {data: 'date', searchable: false, orderable: false}
      ],
    };
  }


  readyToShipDataTable(url: string): DataTables.Settings {
    return {
      pagingType: 'full_numbers',
      processing: false,
      serverSide: true,
      pageLength: 10,
      destroy: true,
      searching: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.apiserviceService.SpinnerService.show();
        this.apiserviceService.saveData(url, dataTablesParameters)
          .subscribe
          (resp => {
            this.apiserviceService.SpinnerService.hide();
            if (resp.data.length > 0) {
              this.readyToShipArray = resp.data;

              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            }
          });
      },
      columns: [
        {data: 'clientCode'},
        {data: 'awbNumber'},
        {data: 'amount' , searchable: false, orderable: false},
        {data: 'previousAmount' , searchable: false, orderable: false},
        {data: 'modifiedAmount',  searchable: false, orderable: false},
        {data: 'transactionType',  searchable: false, orderable: false},
        {data: 'date',  searchable: false, orderable: false}
      ],
    };
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  rerenderDatatable(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  async downloadPaymentGetWayLogsReport() {
    const fileName = 'paymentGatewayTransactionLogReport';
    const url = AppUrls.DOWNLOAD_PAYMENT_GET_WAY_LOG_REPORT;
    this.apiserviceService.SpinnerService.show();
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], fileName + '.xlsx', {type: 'application/vnd.ms.excel'});
    saveAs(file);
  }
  async saleOrderTransactionLogReport() {
    const fileName = 'OrderTransactionLogReport';
    const url = AppUrls.DOWNLOAD_SALE_ORDER_TRANSACTION_LOG_REPORT;
    this.apiserviceService.SpinnerService.show();
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], fileName + '.xlsx', {type: 'application/vnd.ms.excel'});
    saveAs(file);
  }

}
