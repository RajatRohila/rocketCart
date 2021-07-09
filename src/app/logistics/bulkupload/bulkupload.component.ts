import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import {ApiserviceService} from 'src/app/apiservice.service';
import {saveAs} from 'file-saver';
import {map} from 'rxjs/operators';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {AppUrls} from '../../common/Api_Url_Seeting';
import {interval, Subscription} from 'rxjs';

@Component({
  selector: 'app-bulkupload',
  templateUrl: './bulkupload.component.html',
  styleUrls: ['./bulkupload.component.css']
})
export class BulkuploadComponent implements OnInit {

  public response;
  public bulkUploadType;
  public data;

  public uploadPresentage = 0;
  public isUploadStart = false;
  public isUploadButtonDisabled = false;
  public token = '';
  subscription: Subscription

  form: FormGroup;
  error: string;
  responseBody = {errorFileName: '', errorRecord: 0, fileName: '', filePath: '', successFileName: '', successRecord: 0, totalRecord: 0};
  constructor(private apiserviceService: ApiserviceService, private formBuilder: FormBuilder, private http: HttpClient) {
  }

  ngOnInit() {
    this.apiserviceService.urlAuthorization();
    this.getAllBulkMaster();
    this.form = this.formBuilder.group({
      file: [''],
      uploadId: ['']
    });
    /*this.subscription = interval(1000).subscribe(x => {
      console.log('hii');
      this.getProgress();
      if (!this.isSubscriptionStart) {
        this.subscription.unsubscribe();
      }
    });*/
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
    const uploadID = this.form.get('uploadId').value;
    if(uploadID == undefined || uploadID == null || uploadID == ''){
      alert("Please select upload type.");
      return false;
    }
    const formData = new FormData();
    console.log(this.form.get('file').value);
    console.log(this.form.get('uploadId').value);
    formData.append('files', this.form.get('file').value);
    formData.append('uploadId', this.form.get('uploadId').value);
    this.upload(formData, 'api/uploadFile').subscribe(
      (res) => res,
      (err) => this.error = err
    );
  }

  async downloadTemplate() {
    this.apiserviceService.SpinnerService.show();
    const fileName = this.form.get('uploadId').value;
    const url = AppUrls.BULK_UPLOAD_DOWNLOAD_TEMPLATE + '?templateName=' + fileName;
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], fileName + '.xlsx', {type: 'application/vnd.ms.excel'});
    saveAs(file);

  }

  async downloadSuccessFile() {
    this.apiserviceService.SpinnerService.show();
    // tslint:disable-next-line:max-line-length
    const url = AppUrls.BULK_UPLOAD_DOWNLOAD_SUCCESS_FILE + '?fileName=' + this.responseBody.successFileName + '&filePath=' + this.responseBody.filePath;
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], this.responseBody.successFileName, {type: 'application/vnd.ms.excel'});
    saveAs(file);

  }

  async downloadErrorFile() {
    this.apiserviceService.SpinnerService.show();
    // tslint:disable-next-line:max-line-length
    const url = AppUrls.DOWNLOAD_FILE_ERROR_URL + '?fileName=' + this.responseBody.errorFileName + '&filePath=' + this.responseBody.filePath;
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], this.responseBody.errorFileName, {type: 'application/vnd.ms.excel'});
    saveAs(file);
  }

  async getAllBulkMaster() {
    this.apiserviceService.SpinnerService.show();
    this.response = await this.apiserviceService.fetchAllRecords(AppUrls.ALL_BULK_MASTER);
    this.apiserviceService.SpinnerService.hide();
    if (this.response.status === 'SUCCESS') {
      this.bulkUploadType = this.response.responseBody;
      console.log(this.bulkUploadType);
    }
  }

  startInterval() {
    this.subscription = interval(1000).subscribe(x => {
      this.getProgress();
    });
  }

  async getProgress() {
      const uploadId = this.form.get('uploadId').value;
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

  public clearResponse() {
    this.responseBody.errorFileName = '';
    this.responseBody.successFileName = '';
    this.responseBody.errorRecord = 0;
    this.responseBody.successRecord = 0;
    this.responseBody.totalRecord = 0;
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
            console.log('File Upload progress count --> ' + progress);
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
