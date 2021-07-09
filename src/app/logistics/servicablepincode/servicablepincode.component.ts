import {Component, OnInit} from '@angular/core';
import {ApiserviceService} from 'src/app/apiservice.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {saveAs} from 'file-saver';
import {map} from 'rxjs/operators';
import {AppUrls} from '../../common/Api_Url_Seeting';
import {interval, Subscription} from 'rxjs';

@Component({
  selector: 'app-servicablepincode',
  templateUrl: './servicablepincode.component.html',
  styleUrls: ['./servicablepincode.component.css']
})
export class ServicablepincodeComponent implements OnInit {

  disabled = false;
  showFilter = true;
  limitSelection = false;
  selectedItems: any = [];
  dropdownSettings: any = {};

  public response;
  public data;
  public courierList;

  public uploadPresentage = 0;
  public isUploadStart = false;
  public isUploadButtonDisabled = false;
  public token = '';
  subscription: Subscription;

  pincodeForm = new FormGroup({
    courierCodes: new FormControl(''),
    courierCode: new FormControl(''),
  });
  form: FormGroup;
  error: string;
  responseBody = {errorFileName: '', errorRecord: 0, fileName: '', filePath: '', successFileName: '', successRecord: 0, totalRecord: 0};

  constructor(private apiserviceService: ApiserviceService, private formBuilder: FormBuilder, private http: HttpClient) {
  }

  ngOnInit() {
    this.apiserviceService.urlAuthorization();

    this.getAllCourierRecords();
    this.form = this.formBuilder.group({
      file: [''],
      uploadId: new FormControl(''),
    });
    this.selectedItems = [];
    this.dropdownSettings = {
      singleSelection: false,
      textField: 'courierCode',
      selectedAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      //allowSelectFilter: this.showFilter
      allowSearchFilter: true
    };

  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.get('file').setValue(file);
    }
  }

  onSubmit() {
    const file = this.form.get('file').value;
    if( file == null || file == undefined || file == ''){
      alert("Please select file.");
      return false;
    }
    const formData = new FormData();
    formData.append('files', this.form.get('file').value);
    formData.append('uploadId', 'servicablePincodeBulk');
    this.upload(formData, '/api/uploadFile').subscribe(
      (res) => res,
      (err) => this.error = err
    );
  }

  async downloadTemplate() {
    this.apiserviceService.SpinnerService.show();
    const fileName = 'servicablePincodeBulk';
    const url = AppUrls.SERVICEABLE_PINCODE_DOWNLOAD_TEMPLATE + '?templateName=' + fileName;
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], 'servicablePincodeBulk.xlsx', {type: 'application/vnd.ms.excel'});
    saveAs(file);

  }

  async downloadSuccessFile() {
    this.apiserviceService.SpinnerService.show();
    const url = AppUrls.SERVICEABLE_PINCODE_DOWNLOAD_SUCCESS_FILE + '?fileName=' + this.responseBody.successFileName + '&filePath=' + this.responseBody.filePath;
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], this.responseBody.successFileName, {type: 'application/vnd.ms.excel'});
    saveAs(file);

  }

  async downloadErrorFile() {
    this.apiserviceService.SpinnerService.show();
    const url = AppUrls.SERVICEABLE_PINCODE_DOWNLOAD_FILE_ERROR_URL + '?fileName=' + this.responseBody.errorFileName + '&filePath=' + this.responseBody.filePath;
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], this.responseBody.errorFileName, {type: 'application/vnd.ms.excel'});
    saveAs(file);
  }

  async onDownloadCourierpincode() {
    const courierCodes = this.pincodeForm.get('courierCodes').value;
    let str = '';
    for (const item of courierCodes) {
      console.log(item.courierCode);
      str += item.courierCode + ',';
    }
    str = str.slice(0, -1);
    const fileName = 'servicablePincode';
    const url = '/api/getAllCourierServicablePincode?courierCode=' + str;
    this.apiserviceService.SpinnerService.show();
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], fileName + '.xlsx', {type: 'application/vnd.ms.excel'});
    saveAs(file);
  }


  async getAllCourierRecords() {
    this.apiserviceService.SpinnerService.show();
    const url = '/api/getAllCourier';
    this.response = await this.apiserviceService.fetchAllRecords(url);
    this.apiserviceService.SpinnerService.hide();
    if (this.response.status === 'SUCCESS') {
      this.courierList = this.response.responseBody;
      console.log(this.courierList);
    }
  }

  onItemSelect(item: any) {
    console.log(item);
  }

  onSelectAll(item: any) {
    console.log(item);
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
        const url = AppUrls.UPLOAD_PREOGRESS + '?key=servicablePincodeBulk&token=' + this.token;
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
                  this.isUploadButtonDisabled = false
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


}
