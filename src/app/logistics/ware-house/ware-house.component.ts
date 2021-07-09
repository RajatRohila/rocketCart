import {Component, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {interval, Subject, Subscription} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AppUrls} from '../../common/Api_Url_Seeting';
import {ApiserviceService} from '../../apiservice.service';
import {ClientWarehouse} from '../ware-house/warehouse';
import {saveAs} from 'file-saver';
import {map} from 'rxjs/operators';
import {HttpClient, HttpEventType} from '@angular/common/http';
@Component({
  selector: 'app-ware-house',
  templateUrl: './ware-house.component.html',
  styleUrls: ['./ware-house.component.css']
})
export class WareHouseComponent implements OnInit {


  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  title = 'datatables';
  public isDisplay = true;
  public isFirst = true;
  public isAdd = false;
  public isUpdate = false;
  public posts;
  public responsedata;
  public allRecords;
  public deleteRecord;
  public singleRecord = new ClientWarehouse();
  public clientWarehouses: ClientWarehouse[];
  public getSingleResponse;
  public clientCodeList;
  public data;
  public pincodeDetails = {city: '', state: '', country: ''};

  public uploadPresentage = 0;
  public isUploadStart = false;
  public isUploadButtonDisabled = false;
  public token = '';
  subscription: Subscription;
  public isUpload = false;
  public isUpdateBulkupload = false;
  public response;
  form: FormGroup;
  error: string;

  responseBody = {errorFileName: '', errorRecord: 0, fileName: '', filePath: '', successFileName: '', successRecord: 0, totalRecord: 0};

