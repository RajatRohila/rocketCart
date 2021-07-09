import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiserviceService} from 'src/app/apiservice.service';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {StatusFlow} from '../status-flow/status-flow.model';
import {ApiConfig} from './api-config';
import {AppUrls} from '../../common/Api_Url_Seeting';

@Component({
  selector: 'app-api-config',
  templateUrl: './api-config.component.html',
  styleUrls: ['./api-config.component.css']
})
export class ApiConfigComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  title = 'datatables';
  public isDisplay = true;
  public isFirst = true;
  public isAdd = false;
  public isUpdate = false;
  public IsResponseArray = false;
  public posts;
  public responsedata;
  public allRecords;
  public deleteRecord;
  public singleRecord = new ApiConfig();
  public apiConfigs: ApiConfig[];
  // public apiConfigTypeList;
  // public entityTypeList;
  public requestMethodList;
  public getSingleResponse;
  public clientList;
  public courierList;

  apiConfigForm = new FormGroup({
    clientId: new FormControl('', [Validators.required]),
    courierId: new FormControl('', [Validators.required]),
    apiConfigType: new FormControl('', [Validators.required]),
    apiUrl: new FormControl(),
    entityType: new FormControl('', [Validators.required]),
    requestMethod: new FormControl('', [Validators.required]),
    dataParams: new FormControl(),
    headerParems: new FormControl(),
    responseBean: new FormControl(),
    isResponseArray: new FormControl(),
    implClass: new FormControl('' ),
    responseType: new FormControl('' ),
    requestType: new FormControl(''),
    apiToken: new FormControl(''),
    extra1: new FormControl(''),
    extra2: new FormControl(''),
    extra3: new FormControl(''),
    serviceProviderId: new FormControl()

  });

  updateApiConfigForm = new FormGroup({
    id: new FormControl(''),
    clientId: new FormControl('', [Validators.required]),
    courierId: new FormControl('', [Validators.required]),
    apiConfigType: new FormControl('', [Validators.required]),
    apiUrl: new FormControl(),
    entityType: new FormControl('', [Validators.required]),
    requestMethod: new FormControl('', [Validators.required]),
    dataParams: new FormControl(),
    headerParems: new FormControl(),
    responseBean: new FormControl(),
    isResponseArray: new FormControl('', [Validators.required]),
    implClass: new FormControl('' ),
    responseType: new FormControl(''),
    requestType: new FormControl(''),
    apiToken: new FormControl(),
    extra1: new FormControl(),
    extra2: new FormControl(),
    extra3: new FormControl(),
    active: new FormControl(),
    serviceProviderId: new FormControl()
  });

  constructor(private apiserviceService: ApiserviceService) {

  }

  async ngOnInit(): Promise<void> {
    this.apiserviceService.urlAuthorization();
    this.dtOptions = this.buildDtOptionpkg(AppUrls.API_CONFIG_SORT_AND_PAGING);
    this.getClientRecords();
    this.getCourierRecords();
  }

  addNew() {
    this.isDisplay = false;
    this.isAdd = true;
    this.isFirst = false;
    this.isUpdate = false;

  }
  async updateRecords(id) {
    await this.findById(id);
    console.log(id);
    this.updateApiConfigForm.get('clientId').patchValue(this.singleRecord.clientId);
    this.updateApiConfigForm.get('courierId').patchValue(this.singleRecord.courierId);
    this.isUpdate = true;
    this.isDisplay = false;
    this.isAdd = false;
  }

  async deleteRecords(id) {
    this.isUpdate = false;
    await this.deleteById(id);
    this.dtOptions = this.buildDtOptionpkg(AppUrls.STATUS_FLOW_DELETE_RECORD);
    console.log(id);
  }
  changeValues() {
    if (this.IsResponseArray) {
      this.IsResponseArray = false;
    } else {
      this.IsResponseArray = true;
    }
    console.log(this.IsResponseArray);
  }

  onSubmit() {
      this.apiConfigForm.value.isResponseArray = this.IsResponseArray;
      const body = JSON.stringify(this.apiConfigForm.value);
      this.apiserviceService.SpinnerService.show();
      this.apiserviceService.saveData(AppUrls.API_CONFIG_SAVE_RECORD, body).subscribe(result => {
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
        this.apiserviceService.SpinnerService.hide();
        this.apiConfigForm.reset();
        this.cancelButtonAction();
        this.rerenderDatatable();
      } else {
        this.apiserviceService.SpinnerService.hide();
        alert(this.getSingleResponse.message);
      }
    });
  }

  onUpdateSubmit() {
      const body = JSON.stringify(this.updateApiConfigForm.value);
      this.apiserviceService.updateData(AppUrls.API_CONFIG_UPDATE_RECORD, body).subscribe(result => {
      this.apiserviceService.SpinnerService.show();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
        this.apiserviceService.SpinnerService.hide();
        this.cancelButtonAction();
        this.rerenderDatatable();
        this.isDisplay = true;
        this.isUpdate = false;
      } else {
        this.apiserviceService.SpinnerService.hide();
        alert(this.getSingleResponse.message);
      }
    });
  }

  cancelButtonAction() {
    this.isDisplay = true;
    this.isAdd = false;
    this.isFirst = false;
    this.isUpdate = false;
  }
  async deleteById(id) {
    const url = AppUrls.API_CONFIG_DELETE_RECORD + id;
    this.apiserviceService.SpinnerService.show();
    this.deleteRecord = await this.apiserviceService.deleteById(url);
    if (this.deleteRecord.status === 'SUCCESS') {
      this.apiserviceService.SpinnerService.hide();
      this.rerenderDatatable();
    } else {
      this.apiserviceService.SpinnerService.hide();
      alert(this.getSingleResponse.message);
    }
  }

  async findById(id) {
    const url = AppUrls.API_CONFIG_FIND_BY_ID + id;
    this.apiserviceService.SpinnerService.show();
    this.getSingleResponse = await this.apiserviceService.findById(url);
    if (this.getSingleResponse.status === 'SUCCESS') {
      this.apiserviceService.SpinnerService.hide();
      this.singleRecord = this.getSingleResponse.responseBody;
    } else {
      this.apiserviceService.SpinnerService.hide();
      alert(this.getSingleResponse.message);
    }
  }

  async getClientRecords() {
    this.apiserviceService.SpinnerService.show();
    this.posts = await this.apiserviceService.fetchAllRecords('/api/findByActiveClient');
    if (this.posts.status === 'SUCCESS') {
      this.apiserviceService.SpinnerService.hide();
      this.clientList = this.posts.responseBody;
      this.isFirst = false;
      this.isUpdate = false;
    } else {
      this.apiserviceService.SpinnerService.hide();
      alert(this.getSingleResponse.message);
    }
  }

  async getCourierRecords() {
    this.apiserviceService.SpinnerService.show();
    this.posts = await this.apiserviceService.fetchAllRecords('/api/findByActiveCourier');
    if (this.posts.status === 'SUCCESS') {
      this.apiserviceService.SpinnerService.hide();
      this.courierList = this.posts.responseBody;
      this.isFirst = false;
      this.isUpdate = false;
    } else {
      this.apiserviceService.SpinnerService.hide();
      alert(this.getSingleResponse.message);
    }
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
      order: [[0, "desc" ]],
      ajax: (dataTablesParameters: any, callback) => {
        this.apiserviceService.SpinnerService.show();
        this.apiserviceService.saveData(url, dataTablesParameters)
          .subscribe
          (resp => {
            this.apiserviceService.SpinnerService.hide();
            if (resp.data.length > 0) {
              this.apiConfigs = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              /*this.isAdd = true;*/
              this.apiConfigs = [];
            }

          });
      },
      columns: [
        {data: 'id'},
        {data: 'clientId'},
        {data: 'courierId'},
        {data: 'apiConfigType'},
        {data: 'apiUrl'},
        {data: 'requestMethod'},
        {data: 'isResponseArray'},
        {data: 'active'},
      ],
    };
  }

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
