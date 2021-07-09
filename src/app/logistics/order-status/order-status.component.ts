import {Component, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {CheckBoxObj} from '../order-processing/CheckBoxObj';
import {ApiserviceService} from '../../apiservice.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AppUrls} from '../../common/Api_Url_Seeting';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.css']
})
export class OrderStatusComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  inTransitOrderDataTableSetting: DataTables.Settings = {};
  deliverdOrderDataTableSetting: DataTables.Settings = {};
  OFDOrderDataTableSetting: DataTables.Settings = {};
  RTOOrderDataTableSetting: DataTables.Settings = {};
  orderCancelledDataTableSetting: DataTables.Settings = {};
  deliveryAttemptedDataTableSetting: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();
  title = 'datatables';
  public data;
  public inTransitOrderArray  = [];
  public deliverdOrderArray  = [];
  public OFDOrderArray  = [];
  public rtoOrderArray  = [];
  public orderCancelledArray  = [];
  public deliveryAttemptedArray  = [];

  constructor(private apiserviceService: ApiserviceService, private modalService: NgbModal) { }

  async ngOnInit(): Promise<void>  {
    this.apiserviceService.urlAuthorization();
    this.inTransitOrderDataTableSetting = this.inTransitOrderDataTable(AppUrls.GET_ALL_IN_TARNSIT_ORDER);
    this.deliverdOrderDataTableSetting = this.deliverdOrderDataTable(AppUrls.GET_ALL_DELIVERD_ORDER);
    this.OFDOrderDataTableSetting = this.OFDOrderDataTable(AppUrls.GET_ALL_OFD_ORDER);
    this.RTOOrderDataTableSetting = this.rtoOrderDataTable(AppUrls.GET_ALL_RTO_ORDER);
    this.orderCancelledDataTableSetting = this.OrderCanclledDataTable(AppUrls.GET_ALL_CANCELLED_ORDER);
    this.deliveryAttemptedDataTableSetting = this.deliveryAttemptedDataTable(AppUrls.GET_ALL_DELIVERY_ATTEMPTED_ORDER);
  }
  inTransitOrderDataTable(url: string): DataTables.Settings {
    return {
      pagingType: 'full_numbers',
      processing: false,
      destroy: true,
      searching: true,
      serverSide: true,
      pageLength: 10,
      ajax: (dataTablesParameters: any, callback) => {
        this.apiserviceService.SpinnerService.show();
        this.apiserviceService.saveData(url, dataTablesParameters)
          .subscribe
          (resp => {
            this.apiserviceService.SpinnerService.hide();
            if (resp.data.length > 0) {
              this.inTransitOrderArray = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              this.inTransitOrderArray = [];
            }
          });
      },
      columns: [
        {data: 'referanceNo'},
        {data: 'orderDate' , searchable: false, orderable: false},
        {data: 'packetHistory' , searchable: false, orderable: false},
        {data: 'warehouseCode' , searchable: false, orderable: false},
        {data: 'clientCode' , orderable: false},
        {data: 'productName' , searchable: false, orderable: false},
        {data: 'paymentType' , searchable: false, orderable: false},
        {data: 'consigneeName' , searchable: false, orderable: false},
        {data: 'currentStatus' , searchable: false, orderable: false},
        {data: 'orderDate'},
        {data: 'courierCode'},
        {data: 'courierAWBNumber'},
      ],
    };
  }

  deliverdOrderDataTable(url): DataTables.Settings {
    return {
      pagingType: 'full_numbers',
      processing: false,
      destroy: true,
      searching: true,
      serverSide: true,
      pageLength: 10,
      ajax: (dataTablesParameters: any, callback) => {
        this.apiserviceService.SpinnerService.show();
        this.apiserviceService.saveData(url, dataTablesParameters)
          .subscribe
          (resp => {
            this.apiserviceService.SpinnerService.hide();
            if (resp.data.length > 0) {
              this.deliverdOrderArray = resp.data;

              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              this.deliverdOrderArray = [];
            }
          });
      },
      columns: [
        {data: 'referanceNo'},
        {data: 'orderDate' , searchable: false, orderable: false},
        {data: 'packetHistory' , searchable: false, orderable: false},
        {data: 'warehouseCode' , searchable: false, orderable: false},
        {data: 'clientCode' , orderable: false},
        {data: 'productName' , searchable: false, orderable: false},
        {data: 'paymentType' , searchable: false, orderable: false},
        {data: 'consigneeName' , searchable: false, orderable: false},
        {data: 'currentStatus' , searchable: false, orderable: false},
        {data: 'orderDate'},
        {data: 'courierCode'},
        {data: 'courierAWBNumber'},
      ],
    };
  }

  loadOutForDeliveryDataTable() {
  }
  loadDeliverdDataTable() {
  }
  loadRtoDataTable() {
  }
  loadCancelledOrderDataTable() {
  }
  loadDeliveryAttemptedDataTable() {
  }
  OFDOrderDataTable(url): DataTables.Settings {
    return {
      pagingType: 'full_numbers',
      processing: false,
      destroy: true,
      searching: true,
      serverSide: true,
      pageLength: 10,
      ajax: (dataTablesParameters: any, callback) => {
        this.apiserviceService.SpinnerService.show();
        this.apiserviceService.saveData(url, dataTablesParameters)
          .subscribe
          (resp => {
            this.apiserviceService.SpinnerService.hide();
            if (resp.data.length > 0) {
              this.OFDOrderArray = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              this.OFDOrderArray = [];
            }
          });
      },
      columns: [
        {data: 'referanceNo'},
        {data: 'orderDate' , searchable: false, orderable: false},
        {data: 'packetHistory' , searchable: false, orderable: false},
        {data: 'warehouseCode' , searchable: false, orderable: false},
        {data: 'clientCode' , orderable: false},
        {data: 'productName' , searchable: false, orderable: false},
        {data: 'paymentType' , searchable: false, orderable: false},
        {data: 'consigneeName' , searchable: false, orderable: false},
        {data: 'currentStatus' , searchable: false, orderable: false},
        {data: 'orderDate'},
        {data: 'courierCode'},
        {data: 'courierAWBNumber'},
      ],
    };
  }


  rtoOrderDataTable(url): DataTables.Settings {
    return {
      pagingType: 'full_numbers',
      processing: false,
      destroy: true,
      searching: true,
      serverSide: true,
      pageLength: 10,
      ajax: (dataTablesParameters: any, callback) => {
        this.apiserviceService.SpinnerService.show();
        this.apiserviceService.saveData(url, dataTablesParameters)
          .subscribe
          (resp => {
            this.apiserviceService.SpinnerService.hide();
            if (resp.data.length > 0) {
              this.rtoOrderArray = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              this.rtoOrderArray = [];
            }
          });
      },
      columns: [
        {data: 'referanceNo'},
        {data: 'orderDate' , searchable: false, orderable: false},
        {data: 'packetHistory' , searchable: false, orderable: false},
        {data: 'warehouseCode' , searchable: false, orderable: false},
        {data: 'clientCode' , orderable: false},
        {data: 'productName' , searchable: false, orderable: false},
        {data: 'paymentType' , searchable: false, orderable: false},
        {data: 'consigneeName' , searchable: false, orderable: false},
        {data: 'currentStatus' , searchable: false, orderable: false},
        {data: 'orderDate'},
        {data: 'courierCode'},
        {data: 'courierAWBNumber'},
      ],
    };
  }

  OrderCanclledDataTable(url): DataTables.Settings {
    return {
      pagingType: 'full_numbers',
      processing: false,
      destroy: true,
      searching: true,
      serverSide: true,
      pageLength: 10,
      ajax: (dataTablesParameters: any, callback) => {
        this.apiserviceService.SpinnerService.show();
        this.apiserviceService.saveData(url, dataTablesParameters)
          .subscribe
          (resp => {
            this.apiserviceService.SpinnerService.hide();
            if (resp.data.length > 0) {
              this.orderCancelledArray = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              this.orderCancelledArray = [];
            }
          });
      },
      columns: [
        {data: 'referanceNo'},
        {data: 'orderDate' , searchable: false, orderable: false},
        {data: 'packetHistory' , searchable: false, orderable: false},
        {data: 'warehouseCode' , searchable: false, orderable: false},
        {data: 'clientCode' , orderable: false},
        {data: 'productName' , searchable: false, orderable: false},
        {data: 'paymentType' , searchable: false, orderable: false},
        {data: 'consigneeName' , searchable: false, orderable: false},
        {data: 'currentStatus' , searchable: false, orderable: false},
        {data: 'orderDate'},
        {data: 'courierCode'},
        {data: 'courierAWBNumber'},
      ],
    };
  }

  deliveryAttemptedDataTable(url): DataTables.Settings {
    return {
      pagingType: 'full_numbers',
      processing: false,
      destroy: true,
      searching: true,
      serverSide: true,
      pageLength: 10,
      ajax: (dataTablesParameters: any, callback) => {
        this.apiserviceService.SpinnerService.show();
        this.apiserviceService.saveData(url, dataTablesParameters)
          .subscribe
          (resp => {
            this.apiserviceService.SpinnerService.hide();
            if (resp.data.length > 0) {
              this.deliveryAttemptedArray = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              this.deliveryAttemptedArray = [];
            }
          });
      },
      columns: [
        {data: 'referanceNo'},
        {data: 'orderDate' , searchable: false, orderable: false},
        {data: 'packetHistory' , searchable: false, orderable: false},
        {data: 'warehouseCode' , searchable: false, orderable: false},
        {data: 'clientCode' , orderable: false},
        {data: 'productName' , searchable: false, orderable: false},
        {data: 'paymentType' , searchable: false, orderable: false},
        {data: 'consigneeName' , searchable: false, orderable: false},
        {data: 'currentStatus' , searchable: false, orderable: false},
        {data: 'orderDate'},
        {data: 'courierCode'},
        {data: 'courierAWBNumber'},
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

  async onDownloadInTransitOrderReport() {
    const fileName = 'InTransitOrderReport';
    const url = AppUrls.DOWNLOAD_IN_TRANSIT_ORDER_REPORT;
    this.apiserviceService.SpinnerService.show();
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], fileName + '.xlsx', {type: 'application/vnd.ms.excel'});
    saveAs(file);
  }
  async onDownloadDeliveredReport() {
    const fileName = 'DeliveredOrderReport';
    const url = AppUrls.DOWNLOAD_DELIVERD_REPORT;
    this.apiserviceService.SpinnerService.show();
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], fileName + '.xlsx', {type: 'application/vnd.ms.excel'});
    saveAs(file);
  }
  async onDownloadOutForDeliveryReport() {
    const fileName = 'OutForDeliveryReport';
    const url = AppUrls.DOWNLOAD_OUR_FOR_DELIVERY_ORDER_REPORT;
    this.apiserviceService.SpinnerService.show();
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], fileName + '.xlsx', {type: 'application/vnd.ms.excel'});
    saveAs(file);
  }
  async onDownloadRTOReport() {
    const fileName = 'RTOReport';
    const url = AppUrls.DOWNLOAD_RTO_REPORT;
    this.apiserviceService.SpinnerService.show();
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], fileName + '.xlsx', {type: 'application/vnd.ms.excel'});
    saveAs(file);
  }
  async onDownloadCancelledOrderReport() {
    const fileName = 'CancelledOrderReport';
    const url = AppUrls.DOWNLOAD_CANCELLED_ORDER_REPORT;
    this.apiserviceService.SpinnerService.show();
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], fileName + '.xlsx', {type: 'application/vnd.ms.excel'});
    saveAs(file);
  }
  async onDownloadDeliveryAttemptedReport() {
    const fileName = 'DeliveryAttemptedReport';
    const url = AppUrls.DOWNLOAD_DELIVERY_ATTEMPTED_REPORT;
    this.apiserviceService.SpinnerService.show();
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], fileName + '.xlsx', {type: 'application/vnd.ms.excel'});
    saveAs(file);
  }
}
