import {Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiserviceService} from 'src/app/apiservice.service';
import {Courierstatusmapping} from './courierstatusmapping.model';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {interval, Subject, Subscription} from 'rxjs';
import {CourierStatusMapping} from './courier status mapping';
import {AppUrls} from '../../common/Api_Url_Seeting';
import {saveAs} from 'file-saver';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-courier-status-mapping',
  templateUrl: './courier-status-mapping.component.html',
  styleUrls: ['./courier-status-mapping.component.css']
})
export class CourierStatusMappingComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  title = 'datatables';
  public isDisplay = true;
  public isFirst = false;
  public isAdd = false;
  public isUpdate = false;
  public isUpload = false;
  public isDisplayDataTable = true;
  public isUploadStart = false;
  public isUploadButtonDisabled = false;
  public uploadPresentage = 0;
  public token = '';
  subscription: Subscription;
  public posts;
  public responsedata;
  public allRecords;
  public deleteRecord;
  public singleRecord = new CourierStatusMapping();
  public courierStatusMappings: CourierStatusMapping[];
  public getSingleResponse;
  public courierIdList;
  public response;

  dynStatusMappings: Array<Courierstatusmapping> = [];
  newCourierstatusmappingDyn: any = {};

  public data;
  form: FormGroup;
  error: string;
  responseBody = {errorFileName: '', errorRecord: 0, fileName: '', filePath: '', successFileName: '', successRecord: 0, totalRecord: 0};

  courierStatusMappingForm = new FormGroup({
    statusMappings: new FormControl('', [Validators.required]),
    courierId: new FormControl(''),
    token: new FormControl(''),
    serviceProviderId: new FormControl('', [Validators.required])
  });

  courierStatusMappingUpdateForm = new FormGroup({
    id: new FormControl(''),
    statusMappings: new FormControl(''),
    courierId: new FormControl('',[Validators.required]),
    token: new FormControl(''),
    serviceProviderId: new FormControl('', [Validators.required])
  });

  constructor(private apiserviceService: ApiserviceService, private formBuilder: FormBuilder, private http: HttpClient) {

  }

  async ngOnInit(): Promise<void> {
    this.apiserviceService.urlAuthorization();
    this.dtOptions = this.buildDtOptionpkg(AppUrls.COURIER_STATUS_MAPPING_SORT_AND_PAGING);
    this.getAllCourierRecods();
    this.newCourierstatusmappingDyn = {selfStatusCode: '', courierStatusCode: '', ndrCode: '', extra: ''};
    this.dynStatusMappings.push(this.newCourierstatusmappingDyn);
    this.form = this.formBuilder.group({
      file: [''],
      uploadId: ['']
    });
  }

  addNew() {
    this.isDisplayDataTable = false;
    this.isDisplay = false;
    this.isAdd = true;
    this.isFirst = false;
    this.isUpdate = false;

  }
  bulkUpload() {
    this.isDisplayDataTable = false;
    this.isDisplay = false;
    this.isAdd = false;
    this.isFirst = false;
    this.isUpload = true;
  }

  cancelButtonAction() {
    this.isDisplayDataTable = true;
    this.isUpload = false;
    this.isDisplay = true;
    this.isAdd = false;
    this.isFirst = false;
    this.isUpdate = false;
  }
  async updateRecords(id) {
    await this.findById(id);
    this.isUpdate = true;
    this.isDisplayDataTable = false;
    this.isDisplay = false;
    this.isAdd = false;
    this.dynStatusMappings = [];
    // this.deleteFieldValue(1);
    /*this.courierStatusMappingUpdateForm.value.id = this.singleRecord.id;*/
    this.dynStatusMappings = this.singleRecord.statusMappings;
  }

  async deleteRecords(id) {
    this.isUpdate = false;
    await this.deleteById(id);
    this.dtOptions = this.buildDtOptionpkg(AppUrls.COURIER_STATUS_MAPPING_DELETE_RECORD);
    console.log(id);
  }
  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.get('file').setValue(file);
    }
  }
  onbulkUpload() {
    const formData = new FormData();
    console.log(this.form.get('file').value);
    console.log(this.form.get('uploadId').value);
    formData.append('files', this.form.get('file').value);
    formData.append('uploadId', 'courierStatusMappingBulk');
    this.upload(formData, 'api/uploadFile').subscribe(
      (res) => res,
      (err) => this.error = err
    );
  }

  async downloadTemplate() {
    const fileName = 'courierStatusMappingBulk';
    const url = AppUrls.SALE_ORDER_DOWNLOAD_TEMPLATE + '?templateName=' + fileName;
    this.apiserviceService.SpinnerService.show();
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], fileName + '.xlsx', {type: 'application/vnd.ms.excel'});
    saveAs(file);
  }

  async downloadSuccessFile() {
    const url = AppUrls.SALE_ORDER_DOWNLOAD_SUCCESS_FILE + '?fileName=' + this.responseBody.successFileName + '&filePath=' + this.responseBody.filePath;
    this.apiserviceService.SpinnerService.show();
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    console.log(this.data);
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], this.responseBody.successFileName, {type: 'application/vnd.ms.excel'});
    saveAs(file);

  }

  async downloadErrorFile() {
    const url = AppUrls.SALE_ORDER_DOWNLOAD_FILE_ERROR_URL + '?fileName=' + this.responseBody.errorFileName + '&filePath=' + this.responseBody.filePath;
    this.apiserviceService.SpinnerService.show();
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], this.responseBody.errorFileName, {type: 'application/vnd.ms.excel'});
    saveAs(file);
  }
  public clearResponse() {
    this.responseBody.errorFileName = '';
    this.responseBody.successFileName = '';
    this.responseBody.errorRecord = 0;
    this.responseBody.successRecord = 0;
    this.responseBody.totalRecord = 0;
  }
  async getProgress() {
    this.apiserviceService.SpinnerService.show();
    const url = AppUrls.UPLOAD_PREOGRESS + '?key=courierStatusMappingBulk&token=' + this.token;
    this.response =  await this.apiserviceService.getCall(url);
    this.apiserviceService.SpinnerService.hide();
    if (this.response.status === 'SUCCESS') {
      if (this.response.responseBody != null && this.response.responseBody !== undefined) {
        this.response = this.response.responseBody;
        this.uploadPresentage = this.response.progressPercentage;
        this.token = this.response.token;
        if (this.response.uploadCompleted) {
          this.subscription.unsubscribe();
          this.isUploadStart = false;
          this.uploadPresentage = 0;
          this.isUploadButtonDisabled = false;
        }
      }
    }
  }
  startInterval() {
    this.subscription = interval(1000).subscribe(x => {
      this.getProgress();
    });
  }

  public upload(data, url) {
    this.isUploadButtonDisabled = true;
    this.clearResponse();
    this.isUploadStart = true;
    this.token = '';
    this.startInterval();
    const headers = {'Authorization':  localStorage.getItem('token'), 'userID': localStorage.getItem('userID')};
    this.apiserviceService.SpinnerService.show();
    return this.http.post<any>(url, data, {
      reportProgress: true,
      observe: 'events',
      headers: headers
    }).pipe(map((event) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            const progress = Math.round(100 * event.loaded / event.total);
            return {status: 'progress', message: progress};
          case HttpEventType.Response:
            this.apiserviceService.SpinnerService.hide();
            if (event.body.status === 'SUCCESS') {
              this.responseBody = event.body.responseBody;
              if (this.responseBody.errorRecord === null || this.responseBody.errorRecord === undefined
                || this.responseBody.errorRecord <= 0) {
                this.cancelButtonAction();
                this.rerenderDatatable();
              }
            }
            this.isUploadButtonDisabled = false;
            this.isUploadStart = false;
            this.subscription.unsubscribe();
            return this.responseBody;
          default:
            this.apiserviceService.SpinnerService.hide();
            return `Unhandled event: ${event.type}`;
        }
      })
    );
  }

  onUpdateSubmit() {
    const id = (<HTMLInputElement>document.getElementById('id-update')).value;
    const courierId = (<HTMLInputElement>document.getElementById('courierId-update')).value;
    const token = (<HTMLInputElement>document.getElementById('token-update')).value;
    const serviceProviderId = (<HTMLInputElement>document.getElementById('serviceProviderId-update')).value;
    const statusMappings = [];
    for (const item of this.dynStatusMappings) {
      console.log(item);
      statusMappings.push(item);
    }
    this.courierStatusMappingUpdateForm.value.id = id;
    this.courierStatusMappingUpdateForm.value.courierId = courierId;
    this.courierStatusMappingUpdateForm.value.token = token;
    this.courierStatusMappingUpdateForm.value.serviceProviderId = serviceProviderId;
    this.courierStatusMappingUpdateForm.value.statusMappings = statusMappings;
    const body = JSON.stringify(this.courierStatusMappingUpdateForm.value);
    this.apiserviceService.SpinnerService.show();
    this.apiserviceService.updateData(AppUrls.COURIER_STATUS_MAPPING_UPDATE_RECORD, body).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
        this.cancelButtonAction();
        this.rerenderDatatable();
      } else {
        alert(this.getSingleResponse.message);
      }
    });
  }

  async deleteById(id) {
    this.apiserviceService.SpinnerService.show();
    const url = AppUrls.COURIER_STATUS_MAPPING_DELETE_RECORD + id;
    this.deleteRecord = await this.apiserviceService.deleteById(url);
    this.apiserviceService.SpinnerService.hide();
    if (this.deleteRecord.status === 'SUCCESS') {
      this.rerenderDatatable();
    } else {
      alert(this.getSingleResponse.message);
    }
  }

  async findById(id) {
    this.singleRecord = null;
    this.apiserviceService.SpinnerService.show();
    const url = AppUrls.COURIER_STATUS_MAPPING_FIND_BY_ID + id;
    this.getSingleResponse = await this.apiserviceService.findById(url);
    this.apiserviceService.SpinnerService.hide();
    if (this.getSingleResponse.status === 'SUCCESS') {
      this.singleRecord = this.getSingleResponse.responseBody;
      console.log(this.singleRecord);
    }
  }

  async getAllCourierRecods() {
    this.apiserviceService.SpinnerService.show();
    this.responsedata = await this.apiserviceService.fetchAllRecords(AppUrls.GET_ACTIVE_COURIERS);
    this.apiserviceService.SpinnerService.hide();
    if (this.responsedata.status === 'SUCCESS') {
      this.courierIdList = this.responsedata.responseBody;
    }
  }

  addTableRow() {
    this.newCourierstatusmappingDyn = {selfStatusCode: '', courierStatusCode: '', ndrCode: '', extra: ''};
    this.dynStatusMappings.push(this.newCourierstatusmappingDyn);
    console.log(this.dynStatusMappings);
    this.newCourierstatusmappingDyn = {};
  }

  deleteFieldValue(index) {
    this.dynStatusMappings.splice(index, 1);
  }

  onSubmit() {
    const courierId = (<HTMLInputElement>document.getElementById('courierId')).value;
    const token = (<HTMLInputElement>document.getElementById('token')).value;
    const serviceProviderId = (<HTMLInputElement>document.getElementById('serviceProviderId')).value;
    const statusMappings = [];
    for (const item of this.dynStatusMappings) {
      statusMappings.push(item);
    }
    this.courierStatusMappingForm.value.courierId = courierId;
    this.courierStatusMappingForm.value.token = token;
    this.courierStatusMappingForm.value.serviceProviderId = serviceProviderId;
    this.courierStatusMappingForm.value.statusMappings = statusMappings;
    const body = JSON.stringify(this.courierStatusMappingForm.value);
    this.apiserviceService.SpinnerService.show();
    this.apiserviceService.saveData(AppUrls.COURIER_STATUS_MAPPING_SAVE_RECORD, body).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
        this.cancelButtonAction();
        this.rerenderDatatable();
        this.courierStatusMappingForm.reset();
        (<HTMLInputElement>document.getElementById('courierId')).value = '';
        (<HTMLInputElement>document.getElementById('token')).value = '';
        (<HTMLInputElement>document.getElementById('serviceProviderId')).value = '';
        this.dynStatusMappings.slice(1);
        this.dynStatusMappings.length = 0;
        this.newCourierstatusmappingDyn = {selfStatusCode: '', courierStatusCode: '', ndrCode: '', extra: ''};
        this.dynStatusMappings.push(this.newCourierstatusmappingDyn);
        this.isDisplay = true;
        this.isAdd = false;
        this.dtOptions = this.buildDtOptionpkg(AppUrls.COURIER_STATUS_MAPPING_SORT_AND_PAGING);
      } else {
        alert(this.getSingleResponse.message);
      }
    });
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
              this.courierStatusMappings = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              /*this.isAdd = true;*/
              this.courierStatusMappings = [];
            }

          });
      },
      columns: [
        {data: 'id'},
        {data: 'courierId'},
        {data: 'token'},
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
