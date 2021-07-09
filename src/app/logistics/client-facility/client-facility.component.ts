import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiserviceService} from 'src/app/apiservice.service';
import 'rxjs/add/operator/map';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {ClientFacilityModel} from './client-facility-model';
import {AppUrls} from '../../common/Api_Url_Seeting';

class ClientFacility {
  client: any;
  deliveryType: any;
  deliveryAttempt: any;
  smsServiceActive: any;
  mailServiceActive: any;
  awbAutoGenerate: any;
  walletActive: any;
  id: any;
  active: any;
  serviceCourierMap: any;
  rateCardTypeCode: any;
}

@Component({
  selector: 'app-client-facility',
  templateUrl: './client-facility.component.html',
  styleUrls: ['./client-facility.component.css']
})
export class ClientFacilityComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  disabled = false;
  showFilter = true;
  limitSelection = false;
  selectedItems: any = [];
  selectedDropdownItems: any = [];
  dropdownSettings: any = {};
  title = 'datatables';
  public isDisplay = true;
  public isFirst = false;
  public isAdd = false;
  public isUpdate = false;
  // private isClientLoaded = false;
  public posts;
  public allRecords;
  public deleteRecord;
  public singleRecord = new ClientFacility();
  public clientFacilitys: ClientFacility[];

  public getSingleResponse;
  public clientList;
  public serviceTypeList;
  public courierList;
  public serviceCourierObj;
  public rateCardTypeList;
  public isawbAutoGenerate = false;
  public issmsServiceActive = false;
  public ismailServiceActive = false;
  public iswalletActive = false;
  dynClientFacilityMappings: Array<ClientFacilityModel> = [];
  newClientFacilityDyn: any = {};
  deliveryTypeList = ['OTP_BASED_DELIVERY', 'SECURE_DELIVERY', 'NON_SECURE_DELIVERY'];
  clientFacilityForm = new FormGroup({
    clientId: new FormControl(''),
    awbAutoGenerate: new FormControl(''),
    smsServiceActive: new FormControl(''),
    mailServiceActive: new FormControl(''),
    walletActive: new FormControl(''),
    deliveryAttempt: new FormControl(''),
    deliveryType: new FormControl(''),
    rateCardTypeCode: new FormControl(''),
    serviceCourierMap: new FormControl('')
  });
  updateClientFacilityForm = new FormGroup({
    id: new FormControl(''),
    clientId: new FormControl(''),
    awbAutoGenerate: new FormControl(''),
    smsServiceActive: new FormControl(''),
    mailServiceActive: new FormControl(''),
    walletActive: new FormControl(''),
    deliveryAttempt: new FormControl(''),
    deliveryType: new FormControl(''),
    serviceCourierMap: new FormControl(''),
    rateCardTypeCode: new FormControl(''),
    active: new FormControl('')
  });
  private clientFacility: any;

  constructor(private apiserviceService: ApiserviceService) {
  }

  async ngOnInit(): Promise<void> {

    this.apiserviceService.urlAuthorization();
    this.dtOptions = this.buildDtOptionpkg(AppUrls.CLIENT_FACILITY_SORT_AND_PAGING);
    this.newClientFacilityDyn = {servicetype: '', serviceCourierMap: ''};
    this.dynClientFacilityMappings.push(this.newClientFacilityDyn);
    this.isFirst = true;

    this.selectedItems = [];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'courierCode',
      textField: 'courierName',
      selectedAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSelectFilter: this.showFilter
    };
    this.getAllServicetypeRecords();
    this.getAllCourierByServiceWise();
    this.getAllRateCardType();
    this.getAllClientRecords();
  }

  addNew() {
    this.setCheckBoxDefaultValue();
    this.selectedItems = [];
    this.isAdd = true;
    this.isFirst = false;
    this.isUpdate = false;
    this.isDisplay = false;
  }

  cancelButtonAction() {
    this.setCheckBoxDefaultValue();
    this.dynClientFacilityMappings = [];
    this.dynClientFacilityMappings.push(this.newClientFacilityDyn);
    this.isDisplay = true;
    this.isAdd = false;
    this.isFirst = false;
    this.isUpdate = false;
  }


  async updateRecords(id) {
    this.singleRecord = null;
    this.dynClientFacilityMappings = new Array<ClientFacilityModel>();
    this.setCheckBoxDefaultValue();
    await this.findById(id);
    this.isUpdate = true;
    this.isDisplay = false;
    this.isAdd = false;
    this.updateClientFacilityForm.value.id = this.singleRecord.id;
    this.updateClientFacilityForm.value.clientId = this.singleRecord.client.id;
    this.updateClientFacilityForm.value.rateCardTypeCode = this.singleRecord.rateCardTypeCode;
    this.updateClientFacilityForm.value.deliveryType = this.singleRecord.deliveryType;
    this.updateClientFacilityForm.value.deliveryAttempt = this.singleRecord.deliveryAttempt;
    this.updateClientFacilityForm.value.smsServiceActive = this.singleRecord.smsServiceActive;
    this.updateClientFacilityForm.value.mailServiceActive = this.singleRecord.mailServiceActive;
    this.updateClientFacilityForm.value.awbAutoGenerate = this.singleRecord.awbAutoGenerate;
    this.updateClientFacilityForm.value.walletActive = this.singleRecord.walletActive;
    this.updateClientFacilityForm.value.active = this.singleRecord.active;

    this.isawbAutoGenerate = this.singleRecord.awbAutoGenerate;
    this.issmsServiceActive = this.singleRecord.smsServiceActive;
    this.ismailServiceActive = this.singleRecord.mailServiceActive;
    this.iswalletActive = this.singleRecord.walletActive;
    this.deleteFieldValue(1);
    let loopCount = 0;
    // Service type selected items
    this.selectedDropdownItems = [];
    for (const value in this.singleRecord.serviceCourierMap) {
      if (value === null || value === undefined || value === '') {
        continue;
      }
      if (loopCount > 0) {
        this.addTableRow();
      }
      this.dynClientFacilityMappings[loopCount] = new ClientFacilityModel();
      this.dynClientFacilityMappings[loopCount].couriers = this.serviceCourierObj[value];
      this.selectedDropdownItems.push(value);
      const courierCodes = this.singleRecord.serviceCourierMap[value];
      if (courierCodes != null && courierCodes !== undefined) {
        this.selectedItems = [];
        for (const item of courierCodes.split(',')) {
          // loop for selected courier
          for (const courierObj of this.serviceCourierObj[value]) {
            if (item === courierObj.courierCode) {
              this.selectedItems.push(courierObj);
              break;
            }
          }
        }
        // loop for selected service type
        for (const serviceTypeObj of this.serviceTypeList) {
          if (value === serviceTypeObj.serviceCode) {
            // this.updateClientFacilityForm.value.serviceCourierMap.get('servicetype').patchValue(serviceTypeObj);
            this.dynClientFacilityMappings[loopCount].servicetype = serviceTypeObj;
            break;
          }
        }
        this.dynClientFacilityMappings[loopCount].serviceCourierMap = this.selectedItems;
      }
      loopCount++;
    }
  }

  /*async deleteRecords(id) {
    this.isUpdate = false;
    await this.deleteById(id);
    this.dtOptions = this.buildDtOptionpkg(AppUrls.CLIENT_FACILITY_DELETE_RECORD);

  }*/

  setCheckBoxDefaultValue() {
    this.isawbAutoGenerate = false;
    this.issmsServiceActive = false;
    this.ismailServiceActive = false;
    this.iswalletActive = false;
  }

  isCheck(elementName) {
    if (elementName === 'AwbAutoGenerate') {
      if (this.isawbAutoGenerate) {
        this.isawbAutoGenerate = false;
      } else {
        this.isawbAutoGenerate = true;
      }

    } else if (elementName === 'SmsServiceActive') {
      if (this.issmsServiceActive) {
        this.issmsServiceActive = false;
      } else {
        this.issmsServiceActive = true;
      }

    } else if (elementName === 'MailServiceActive') {
      if (this.ismailServiceActive) {
        this.ismailServiceActive = false;
      } else {
        this.ismailServiceActive = true;

      }
    } else if (elementName === 'WalletActive') {
      if (this.iswalletActive) {
        this.iswalletActive = false;
      } else {
        this.iswalletActive = true;

      }
    }
  }

  onChangeServiceType(type, index) {
    let serviceType = '';
    if ('ADD' === type) {
      serviceType = (<HTMLInputElement>document.getElementById('ADD_' + index)).value;
    } else if ('UPDATE' === type) {
      serviceType = (<HTMLInputElement>document.getElementById('UPDATE_' + index)).value;
    }
    this.courierList = this.serviceCourierObj[serviceType];
    this.dynClientFacilityMappings[index].couriers = this.serviceCourierObj[serviceType];
  }

  onUpdateSubmit() {
    const id = (<HTMLInputElement>document.getElementById('id')).value;
    const clientId = (<HTMLInputElement>document.getElementById('updateClientId')).value;
    const rateCardTypeCode = (<HTMLInputElement>document.getElementById('rateCardTypeCodeUpdate')).value;
    const deliveryTypeArray = (<HTMLInputElement>document.getElementById('updateDeliveryType')).value;
    const arr = deliveryTypeArray.split(':');
    let deliveryType = null;
    if (arr !== undefined && arr !== null && arr.length > 1) {
      deliveryType = arr[1].trim();
    }
    const deliveryAttempt = (<HTMLInputElement>document.getElementById('updateDeliveryAttempt')).value;
    const active = (<HTMLInputElement>document.getElementById('active')).value;

    const serviceCourierMap = new Map();
    for (const item of this.dynClientFacilityMappings) {
      let key = item.servicetype['serviceCode'];
      if (key === undefined) {
        key = item.servicetype;
      }
      const mapData = item.serviceCourierMap;
      let finalIdes = '';
      for (const mapItem of mapData) {
        finalIdes += mapItem['courierCode'] + ',';
      }
      serviceCourierMap[key] = finalIdes.slice(0, -1);
    }
    this.updateClientFacilityForm.value.id = id;
    this.updateClientFacilityForm.value.clientId = clientId;
    this.updateClientFacilityForm.value.rateCardTypeCode = rateCardTypeCode;
    this.updateClientFacilityForm.value.deliveryType = deliveryType;
    this.updateClientFacilityForm.value.deliveryAttempt = deliveryAttempt;
    this.updateClientFacilityForm.value.smsServiceActive = this.issmsServiceActive;
    this.updateClientFacilityForm.value.mailServiceActive = this.ismailServiceActive;
    this.updateClientFacilityForm.value.awbAutoGenerate = this.isawbAutoGenerate;
    this.updateClientFacilityForm.value.walletActive = this.iswalletActive;
    this.updateClientFacilityForm.value.active = active;
    this.updateClientFacilityForm.value.serviceCourierMap = serviceCourierMap;
    const body = JSON.stringify(this.updateClientFacilityForm.value);
    console.log(body);
    this.apiserviceService.SpinnerService.show();
    this.apiserviceService.updateData('/api/updateClientFacility', body).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
        /*alert('update successfully');*/
        this.rerenderDatatable();
        /*this.dtOptions = this.buildDtOptionpkg(AppUrls.CLIENT_FACILITY_UPDATE_RECORD);*/
        this.isDisplay = true;
        this.isUpdate = false;
      } else {
        alert(this.getSingleResponse.message);
      }
    });
  }

  async deleteById(id) {
    const url = AppUrls.CLIENT_FACILITY_DELETE_RECORD + id;
    this.apiserviceService.SpinnerService.show();
    this.deleteRecord = await this.apiserviceService.deleteById(url);
    this.apiserviceService.SpinnerService.hide();
    if (this.deleteRecord.status === 'SUCCESS') {
      alert('Record deleted successfully');
      this.rerenderDatatable();
      this.isDisplay = true;
    }
  }

  async findById(id) {
    this.apiserviceService.SpinnerService.show();
    const url = AppUrls.CLIENT_FACILITY_FIND_BY_ID + id;
    this.getSingleResponse = await this.apiserviceService.findById(url);
    this.apiserviceService.SpinnerService.hide();
    this.singleRecord = this.getSingleResponse.responseBody;

  }

  async getAllClientRecords() {
    this.apiserviceService.SpinnerService.show();
    this.posts = await this.apiserviceService.fetchAllRecords(AppUrls.ALL_CLIENT);
    /*this.posts = await this.apiserviceService.fetchAllRecords(AppUrls.CLIENT_FACILITY_GAT_ALL_CLIENT);*/
    this.apiserviceService.SpinnerService.hide();
    if (this.posts.status === 'SUCCESS') {
      this.clientList = this.posts.responseBody;
      this.isFirst = false;
    }
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  addTableRow() {
    this.newClientFacilityDyn = {servicetype: '', serviceCourierMap: '', couriers: []};
    this.dynClientFacilityMappings.push(this.newClientFacilityDyn);

    this.newClientFacilityDyn = {};
  }

  deleteFieldValue(index) {
    if (index === 0) {
      alert('Can not be deleted');
    } else {
      this.dynClientFacilityMappings.splice(index, 1);
    }
  }

  async getAllServicetypeRecords() {
    this.apiserviceService.SpinnerService.show();
    this.posts = await this.apiserviceService.fetchAllRecords('/api/getAllServiceType');
    this.apiserviceService.SpinnerService.hide();
    if (this.posts.status === 'SUCCESS') {
      this.serviceTypeList = this.posts.responseBody;
      this.isFirst = false;
    }
  }

  async getAllRateCardType() {
    this.apiserviceService.SpinnerService.show();
    this.posts = await this.apiserviceService.fetchAllRecords(AppUrls.GET_ALL_ACTIVE_RATE_CARD_TYPE);
    this.apiserviceService.SpinnerService.hide();
    if (this.posts.status === 'SUCCESS') {
      this.rateCardTypeList = this.posts.responseBody;
    }
  }

  /*async getAllCourierRecords() {
    this.posts = await this.apiserviceService.fetchAllRecords(AppUrls.GET_ACTIVE_COURIERS);
    this.apiserviceService.SpinnerService.show();
    this.posts = await this.apiserviceService.fetchAllRecords('/api/getAllCourier');
    this.apiserviceService.SpinnerService.hide();
    if (this.posts.status === 'SUCCESS') {
      this.courierList = this.posts.responseBody;
      this.isFirst = false;
    }
  }*/

  async getAllCourierByServiceWise() {
    this.apiserviceService.SpinnerService.show();
    this.posts = await this.apiserviceService.fetchAllRecords(AppUrls.GET_ALL_COURIER_BY_SERVICE_WISE);
    this.apiserviceService.SpinnerService.hide();
    if (this.posts.status === 'SUCCESS') {
      this.serviceCourierObj = this.posts.responseBody;
      console.log(this.serviceCourierObj);
      this.isFirst = false;
    }
  }

  onSubmit() {
    /* const clientId = (<HTMLInputElement>document.getElementById('clientId')).value;
     const rateCardTypeCode = (<HTMLInputElement>document.getElementById('rateCardTypeCode')).value;
     const deliveryType = (<HTMLInputElement>document.getElementById('deliveryType')).value;
     const deliveryAttempt = (<HTMLInputElement>document.getElementById('deliveryAttempt')).value;
     const mailServiceActive = this.ismailServiceActive;
     const awbAutoGenerate = this.isawbAutoGenerate;
     const smsServiceActive = this.issmsServiceActive;
     const walletActive = this.iswalletActive;*/
    const serviceCourierMap = new Map();
    for (const item of this.dynClientFacilityMappings) {
      const key = item.servicetype;

      const mapData = item.serviceCourierMap;
      let finalIdes = '';
      for (const mapItem of mapData) {
        finalIdes += mapItem['courierCode'] + ',';
      }

      serviceCourierMap[key] = finalIdes.slice(0, -1);
    }
    console.log(serviceCourierMap);
    this.clientFacilityForm.value.clientId = (<HTMLInputElement>document.getElementById('clientId')).value;
    this.clientFacilityForm.value.rateCardTypeCode = (<HTMLInputElement>document.getElementById('rateCardTypeCode')).value;
    this.clientFacilityForm.value.deliveryType = (<HTMLInputElement>document.getElementById('deliveryType')).value;
    this.clientFacilityForm.value.deliveryAttempt = (<HTMLInputElement>document.getElementById('deliveryAttempt')).value;
    this.clientFacilityForm.value.smsServiceActive = this.issmsServiceActive;
    this.clientFacilityForm.value.mailServiceActive = this.ismailServiceActive;
    this.clientFacilityForm.value.awbAutoGenerate = this.isawbAutoGenerate;
    this.clientFacilityForm.value.walletActive = this.iswalletActive;
    this.clientFacilityForm.value.serviceCourierMap = serviceCourierMap;
    const body = JSON.stringify(this.clientFacilityForm.value);
    console.log(body);
    this.apiserviceService.SpinnerService.show();
    this.apiserviceService.saveData(AppUrls.CLIENT_FACILITY_SAVE_RECORD, body).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
        /*alert('save successfully');*/
        this.clientFacilityForm.reset();
        this.selectedItems = [];
        (<HTMLInputElement>document.getElementById('clientId')).value = '';
        (<HTMLInputElement>document.getElementById('rateCardTypeCode')).value = '';
        (<HTMLInputElement>document.getElementById('deliveryType')).value = '';
        (<HTMLInputElement>document.getElementById('deliveryAttempt')).value = '';
        this.dynClientFacilityMappings.slice(1);
        this.dynClientFacilityMappings.length = 0;
        this.newClientFacilityDyn = {servicetype: '', serviceCourierMap: ''};
        this.dynClientFacilityMappings.push(this.newClientFacilityDyn);
        this.isDisplay = true;
        this.isAdd = false;
        /*this.dtOptions = this.buildDtOptionpkg(AppUrls.CLIENT_FACILITY_SORT_AND_PAGING);*/
        this.rerenderDatatable();
      } else {
        alert(this.getSingleResponse.message);
      }
    });
  }

  onItemSelect(item: any) {

  }

  onSelectAll(item: any) {

  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  buildDtOptionpkg(url: string): DataTables.Settings {
    return {
      pagingType: 'full_numbers',
      processing: false,
      serverSide: true,
      pageLength: 10,
      order: [[0, 'desc']],
      ajax: (dataTablesParameters: any, callback) => {
        this.apiserviceService.SpinnerService.show();
        this.apiserviceService.saveData(url, dataTablesParameters)
          .subscribe
          (resp => {
            this.apiserviceService.SpinnerService.hide();
            if (resp.data.length > 0) {
              this.clientFacilitys = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              /*this.isAdd = true;*/
              this.clientFacilitys = [];
            }

          });
      },
      columns: [
        {data: 'id'},
        {data: 'client.clientCode'},
        {data: 'deliveryType'},
        {data: 'deliveryAttempt'},
        {data: 'rateCardTypeCode'},
        {data: 'walletActive'},
        {data: 'active'},
        {data: 'id'},
      ],
    };
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


}


