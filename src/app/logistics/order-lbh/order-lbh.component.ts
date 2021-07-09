import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiserviceService} from 'src/app/apiservice.service';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {saveAs} from 'file-saver';
import {map} from 'rxjs/operators';
import {AppUrls} from '../../common/Api_Url_Seeting';
import {interval, Subscription} from 'rxjs';

@Component({
  selector: 'app-order-lbh',
  templateUrl: './order-lbh.component.html',
  styleUrls: ['./order-lbh.component.css']
})
export class OrderLBHComponent implements OnInit {
  public response;
  public bulkUploadType;
  public data;
  public getSingleResponse;

  public uploadPresentage = 0;
  public isUploadStart = false;
  public isUploadButtonDisabled = false;
  public token = '';
  subscription: Subscription;

  form: FormGroup;
  error: string;
  responseBody = {errorFileName: '', errorRecord: 0, fileName: '', filePath: '', successFileName: '', successRecord: 0, totalRecord: 0};
  weighttype = ['SELF', 'COURIER'];
  LBHUploadForm = new FormGroup({
    awbNumber: new FormControl('', [Validators.required]),
    clientWeight: new FormControl('', [Validators.required]),
    clientLength: new FormControl('', [Validators.required]),
    clientWidth: new FormControl('', [Validators.required]),
    clientHeight: new FormControl('', [Validators.required])
  });

  constructor(private apiserviceService: ApiserviceService, private formBuilder: FormBuilder, private http: HttpClient) {
  }

  ngOnInit() {
    this.apiserviceService.urlAuthorization();
    this.form = this.formBuilder.group({
      file: [''],
      uploadId: [''],
      bulkType: [''],
    });
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
    const uploadType = this.form.get('bulkType').value;
    if(uploadType == undefined || uploadType == null || uploadType == ''){
      alert("Please select upload type.");
      return false;
    }
    const formData = new FormData();
    console.log(this.form.get('file').value);
    formData.append('files', this.form.get('file').value);
    if (this.form.get('bulkType').value === 'SELF' ) {
      formData.append('uploadId', 'selfLbhBulk');
    } else if (this.form.get('bulkType').value === 'COURIER') {
      formData.append('uploadId', 'courierLBHBulkUpload');
    }
    this.upload(formData, '/api/uploadFile').subscribe(
      (res) => res,
      (err) => this.error = err
    );
  }

  async downloadTemplate() {
    let fileName = '';
    if (this.form.get('bulkType').value === 'SELF' ) {
      fileName = 'selfLbhBulk';
    } else if (this.form.get('bulkType').value === 'COURIER') {
      fileName = 'courierLBHBulkUpload';
    }
    this.apiserviceService.SpinnerService.show();
    const url = AppUrls.ORDER_LBH_DOWNLOAD_TEMPLATE + '?templateName=' + fileName;
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob],  'selfLbhBulk.xlsx', {type: 'application/vnd.ms.excel'});
    saveAs(file);

  }

  async downloadSuccessFile() {
    const url = AppUrls.ORDER_LBH_DOWNLOAD_SUCCESS_FILE + '?fileName=' + this.responseBody.successFileName + '&filePath=' + this.responseBody.filePath;
    this.apiserviceService.SpinnerService.show();
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], this.responseBody.successFileName, {type: 'application/vnd.ms.excel'});
    saveAs(file);

  }

  async downloadErrorFile() {
    this.apiserviceService.SpinnerService.show();
    let url = AppUrls.ORDER_LBH_FILE_ERROR_URL + '?fileName=' + this.responseBody.errorFileName + '&filePath=' + this.responseBody.filePath;
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    console.log(this.data);
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
        let uploadId = undefined;
        if (this.form.get('bulkType').value === 'SELF' ) {
          uploadId = 'selfLbhBulk';
        } else if (this.form.get('bulkType').value === 'COURIER') {
          uploadId = 'courierLBHBulkUpload';
        }
        if(uploadId === undefined){
          return false;
        }
        this.apiserviceService.SpinnerService.show();
        const url = AppUrls.UPLOAD_PREOGRESS + '?key=' +uploadId+ '&token=' + this.token;
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


  onSubmitLbh() {
    const body = JSON.stringify(this.LBHUploadForm.value);
    this.apiserviceService.SpinnerService.show();
    this.apiserviceService.saveData('/api/addLBH', body).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
        this.LBHUploadForm.reset();
      } else {
        alert(this.getSingleResponse.message);
      }
    });
  }
}
