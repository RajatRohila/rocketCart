import {Component, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {SaleOrderTransactionLog} from '../client-wallet/clientWallet.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiserviceService} from '../../apiservice.service';
import {AppUrls} from '../../common/Api_Url_Seeting';

@Component({
  selector: 'app-view-client-wallet',
  templateUrl: './view-client-wallet.component.html',
  styleUrls: ['./view-client-wallet.component.css']
})
export class ViewClientWalletComponent implements OnInit {


  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  title = 'datatables';
  public paymentgetWayLogArray  = [];
  constructor(private apiserviceService: ApiserviceService) {
  }

  ngOnInit(): void {
    this.apiserviceService.urlAuthorization();
    this.dtOptions = this.paymentgetWayLogDataTable(AppUrls.GET_ALL_CLIENT_WALLET);
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
      ],
    };
  }
  // tslint:disable-next-line:use-life-cycle-interface
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


}
