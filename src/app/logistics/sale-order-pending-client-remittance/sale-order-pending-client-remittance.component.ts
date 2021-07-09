import {Component, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {ApiserviceService} from '../../apiservice.service';
import {AppUrls} from '../../common/Api_Url_Seeting';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-sale-order-pending-client-remittance',
  templateUrl: './sale-order-pending-client-remittance.component.html',
  styleUrls: ['./sale-order-pending-client-remittance.component.css']
})
export class SaleOrderPendingClientRemittanceComponent implements OnInit {


  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  orderPendingForClientRMTSetting: DataTables.Settings = {};
  closedClientRemittanceDb: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  title = 'datatables';

  public data;
  public orderPendingForClientRMT = [];
  public closedClientRemittanceList: [];

  constructor(private apiserviceService: ApiserviceService) { }

  async ngOnInit(): Promise<void>  {
    this.apiserviceService.urlAuthorization();
    this.orderPendingForClientRMTSetting = this.orderPendingForClientRMTDataTable(AppUrls.GET_PENDING_SALE_ORDER_FOR_CLIENT_RMT);
    this.closedClientRemittanceDb = this.buildClosedClientRemittance(AppUrls.CLIENT_REMITTANCE_CLOSED_RECODS);
  }
  orderPendingForClientRMTDataTable(url: string): DataTables.Settings {
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
              this.orderPendingForClientRMT = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              this.orderPendingForClientRMT = [];
            }

          });
      },
      columns: [
        {data: 'referanceNo'},
        {data: 'clientOrderId'},
        {data: 'orderDate' , searchable: false, orderable: false},
        {data: 'clientCode' , orderable: false},
        {data: 'productName' , searchable: false, orderable: false},
        {data: 'paymentType' , searchable: false, orderable: false},
        {data: 'weight' , searchable: false, orderable: false},
        {data: 'senderName' , searchable: false, orderable: false},
        {data: 'currentStatus' , searchable: false, orderable: false},
        {data: 'courierCode' , searchable: false, orderable: false},
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
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  async downloadDepositeSlip(depositSlip) {
    this.apiserviceService.SpinnerService.show();
    const fileName = depositSlip;
    const url = AppUrls.DOWNLOAD_DELOSIT_SLIP + '?depositSlip=' + depositSlip;
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], fileName);
    saveAs(file);

  }
  async downloadClientRemittanceReport(remittanceNo) {
    const fileName = 'clientRemittanceReport';
    const url = AppUrls.CLIENT_REMITTANCE_REPORT + '?remittanceNo=' + remittanceNo;
    this.apiserviceService.SpinnerService.show();
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], fileName + '.xlsx', {type: 'application/vnd.ms.excel'});
    saveAs(file);
  }
  buildClosedClientRemittance(url: string): DataTables.Settings {
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
              this.closedClientRemittanceList = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              this.closedClientRemittanceList = [];
            }

          });
      },
      columns: [
        {data: 'remittanceNo'},
        {data: 'depositeDate', searchable: false, orderable: false},
        {data: 'clientCode'},
        {data: 'bankName', searchable: false, orderable: false},
        {data: 'accountNo', searchable: false, orderable: false},
        {data: 'transactionNo', searchable: false, orderable: false},
        {data: 'depositedAmt', searchable: false, orderable: false},
        {data: 'status', searchable: false, orderable: false},
      ],
    };
  }
}
