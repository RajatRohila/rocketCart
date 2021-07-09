import {Component, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiserviceService} from '../../apiservice.service';
import {AppUrls} from '../../common/Api_Url_Seeting';
import {SaleOrderTransactionLog} from './clientWallet.model';

@Component({
  selector: 'app-client-wallet',
  templateUrl: './client-wallet.component.html',
  styleUrls: ['./client-wallet.component.css']
})
export class ClientWalletComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  title = 'datatables';

  public posts;
  public allRecords;
  public singleRecord = new SaleOrderTransactionLog();
  public getSingleResponse;
  public clientList;
  public paymentgetWayLogArray  = [];

  clientWalletForm = new FormGroup({
    clientCode: new FormControl('', [Validators.required]),
    amount: new FormControl('', [Validators.required]),
    remarks: new FormControl('')
  });
  constructor(private apiserviceService: ApiserviceService) {
  }

  ngOnInit(): void {
    this.apiserviceService.urlAuthorization();
    this.dtOptions = this.paymentgetWayLogDataTable(AppUrls.GET_ALL_CLIENT_WALLET);
    this.getclientRecords();
  }

  paymentgetWayLogDataTable(url: string): DataTables.Settings {
    return {
      pagingType: 'full_numbers',
      processing: false,
      serverSide: true,
      pageLength: 10,
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
        {data: 'walletAmount' , searchable: false, orderable: false},
        {data: 'rewardAmount' , searchable: false, orderable: false},
        {data: 'lastWalletRechargeDate', searchable: false, orderable: false}
      ],
    };
  }



  async getclientRecords() {
    this.posts = await this.apiserviceService.fetchAllRecords('/api/getActiveWalletClient');
    if (this.posts.status === 'SUCCESS') {
      this.clientList = this.posts.responseBody;
    }
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy(): void {
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

  onAdd() {
    const body = JSON.stringify(this.clientWalletForm.value);
    this.apiserviceService.SpinnerService.show();
    this.apiserviceService.saveData(AppUrls.ADD_PAYMENT, body).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
        alert('save successfully');
        this.clientWalletForm.reset();
        //this.dtOptions = this.paymentgetWayLogDataTable(AppUrls.GET_ALL_CLIENT_WALLET);
        this.rerenderDatatable();
      } else {
        alert(this.getSingleResponse.message);
      }
    });

  }

}
