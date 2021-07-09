import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {ApiserviceService} from '../../apiservice.service';
import {AppUrls} from '../../common/Api_Url_Seeting';
import {CheckBoxObj} from './CheckBoxObj';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {saveAs} from 'file-saver';
import * as XLSX from 'xlsx';
declare var $: any;

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-order-processing',
  templateUrl: './order-processing.component.html',
  styleUrls: ['./order-processing.component.css']
})
export class OrderProcessingComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  orderReceivedDataTableSetting: DataTables.Settings = {};
  orderProcessDataTableSetting: DataTables.Settings = {};
  orderAssignedDataTableSetting: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  title = 'datatables';
  public data;
  public orderReceivedArray  = [];
  public orderProcessArray  = [];
  public orderAssignedArray  = [];
  checkBoxObjArray: CheckBoxObj[] = [];
  orderAssignedCheckBoxObjArray: CheckBoxObj[] = [];
  public clientServiceTypeList = [];
  public clientCourierList = [];
  public serviceCourierMap = {};
  public singleResponse;
  public serviceTypes = [];
  public currentAwb;
  public singleAssignedCourierCode = null;
  public singleAssignedAwb = null;
  public warehouseList = [];
  public loaderVisible = true;

  public getResponse;
  private router: any;

  constructor(private apiserviceService: ApiserviceService, private modalService: NgbModal) { }

  async ngOnInit(): Promise<void>  {
    this.apiserviceService.urlAuthorization();
    this.orderReceivedDataTableSetting = this.orderReceivedDataTable(AppUrls.GET_ALL_ORDER_RECEIVED);
    this.orderProcessDataTableSetting = this.orderProcessDataTable(AppUrls.GET_ALL_ORDER_PROCESS);
    this.orderAssignedDataTableSetting = this.orderAssignedDataTable(AppUrls.GET_ALL_ORDER_ASSIGNED);
    this.getServiceCourier();
    this.getCurrentUserWarehouses();
  }

  checkAllCheckBox(ev) {
    this.checkBoxObjArray.forEach(x => x.checked = ev.target.checked);
  }
  isAllCheckBoxChecked() {
    return this.checkBoxObjArray.every(p => p.checked);
  }
  /*@HostListener('click') modalOpen() {
    document.getElementById('myModal').classList.toggle('d-block');
  }*/
  orderReceivedDataTable(url: string): DataTables.Settings {
    this.checkBoxObjArray = [];
    return {
      pagingType: 'full_numbers',
      processing: false,
      destroy: true,
      searching: true,

      serverSide: true,
      pageLength: 10,
      order: [[0, "desc" ]],
      ajax: (dataTablesParameters: any, callback) => {
        this.apiserviceService.SpinnerService.show();
        this.apiserviceService.saveData(url, dataTablesParameters)
          .subscribe
          (resp => {
            this.apiserviceService.SpinnerService.hide();
            this.checkBoxObjArray = [];
            if (resp.data.length > 0) {
              this.orderReceivedArray = resp.data;

              this.orderReceivedArray.forEach(x => {
                const checkBoxObj = new CheckBoxObj();
                checkBoxObj.value = x.referanceNo;
                checkBoxObj.checked = false;
                this.checkBoxObjArray.push(checkBoxObj);
              });
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              this.orderReceivedArray = [];
            }
          });
      },
      columns: [
       /* {data: 'id'},*/
        {data: '', searchable: false, orderable: false},
        {data: 'referanceNo'},
        {data: 'clientOrderId'},
        {data: 'orderDate' , searchable: false, orderable: false},
        {data: 'packetHistory' , searchable: false, orderable: false},
        {data: 'warehouseCode' , searchable: false, orderable: false},
        {data: 'clientCode' , orderable: false},
        {data: 'productName' , searchable: false, orderable: false},
        {data: 'paymentType' , searchable: false, orderable: false},
        {data: 'weight' , searchable: false, orderable: false},
        {data: 'senderName' , searchable: false, orderable: false},
        {data: 'consigneeName' , searchable: false, orderable: false},
        {data: 'currentStatus' , searchable: false, orderable: false},
        {data: '' , searchable: false, orderable: false},
        {data: '', searchable: false, orderable: false}
      ],
    };
  }

  loadOrderProcessDataTable() {
  }
  orderProcessDataTable(url): DataTables.Settings {
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
              this.orderProcessArray = resp.data;

              /*this.checkBoxObjArray = [];
              this.orderProcessArray.forEach(x => {
                const checkBoxObj = new CheckBoxObj();
                checkBoxObj.value = x.referanceNo;
                checkBoxObj.checked = false;
                this.checkBoxObjArray.push(checkBoxObj);
              });*/
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              this.orderProcessArray = [];
            }
          });
      },
      columns: [
        {data: 'referanceNo'},
        {data: 'clientOrderId'},
        {data: 'orderDate' , searchable: false, orderable: false},
        {data: 'packetHistory' , searchable: false, orderable: false},
        {data: 'warehouseCode' , searchable: false, orderable: false},
        {data: 'clientCode' , orderable: false},
        {data: 'productName' , searchable: false, orderable: false},
        {data: 'paymentType' , searchable: false, orderable: false},
        {data: 'weight' , searchable: false, orderable: false},
        {data: 'senderName' , searchable: false, orderable: false},
        {data: 'consigneeName' , searchable: false, orderable: false},
        {data: 'currentStatus' , searchable: false, orderable: false},
        {data: 'courierCode'},
        {data: '' , searchable: false, orderable: false}
      ],
    };
  }

  loadOrderAssignedDataTable() {

  }

  orderAssignedDataTable(url): DataTables.Settings {
    this.orderAssignedCheckBoxObjArray = [];
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
            this.orderAssignedCheckBoxObjArray = [];
            if (resp.data.length > 0) {
              this.orderAssignedArray = resp.data;
           /*   this.orderReceivedArray.forEach(x => {
                const checkBoxObj = new CheckBoxObj();
                checkBoxObj.value = x.referanceNo;
                checkBoxObj.checked = false;
                this.checkBoxObjArray.push(checkBoxObj);
              });*/
              this.orderAssignedArray.forEach(x => {
                const checkBoxObj = new CheckBoxObj();
                checkBoxObj.value = x.referanceNo;
                checkBoxObj.checked = false;
                this.orderAssignedCheckBoxObjArray.push(checkBoxObj);
              });
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              this.orderAssignedArray = [];
            }
          });
      },
      columns: [
        {data: '', searchable: false, orderable: false},
        {data: 'referanceNo'},
        {data: 'clientOrderId'},
        {data: 'orderDate' , searchable: false, orderable: false},
        {data: 'packetHistory' , searchable: false, orderable: false},
        {data: 'warehouseCode' , searchable: false, orderable: false},
        {data: 'clientCode' , orderable: false},
        {data: 'productName' , searchable: false, orderable: false},
        {data: 'paymentType' , searchable: false, orderable: false},
        {data: 'weight' , searchable: false, orderable: false},
        {data: 'senderName' , searchable: false, orderable: false},
        {data: 'consigneeName' , searchable: false, orderable: false},
        {data: 'currentStatus' , searchable: false, orderable: false},
        {data: 'courierCode'},
        {data: 'courierAWBNumber'},
        {data: '', searchable: false, orderable: false}
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

  async getServiceCourier() {
    //this.apiserviceService.SpinnerService.show();
    this.singleResponse = await this.apiserviceService.getCall(AppUrls.GET_CLIENT_SERVICE_COURIER);
    //this.apiserviceService.SpinnerService.hide();
    if (this.singleResponse.status === 'SUCCESS') {
      this.serviceCourierMap = this.singleResponse.responseBody;
      for (const key in this.serviceCourierMap) {
        this.clientServiceTypeList.push(key);
      }
    } else {
      this.serviceCourierMap = {};
      this.clientServiceTypeList = [];
    }
  }
  getCourierByService(service) {
    if (service == null || service === undefined || service === '' ) {
      this.clientCourierList = [];
    }
    this.clientCourierList = this.serviceCourierMap[service];
  }

//
  async getServiceProviderForBulk() {
      this.serviceTypes = [];
      this.apiserviceService.SpinnerService.show();
      const url = AppUrls.GET_SERVICE_PROVIDERS_FOR_BULK;
      this.singleResponse = await this.apiserviceService.getCall(url);
      this.apiserviceService.SpinnerService.hide();
      if (this.singleResponse.status === 'SUCCESS') {
        for (const key in this.singleResponse.responseBody) {
          this.serviceTypes.push(key);
        }
        // const element: HTMLElement = document.getElementById('serviceTab0') as HTMLElement;
        // element.click();
      } else {
        alert(this.singleResponse.message);
      }
  }

  selectAwbAShipNow(awbnumber) {
    this.currentAwb = null;
    this.currentAwb = awbnumber;
    this.serviceTypes = [];
    this.singleAssignedCourierCode = null;
    this.singleAssignedAwb = null;
    (<HTMLInputElement>document.getElementById('clientWarehouseSingle')).value = '';
  }

  async selectCourier() {
    this.serviceTypes = [];
    this.singleAssignedCourierCode = null;
    this.singleAssignedAwb = null;

    const clientWarehouseCode = (<HTMLInputElement>document.getElementById('clientWarehouseSingle')).value;
    if (clientWarehouseCode == null || clientWarehouseCode === undefined || clientWarehouseCode === '') {
      alert('Please select warehouse.');
      return false;
    }
    if (this.currentAwb == null || this.currentAwb === undefined || this.currentAwb === '') {
      alert('Please contact support team, AWB number assigned issue.');
      return false;
    }
    // this.currentAwb = awbnumber;
    this.apiserviceService.SpinnerService.show();
    this.loaderVisible = true;
    const url = AppUrls.CLIENT_SERVICE_PROVIDER + '?awb=' + this.currentAwb + '&warehouseCode=' + clientWarehouseCode;
    this.singleResponse = await this.apiserviceService.getCall(url);
    this.apiserviceService.SpinnerService.hide();
    this.loaderVisible = false;
    if (this.singleResponse.status === 'SUCCESS') {
      const loopCount = 0;
      for (const key in this.singleResponse.responseBody) {
        this.serviceTypes.push(key);
      }
      // const element: HTMLElement = document.getElementById('serviceTab0') as HTMLElement;
      // element.click();
    } else {
      alert(this.singleResponse.message);
      this.apiserviceService.SpinnerService.hide();
    }
  }

  checkCourierAndAwb(awbNumber, courierCode) {
      this.singleAssignedCourierCode = courierCode;
      this.singleAssignedAwb = awbNumber;
  }
  async assigneeCourier() {
    let warehouseCode = (<HTMLInputElement>document.getElementById('clientWarehouseSingle')).value;
    if (warehouseCode === undefined || warehouseCode === '') {
       alert('Please select warehouse.');
       return false;
    }
    let awbNumber = this.singleAssignedAwb;
    let courierCode = this.singleAssignedCourierCode;
    this.apiserviceService.SpinnerService.show();
    this.loaderVisible = true;
    const url = AppUrls.ASSIGNED_COURIER + '?awb=' + awbNumber + '&courierCode=' + courierCode + '&warehouseCode=' + warehouseCode;
    this.singleResponse = await this.apiserviceService.getCall(url);
    if (this.singleResponse.status === 'SUCCESS') {
      this.singleAssignedCourierCode = null;
      this.singleAssignedAwb = null;
      this.rerenderDatatable();
      $('#assigneeCourierModel').modal('hide');
      this.apiserviceService.SpinnerService.hide();
    } else {
      this.loaderVisible = false;
      this.apiserviceService.SpinnerService.hide();
      alert(this.singleResponse.message);
    }
  }

  async assigneeCourierBulk(id) {
     let warehouseCode = (<HTMLInputElement>document.getElementById('clientWarehouseBulk')).value;
     if (warehouseCode === undefined || warehouseCode === '') {
        alert('Please select warehouse.');
        return false;
     }
     let awbArray = [];
     this.checkBoxObjArray.forEach(x => {
        if (x.checked === true) {
            awbArray.push(x.value);
        }
     });
     if (awbArray.length <= 0) {
        alert('Please select awb number.');
        return false;
     }
     let courierCode = (<HTMLInputElement>document.getElementById(id)).value;
     if (courierCode === undefined || courierCode === '') {
         alert('Please select courier');
         return false;
     }

     let bean = {};
     bean['courierCode'] = courierCode;
     bean['awbList'] = awbArray;
     bean['warehouseCode'] = warehouseCode;
     const body = JSON.stringify(bean);
     this.apiserviceService.SpinnerService.show();
     this.loaderVisible = true;
     this.apiserviceService.getPostCall(AppUrls.ASSIGNED_COURIER_BULK, body).subscribe(result => {
        this.apiserviceService.SpinnerService.hide();
       this.loaderVisible = false;
        this.singleResponse = result;
        if (this.singleResponse.status === 'SUCCESS') {
             this.rerenderDatatable();
             $('#assigneeCourierBulkModel').modal('hide');
             if (this.singleResponse.responseBody != null) {
                 this.exportAsExcelFile(this.singleResponse.responseBody);
             }
             this.apiserviceService.SpinnerService.hide();
        } else {
           alert(this.singleResponse.message);
           this.apiserviceService.SpinnerService.hide();
        }
     });
  }

  assignedCourierByPriority() {
       let warehouseCode = (<HTMLInputElement>document.getElementById('clientWarehousePriority')).value;
       if (warehouseCode === undefined || warehouseCode === '') {
          alert('Please select warehouse.');
          return false;
       }
       let awbArray = [];
       this.checkBoxObjArray.forEach(x => {
           if (x.checked === true) {
               awbArray.push(x.value);
           }
       });
       if (awbArray.length <= 0) {
          alert('Please select  awb number.');
          return false;
       }
       let serviceType = (<HTMLInputElement>document.getElementById('serviceType')).value;
       if (serviceType === undefined || serviceType === '') {
           alert('Please select service type');
           return false;
       }

       let bean = {};
       bean['serviceType'] = serviceType;
       bean['awbList'] = awbArray;
       bean['warehouseCode'] = warehouseCode;
       const body = JSON.stringify(bean);
       this.apiserviceService.SpinnerService.show();
      this.loaderVisible = true;
       this.apiserviceService.getPostCall(AppUrls.ASSIGNED_COURIER_BY_PRIORITY, body).subscribe(result => {
         this.apiserviceService.SpinnerService.hide();
         this.singleResponse = result;
         this.loaderVisible = false;
         if (this.singleResponse.status === 'SUCCESS') {
              this.rerenderDatatable();
              $('#assigneeCourierByPriorityModel').modal('hide');
              if (this.singleResponse.responseBody != null) {
                  this.exportAsExcelFile(this.singleResponse.responseBody);
              }
              this.apiserviceService.SpinnerService.hide();
         } else {
            alert(this.singleResponse.message);
            this.apiserviceService.SpinnerService.hide();
         }
      });
  }

  public exportAsExcelFile(json: any[]): void {
      const workBook = XLSX.utils.book_new();
      const workSheet = XLSX.utils.json_to_sheet(json);

      XLSX.utils.book_append_sheet(workBook, workSheet, '');
      XLSX.writeFile(workBook, 'courier-assigned-error.xlsx');
  }
  async orderCancellation() {
    let awbArray = [];
    this.checkBoxObjArray.forEach(x => {
      if (x.checked === true) {
        awbArray.push(x.value);
      }
    });
    console.log(awbArray);
    if (awbArray.length <= 0) {
      alert('Please select awb number.');
      return false;
    }
    this.apiserviceService.SpinnerService.show();
    const url = AppUrls.ORDER_CANCILATTION + awbArray;
    this.getResponse = await this.apiserviceService.findById (url);
    this.apiserviceService.SpinnerService.hide();
    if (this.getResponse.status === 'SUCCESS') {
      if (this.getResponse.responseBody != null) {
        this.exportAsExcelFile(this.getResponse.responseBody);
      } else {
        window.location.reload();
        alert('Order cancel successfully.');
      }
    } else {
      alert(this.getResponse.message);
    }
  }

  async downloadLableBulk() {
    let awbArray = '';
    this.orderAssignedCheckBoxObjArray.forEach(x => {
      if (x.checked === true) {
        awbArray += x.value + ',';
      }
    });
    console.log(awbArray);
    if (awbArray === undefined || awbArray === null || awbArray === '' ) {
      alert('Please select awb number.');
      return false;
    }
    this.apiserviceService.SpinnerService.show();
    const url = AppUrls.GENERATE_ORDER_PRINT_LABEL;
    this.data = await this.apiserviceService.fileDownloadByPostMethod(url, awbArray);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], 'label.pdf', {type: 'application/pdf'});
    saveAs(file);
  }
  async downloadInvoiceBulk() {
    let awbArray = '';
    this.orderAssignedCheckBoxObjArray.forEach(x => {
      if (x.checked === true) {
        awbArray += x.value + ',';
      }
    });
    console.log(awbArray);
    if (awbArray === undefined || awbArray === null || awbArray === '' ) {
      alert('Please select awb number.');
      return false;
    }
    this.apiserviceService.SpinnerService.show();
    const url = AppUrls.GENERATE_INVOICE_PRINT_LABEL;
    this.data = await this.apiserviceService.fileDownloadByPostMethod(url, awbArray);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], 'invoice.pdf', {type: 'application/pdf'});
    saveAs(file);
  }



  async printInvoice(awb) {
    this.apiserviceService.SpinnerService.show();
    const url = AppUrls.GENERATE_INVOICE_PRINT_LABEL;
    this.data = await this.apiserviceService.fileDownloadByPostMethod(url, awb);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], awb + '-invoice.pdf', {type: 'application/pdf'});
    saveAs(file);
  }
  async printLabel(awb) {
      this.apiserviceService.SpinnerService.show();
      const url = AppUrls.GENERATE_ORDER_PRINT_LABEL;
      this.data = await this.apiserviceService.fileDownloadByPostMethod(url, awb);
      this.apiserviceService.SpinnerService.hide();
      const blob = new Blob([this.data], {type: 'application/octet-stream'});
      const file = new File([blob], awb + '-label.pdf', {type: 'application/pdf'});
      saveAs(file);
    }

  async onDownloadOrderReceivedReport() {
    const fileName = 'OrderReceivedReport';
    const url = AppUrls.DOWNLOAD_ORDER_RECEIVED_REPORT;
    this.apiserviceService.SpinnerService.show();
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], fileName + '.xlsx', {type: 'application/vnd.ms.excel'});
    saveAs(file);
  }

  async onDownloadOrderProcessReport() {
    const fileName = 'OrderProcessReport';
    const url = AppUrls.DOWNLOAD_ORDER_PROCESS_REPORT;
    this.apiserviceService.SpinnerService.show();
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], fileName + '.xlsx', {type: 'application/vnd.ms.excel'});
    saveAs(file);
  }

  async onDownloadOrderAssignedReport() {
    const fileName = 'OrderAssignedReport';
    const url = AppUrls.DOWNLOAD_ORDER_ASSIGNED_REPORT;
    this.apiserviceService.SpinnerService.show();
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], fileName + '.xlsx', {type: 'application/vnd.ms.excel'});
    saveAs(file);
  }

  async getCurrentUserWarehouses() {
    const url = AppUrls.GET_LOGIN_USER_WAREHOUSES;
    this.singleResponse = await this.apiserviceService.getCall(url);
    if (this.singleResponse.status === 'SUCCESS') {
      this.warehouseList = this.singleResponse.responseBody;
    } else {
      alert(this.singleResponse.message);
    }
  }

}