  clientWarehouseForm = new FormGroup({
    clientCode: new FormControl('', [Validators.required]),
    warehouseCode: new FormControl('', [Validators.required]),
    warehouseName: new FormControl('', [Validators.required]),
    contactPersonName: new FormControl('', [Validators.required]),
    contactNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]),
    alternateContact: new FormControl('', [Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]),
    email: new FormControl(''),
    address: new FormControl('', [Validators.required]),
    pinCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(6), Validators.maxLength(6)]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
  });
  updateClientWarehouseForm = new FormGroup({
    id: new FormControl(''),
    clientCode: new FormControl('', [Validators.required]),
    warehouseCode: new FormControl('', [Validators.required]),
    warehouseName: new FormControl('', [Validators.required]),
    contactPersonName: new FormControl('', [Validators.required]),
    contactNumber: new FormControl('', [Validators.required]),
    alternateContact: new FormControl(''),
    email: new FormControl(''),
    address: new FormControl('', [Validators.required]),
    pinCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(6), Validators.maxLength(6)]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    active: new FormControl(),
  });
  constructor(private apiserviceService: ApiserviceService, private formBuilder: FormBuilder, private http: HttpClient) {
  }
  async ngOnInit(): Promise<void> {
    this.apiserviceService.urlAuthorization();
    this.getclientRecords();
    this.dtOptions = this.buildDtOptionpkg(AppUrls.CLIENT_WAREHOUSE_SORT_AND_PAGING);
    this.isFirst = true;
    this.form = this.formBuilder.group({
      file: [''],
      uploadId: [''],
      isUpdate: false
    });
  }
  addNew() {
    this.isUpdateBulkupload = false;
    this.isUpload = false;
    this.isDisplay = false;
    this.isAdd = true;
    this.isFirst = false;
    this.isUpdate = false;
    this.getclientRecords();
  }
  cancelButtonAction() {
    this.isUpdateBulkupload = false;
    this.isUpload = false;
    this.isDisplay = true;
    this.isAdd = false;
    this.isFirst = false;
    this.isUpdate = false;
  }
  async updateRecords(id) {
    await this.getclientRecords();
    await this.findById(id);
    this.isUpdateBulkupload = false;
    this.isUpload = false;
    this.isUpdate = true;
    this.isDisplay = false;
    this.isAdd = false;
    //this.updateClientWarehouseForm.get('clientWarehouse').patchValue(this.singleRecord.clientWarehouse);
    this.pincodeDetails.city = this.singleRecord.city;
    this.pincodeDetails.state = this.singleRecord.state;
    this.pincodeDetails.country = this.singleRecord.country;
    console.log(this.pincodeDetails.city);
    console.log(this.pincodeDetails.state);
    console.log(this.pincodeDetails.country);
  }
  excalUpload() {
    this.isUpdateBulkupload = false;
    this.isDisplay = false;
    this.isAdd = false;
    this.isFirst = false;
    this.isUpload = true;
  }
  async deleteRecords(id) {
    this.isUpdate = false;
    await this.deleteById(id);
    this.dtOptions = this.buildDtOptionpkg(AppUrls.CLIENT_WAREHOUSE_DELETE_RECORD);
    console.log(id);
  }
  isCheck(elementName) {
    if (elementName === 'UPDATE') {
      if (this.isUpdateBulkupload) {
        this.isUpdateBulkupload = false;
      } else {
        this.isUpdateBulkupload = true;
      }
      console.log(this.isUpdateBulkupload);
    }
  }
  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.get('file').setValue(file);
    }
  }
  onBulkUpload() {
    const formData = new FormData();
    console.log(this.form.get('file').value);
    console.log(this.form.get('uploadId').value);
    if (this.form.get('file').value === null || this.form.get('file').value === '') {
      alert('Please select file');
    } else {
      formData.append('files', this.form.get('file').value);
      formData.append('uploadId', 'clientWarehouseBuklUpload');
      formData.append('isUpdate', this.isUpdateBulkupload + '');
      this.upload(formData, 'api/uploadFile').subscribe(
        (res) => res,
        (err) => this.error = err
      );
    }
  }

  async downloadTemplate() {
    const fileName = 'clientWarehouseBuklUpload';
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
    const url = AppUrls.UPLOAD_PREOGRESS + '?key=domesticRateCardBulkUpload&token=' + this.token;
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
                this.isUpdateBulkupload = false;
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

  onSubmit() {
    const body = JSON.stringify(this.clientWarehouseForm.value);
    this.apiserviceService.SpinnerService.show();
    this.apiserviceService.saveData(AppUrls.CLIENT_WAREHOUSE_SAVE_RECORD, body).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
        /* alert('save successfully');*/
        this.clientWarehouseForm.reset();
        this.cancelButtonAction();
        this.rerenderDatatable();
      } else {
        alert(this.getSingleResponse.message);
      }
    });
  }
  onUpdateSubmit() {
    const body = JSON.stringify(this.updateClientWarehouseForm.value);
    this.apiserviceService.SpinnerService.show();
    this.apiserviceService.updateData(AppUrls.CLIENT_WAREHOUSE_UPDATE_RECORD, body).subscribe(result => {
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
  async deleteById(id) {
    this.apiserviceService.SpinnerService.show();
    const url = AppUrls.CLIENT_WAREHOUSE_DELETE_RECORD + id;
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
    this.apiserviceService.SpinnerService.show();
    const url = AppUrls.CLIENT_WAREHOUSE_FIND_BY_ID + id;
    this.getSingleResponse = await this.apiserviceService.findById(url);
    this.apiserviceService.SpinnerService.hide();
    if (this.getSingleResponse.status === 'SUCCESS') {
      this.singleRecord = this.getSingleResponse.responseBody;
      console.log(this.singleRecord);
    }
  }

  async getCityStateCountryByPincode(isUpdate) {
    let pincode = null;
    if (isUpdate === true) {
      pincode = this.updateClientWarehouseForm.value.pinCode;
    } else {
      pincode = this.clientWarehouseForm.value.pinCode;
    }
    if (pincode.length < 6) {
      return false;
    }
    this.apiserviceService.SpinnerService.show();
    this.allRecords = await this.apiserviceService.fetchAllRecords(AppUrls.GET_CITY_STATTE_COUNTRY_BY_PINCODE + pincode);
    this.apiserviceService.SpinnerService.hide();
    if (this.allRecords.status === 'SUCCESS') {
      console.log(this.allRecords.responseBody);
      this.pincodeDetails.city = this.allRecords.responseBody.CITY_NAME;
      this.pincodeDetails.state = this.allRecords.responseBody.STATE_NAME;
      this.pincodeDetails.country = this.allRecords.responseBody.COUNTRY_NAME;
    } else {
      this.pincodeDetails.city = '';
      this.pincodeDetails.state = '';
      this.pincodeDetails.country = '';
      alert(this.allRecords.message);
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

  async onDownloadClientWarehouseReport() {
    const fileName = 'clientWarehouseReport';
    const url = AppUrls.DOWNLOAD_CLIENT_WAREHOUSE_REPORT;
    this.apiserviceService.SpinnerService.show();
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], fileName + '.xlsx', {type: 'application/vnd.ms.excel'});
    saveAs(file);
  }
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
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
              this.clientWarehouses = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              this.clientWarehouses = [];
              /*this.isAdd = true;*/
            }
          });
      },
      columns: [
        {data: 'id'},
        {data: 'clientCode'},
        {data: 'warehouseCode'},
        {data: 'warehouseName'},
        {data: 'address'},
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
