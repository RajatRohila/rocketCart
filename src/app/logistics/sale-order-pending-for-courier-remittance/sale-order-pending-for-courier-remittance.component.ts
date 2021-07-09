import {Component, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {ApiserviceService} from '../../apiservice.service';
import {AppUrls} from '../../common/Api_Url_Seeting';

@Component({
  selector: 'app-sale-order-pending-for-courier-remittance',
  templateUrl: './sale-order-pending-for-courier-remittance.component.html',
  styleUrls: ['./sale-order-pending-for-courier-remittance.component.css']
})
export class SaleOrderPendingForCourierRemittanceComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  orderPendingForCourierRMTSetting: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  title = 'datatables';

  public data;
  public orderPendingForCourierRMT = [];

  constructor(private apiserviceService: ApiserviceService) { }

  async ngOnInit(): Promise<void>  {
    this.apiserviceService.urlAuthorization();
    this.orderPendingForCourierRMTSetting = this.orderPendingForCourierRMTDataTable(AppUrls.GET_PENDING_SALE_ORDER_FOR_COURIER_RMT);
  }
  orderPendingForCourierRMTDataTable(url: string): DataTables.Settings {
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
              this.orderPendingForCourierRMT = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              this.orderPendingForCourierRMT = [];
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
}
