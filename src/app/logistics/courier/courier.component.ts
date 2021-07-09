import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiserviceService} from 'src/app/apiservice.service';
import {CourierModel} from './courier.model';
import {DataTableDirective} from 'angular-datatables';
import {interval, Subject, Subscription} from 'rxjs';
import {AppUrls} from '../../common/Api_Url_Seeting';
import {saveAs} from 'file-saver';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {map} from 'rxjs/operators';


class Courier {
  serviceTypeId: any;
  serviceProviderId: any;
  courierCode: any;
  id: any;
  courierName: any;
  mobile: any;
  active: any;
  viewLogoAtLabel: any;
  serviceProviderCourierCode: any;
  city: string;
  state: string;
  country: string;
  latLong: String;
  apiCode: String;
  docUploaded: number;
}

@Component({
  selector: 'app-vendor',
  templateUrl: './courier.component.html',
  styleUrls: ['./courier.component.css']
})
export class CourierComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  title = 'datatables';
  public isDisplay = true;
  public isFirst = false;
  public isAdd = false;
  public isUpdate = false;
  public viewLogoAtLabel = false;
  public posts;
  public allRecords;
  public deleteRecord;
  public singleRecord = new Courier();
  public couriers: Courier[];
  // public singleRecord = new CourierModel();
  public getSingleResponse;
  public serviceProviderList;
  public serviceTypeList;
  public data;

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

  public pincodeDetails = {city: '', state: '', country: ''};
  courierForm = new FormGroup({
    courierName: new FormControl('', [Validators.required]),
    courierCode: new FormControl('', [Validators.required]),
    registeredAdd: new FormControl('', [Validators.required]),
    pincode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(6), Validators.maxLength(6)]),
    contactPerson: new FormControl('', [Validators.required]),
    mobile: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]),
    email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    gstNumber: new FormControl(),
    token: new FormControl(),
    beneficiry: new FormControl(''),
    viewLogoAtLabel: new FormControl(),
    accountNo: new FormControl(''),
    bankName: new FormControl(''),
    ifscCode: new FormControl(''),
    serviceProviderId: new FormControl('', [Validators.required]),
    serviceTypeId: new FormControl('', [Validators.required]),
    serviceProviderCourierCode: new FormControl(),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    latLong: new FormControl(''),
    apiCode: new FormControl(''),
    weightDimentionFactor: new FormControl()
  });

  updateCourierForm = new FormGroup({
    id: new FormControl(''),
    courierName: new FormControl('', [Validators.required]),
    courierCode: new FormControl('', [Validators.required]),
    registeredAdd: new FormControl('', [Validators.required]),
    pincode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(6), Validators.maxLength(6)]),
    contactPerson: new FormControl('', [Validators.required]),
    mobile: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]),
    email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    gstNumber: new FormControl(),
    token: new FormControl(),
    beneficiry: new FormControl(''),
    viewLogoAtLabel: new FormControl(),
    accountNo: new FormControl(''),
    bankName: new FormControl(''),
    ifscCode: new FormControl(''),
    serviceProviderId: new FormControl('', [Validators.required]),
    serviceTypeId: new FormControl('', [Validators.required]),
    serviceProviderCourierCode: new FormControl(),
    active: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    latLong: new FormControl(''),
    apiCode: new FormControl(''),
    weightDimentionFactor: new FormControl()
  });

  constructor(private apiserviceService: ApiserviceService, private formBuilder: FormBuilder, private http: HttpClient) {

  }

  async ngOnInit(): Promise<void> {
    this.apiserviceService.urlAuthorization();
    this.dtOptions = this.buildDtOptionpkg(AppUrls.COURIER_SORT_AND_PAGING);
    this.getAllServiceProviderRecords();
    this.getAllServicetypeRecords();
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
    this.getAllServiceProviderRecords();
    this.getAllServicetypeRecords();

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
    this.getAllServiceProviderRecords();
    this.getAllServicetypeRecords();
    await this.findById(id);
    this.isUpdateBulkupload = false;
    this.isUpload = false;
    this.isUpdate = true;
    this.isDisplay = false;
    this.isAdd = false;
    this.updateCourierForm.get('viewLogoAtLabel').patchValue(this.singleRecord.viewLogoAtLabel);
    this.updateCourierForm.get('serviceTypeId').patchValue(this.singleRecord.serviceTypeId);
    this.updateCourierForm.get('serviceProviderId').patchValue(this.singleRecord.serviceProviderId);
    this.pincodeDetails.city = this.singleRecord.city;
    this.pincodeDetails.state = this.singleRecord.state;
    this.pincodeDetails.country = this.singleRecord.country;
  }

  async deleteRecords(id) {
    this.isUpdate = false;
    await this.deleteById(id);
    this.dtOptions = this.buildDtOptionpkg(AppUrls.COURIER_SORT_AND_PAGING);

  }
  excalUpload() {
    this.isUpdateBulkupload = false;
    this.isDisplay = false;
    this.isAdd = false;
    this.isFirst = false;
    this.isUpload = true;
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
  changeValues() {
    if (this.viewLogoAtLabel) {
      this.viewLogoAtLabel = false;
    } else {
      this.viewLogoAtLabel = true;
    }
    console.log(this.viewLogoAtLabel);
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.get('file').setValue(file);
    }
  }

  async downloadlDoc(courierCode) {
    this.apiserviceService.SpinnerService.show();
    const url = AppUrls.DOWNLOAD_DOC + '?entityCode=' + courierCode + '&entityType=COURIER';
    this.data = await this.apiserviceService.downloadlDoc(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    if (blob != null && blob !== undefined) {
      const file = new File([blob], 'courierDoc.zip');
      saveAs(file);
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
      formData.append('uploadId', 'courierBuklUpload');
      formData.append('isUpdate', this.isUpdateBulkupload + '');
      this.upload(formData, 'api/uploadFile').subscribe(
        (res) => res,
        (err) => this.error = err
      );
    }
  }

  async downloadTemplate() {
    const fileName = 'courierBuklUpload';
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
    const body = JSON.stringify(this.courierForm.value);
    this.apiserviceService.SpinnerService.show();
    this.apiserviceService.saveData(AppUrls.COURIER_SAVE_RECORD, body).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
        this.courierForm.reset();
        this.cancelButtonAction();
        this.rerenderDatatable();
      } else {
        alert(this.getSingleResponse.message);
      }
    });
  }

  onUpdateSubmit() {
    const body = JSON.stringify(this.updateCourierForm.value);
    this.apiserviceService.SpinnerService.show();
    this.apiserviceService.updateData(AppUrls.COURIER_UPDATE_RECORD, body).subscribe(result => {
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
    const url = AppUrls.COURIER_DELETE_RECORD + id;
    this.apiserviceService.SpinnerService.show();
    this.deleteRecord = await this.apiserviceService.deleteById(url);
    this.apiserviceService.SpinnerService.hide();
    if (this.deleteRecord.status === 'SUCCESS') {
      // window.location.reload();
      this.rerenderDatatable();
    }
  }

  async findById(id) {
    const url = AppUrls.COURIER_FIND_BY_ID + id;
    this.apiserviceService.SpinnerService.show();
    this.getSingleResponse = await this.apiserviceService.findById(url);
    this.apiserviceService.SpinnerService.hide();
    this.singleRecord = this.getSingleResponse.responseBody;
  }

  async getAllServiceProviderRecords() {
    this.apiserviceService.SpinnerService.show();
    this.posts = await this.apiserviceService.fetchAllRecords(AppUrls.COURIER_GET_ALL_SERVICE_PROVIDER);
    this.apiserviceService.SpinnerService.hide();
    if (this.posts.status === 'SUCCESS') {
      this.serviceProviderList = this.posts.responseBody;
      this.isFirst = false;
    }
  }
  async getAllServicetypeRecords() {
    this.apiserviceService.SpinnerService.show();
    this.posts = await this.apiserviceService.fetchAllRecords(AppUrls.COURIER_GET_ALL_SERVICE_TYPE);
    this.apiserviceService.SpinnerService.hide();
    if (this.posts.status === 'SUCCESS') {
      this.serviceTypeList = this.posts.responseBody;
      this.isFirst = false;
    }
  }

  async onDownloadCourierReport() {
    const fileName = 'courierReport';
    const url = AppUrls.DOWNLOAD_COURIER_REPORT;
    this.apiserviceService.SpinnerService.show();
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], fileName + '.xlsx', {type: 'application/vnd.ms.excel'});
    saveAs(file);
  }

  async getCityStateCountryByPincode(isUpdate) {
    let pincode = null;
    if (isUpdate === true) {
      pincode = this.updateCourierForm.value.pincode;
    } else {
      pincode = this.courierForm.value.pincode;
    }
    if (pincode.length < 6) {
      return false;
    }
    this.apiserviceService.SpinnerService.show();
    this.allRecords = await this.apiserviceService.fetchAllRecords(AppUrls.GET_CITY_STATTE_COUNTRY_BY_PINCODE + pincode);
    this.apiserviceService.SpinnerService.hide();
    if (this.allRecords.status === 'SUCCESS') {
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
              this.couriers = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              /*this.isAdd = true;*/
              this.couriers = [];
            }

          });
      },
      columns: [
        {data: 'id'},
        {data: 'courierCode'},
        {data: 'courierName'},
        {data: 'mobile'},
        {data: 'serviceProviderId'},
        {data: 'serviceTypeId'},
        {data: 'active'},
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


