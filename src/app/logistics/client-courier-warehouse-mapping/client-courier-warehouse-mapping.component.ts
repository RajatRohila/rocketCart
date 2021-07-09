import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiserviceService} from '../../apiservice.service';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {AppUrls} from '../../common/Api_Url_Seeting';
import {saveAs} from 'file-saver';
import {map} from 'rxjs/operators';
import {DataTableDirective} from 'angular-datatables';
import {Subject, interval, Subscription} from 'rxjs';
import {ClientCourierWarehouseMapping} from './client-courier-warehouse-mapping';

@Component({
  selector: 'app-client-courier-warehouse-mapping',
  templateUrl: './client-courier-warehouse-mapping.component.html',
  styleUrls: ['./client-courier-warehouse-mapping.component.css']
})
export class ClientCourierWarehouseMappingComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  title = 'datatables';
  public isDisplay = true;
  public isDisplayDataTable = true;
  public isFirst = true;
  public isAdd = false;
  public isUpload = false;
  public isUpdate = false;
  /*public responsedata;
  public allRecords;*/
  public posts;
  public deleteRecord;
  public singleRecord = new ClientCourierWarehouseMapping();
  public clientCourierWarehouseMappings: ClientCourierWarehouseMapping[];
  public clientCourierWarehouseMapping: any;
  public getSingleResponse;
  public clientCodeList;
  public clientWarehouseCodeList;
  public serviceProviderCodeList;

  public uploadPresentage = 0;
  public isUploadStart = false;
  public isUploadButtonDisabled = false;
  public token = '';
  subscription: Subscription;

  public response;
  public data;
  form: FormGroup;
  error: string;
  responseBody = {errorFileName: '', errorRecord: 0, fileName: '', filePath: '', successFileName: '', successRecord: 0, totalRecord: 0};

  clientCourierWarehouseMappingForm = new FormGroup({
    clientCode: new FormControl('', [Validators.required]),
    clientWarehouseCode: new FormControl('', [Validators.required]),
    serviceProviderCode: new FormControl('', [Validators.required]),
    serviceProviderWarehouseCode: new FormControl('', [Validators.required]),


  });
  updateClientCourierWarehouseMappingForm = new FormGroup({
    id: new FormControl(''),
    clientCode: new FormControl('', [Validators.required]),
    clientWarehouseCode: new FormControl('', [Validators.required]),
    serviceProviderCode: new FormControl('', [Validators.required]),
    serviceProviderWarehouseCode: new FormControl('', [Validators.required]),
    active: new FormControl(),
  });
  constructor(private apiserviceService: ApiserviceService, private formBuilder: FormBuilder, private http: HttpClient) {
  }

  ngOnInit() {
    this.dtOptions = this.buildDtOptionpkg(AppUrls.CLIENT_COURIER_WAREHOUSE_MAPPING_SORT_AND_PAGING);
    this.isFirst = true;
    this.getclientRecords();
    this.getclientWarehouseRecords();
    this.getserviceProviderRecords();
    this.form = this.formBuilder.group({
      file: [''],
      uploadId: ['']
    });
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.get('file').setValue(file);
    }
  }

  onExcelUpload() {
    const formData = new FormData();
    console.log(this.form.get('file').value);
    console.log(this.form.get('uploadId').value);
    formData.append('files', this.form.get('file').value);
    formData.append('uploadId', 'uploadClientCourierWarehouseMapping');
    this.upload(formData, 'api/uploadFile').subscribe(
      (res) => res,
      (err) => this.error = err
    );
  }

  async downloadTemplate() {
    const fileName = 'uploadClientCourierWarehouseMapping';
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

  startInterval() {
      this.subscription = interval(1000).subscribe(x => {
        this.getProgress();
      });
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
        const url = AppUrls.UPLOAD_PREOGRESS + '?key=uploadClientCourierWarehouseMapping&token=' + this.token;
        this.response =  await this.apiserviceService.getCall(url);
        this.apiserviceService.SpinnerService.hide();
        if (this.response.status === 'SUCCESS') {
            if(this.response.responseBody != null && this.response.responseBody !== undefined){
               this.response = this.response.responseBody;
               this.uploadPresentage = this.response.progressPercentage;
               this.token = this.response.token;
               if(this.response.uploadCompleted){
                  this.subscription.unsubscribe();
                  this.isUploadStart = false;
                  this.uploadPresentage = 0;
                  this.isUploadButtonDisabled = false;
               }
            }
        }
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

  addNew() {
    this.isDisplayDataTable = false;
    this.isDisplay = false;
    this.isAdd = true;
    this.isFirst = false;
    this.isUpload = false;

  }

  excalUpload() {
    this.isDisplayDataTable = false;
    this.isDisplay = true;
    this.isAdd = false;
    this.isFirst = false;
    this.isUpload = true;
  }

   async updateRecords(id) {
     await this.getclientRecords();
     await this.findById(id);
     console.log(id);
     this.isUpdate = true;
     this.isDisplayDataTable = false;
     this.isDisplay = false;
     this.isAdd = false;
     this.updateClientCourierWarehouseMappingForm.get('clientCode').patchValue(this.singleRecord.clientCode);
     this.updateClientCourierWarehouseMappingForm.get('clientWarehouseCode').patchValue(this.singleRecord.clientWarehouseCode);
     this.updateClientCourierWarehouseMappingForm.get('serviceProviderCode').patchValue(this.singleRecord.serviceProviderCode);
   }
  async deleteRecords(id) {
    this.isUpload = false;
    await this.deleteById(id);
    this.dtOptions = this.buildDtOptionpkg(AppUrls.CLIENT_COURIER_WAREHOUSE_MAPPING_DELETE_RECORD);
    console.log(id);
  }

  onSubmit() {
    this.apiserviceService.SpinnerService.show();
    const body = JSON.stringify(this.clientCourierWarehouseMappingForm.value);
    this.apiserviceService.saveData(AppUrls.CLIENT_COURIER_WAREHOUSE_MAPPING_SAVE_RECORD, body).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
        /* alert('save successfully');*/
        this.clientCourierWarehouseMappingForm.reset();
        this.cancelButtonAction();
        this.dtOptions = this.buildDtOptionpkg(AppUrls.CLIENT_COURIER_WAREHOUSE_MAPPING_DELETE_RECORD);
        this.rerenderDatatable();
      } else {
        alert(this.getSingleResponse.message);
      }
    });
  }

  onUpdateSubmit() {
    const body = JSON.stringify(this.updateClientCourierWarehouseMappingForm.value);
    this.apiserviceService.SpinnerService.show();
    this.apiserviceService.updateData(AppUrls.CLIENT_COURIER_WAREHOUSE_MAPPING_UPDATE_RECORD, body).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
        /*alert('update successfully');*/
        this.cancelButtonAction();
        this.rerenderDatatable();
      } else {
        alert(this.getSingleResponse.message);
      }
    });
  }
  cancelButtonAction() {
    this.isDisplayDataTable = true;
    this.isUpload = false;
    this.isDisplay = true;
    this.isAdd = false;
    this.isFirst = false;
    this.isUpdate = false;
  }

  async deleteById(id) {
    this.apiserviceService.SpinnerService.show();
    const url = AppUrls.CLIENT_COURIER_WAREHOUSE_MAPPING_DELETE_RECORD + id;
    this.deleteRecord = await this.apiserviceService.deleteById(url);
    this.apiserviceService.SpinnerService.hide();
    if (this.deleteRecord.status === 'SUCCESS') {
      alert('Record deleted successfully');
      this.rerenderDatatable();
    } else {
      alert(this.getSingleResponse.message);
    }
  }

  async findById(id) {
    const url = AppUrls.CLIENT_COURIER_WAREHOUSE_MAPPING_FIND_BY_ID + id;
    this.apiserviceService.SpinnerService.show();
    this.getSingleResponse = await this.apiserviceService.findById(url);
    this.apiserviceService.SpinnerService.hide();
    if (this.getSingleResponse.status === 'SUCCESS') {
      this.singleRecord = this.getSingleResponse.responseBody;
      console.log(this.singleRecord);
    }
  }

  async getclientRecords() {
    this.apiserviceService.SpinnerService.show();
    this.posts = await this.apiserviceService.fetchAllRecords('/api/getAllClient');
    this.apiserviceService.SpinnerService.hide();
    if (this.posts.status === 'SUCCESS') {
      this.clientCodeList = this.posts.responseBody;
    }
  }

  async getclientWarehouseRecords() {
    this.apiserviceService.SpinnerService.show();
    this.posts = await this.apiserviceService.fetchAllRecords('/api/getAllClientWarehouse');
    this.apiserviceService.SpinnerService.hide();
    if (this.posts.status === 'SUCCESS') {
      this.clientWarehouseCodeList = this.posts.responseBody;
      console.log(this.clientWarehouseCodeList);
    }
  }

  async getserviceProviderRecords() {
    this.apiserviceService.SpinnerService.show();
    this.posts = await this.apiserviceService.fetchAllRecords('/api/getAllServiceProvider');
    this.apiserviceService.SpinnerService.hide();
    this.serviceProviderCodeList = [];
    if (this.posts.status === 'SUCCESS') {
      this.serviceProviderCodeList = this.posts.responseBody;
    }
  }

  async onDownloadClientWarehouseMappingReport() {
    const fileName = 'clientCourierWarehouseMappingReport';
    const url = AppUrls.DOWNLOAD_CLIENT_COURIER_WAREHOUSE_MAPPING_REPORT;
    this.apiserviceService.SpinnerService.show();
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], fileName + '.xlsx', {type: 'application/vnd.ms.excel'});
    saveAs(file);
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
              this.clientCourierWarehouseMappings = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              this.clientCourierWarehouseMappings = [];
              /*this.isAdd = true;*/
            }
          });
      },
      columns: [
        {data: 'id'},
        {data: 'clientCode'},
        {data: 'clientWarehouseCode'},
        {data: 'serviceProviderCode'},
        {data: 'serviceProviderWarehouseCode'},
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

