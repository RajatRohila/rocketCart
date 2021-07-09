import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiserviceService} from 'src/app/apiservice.service';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {saveAs} from 'file-saver';
import {map} from 'rxjs/operators';
import {AppUrls} from '../../common/Api_Url_Seeting';
import {interval, Subscription} from 'rxjs';

@Component({
  selector: 'app-awb-series',
  templateUrl: './awb-series.component.html',
  styleUrls: ['./awb-series.component.css']
})
export class AwbSeriesComponent implements OnInit {
  public uploadPresentage = 0;
  public isUploadStart = false;
  public isUploadButtonDisabled = false;
  public token = '';
  subscription: Subscription;

  public response;
  public data;
  public clients;
  public responsedata;
  public clientList;
  public courierList;
  public isClientType = false;
  public isCourierType = false;
  paymentTypeList = ['BOTH', 'COD', 'PREPAID'];
  awbForm = new FormGroup({
    paymentTypes: new FormControl(''),
    client: new FormControl(''),
    totalSeriesCount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
  });
  form: FormGroup;
  error: string;
  responseBody = {errorFileName: '', errorRecord: 0, fileName: '', filePath: '', successFileName: '', successRecord: 0, totalRecord: 0};
  constructor(private apiserviceService: ApiserviceService, private formBuilder: FormBuilder, private http: HttpClient) {
  }

  ngOnInit() {
    this.apiserviceService.urlAuthorization();
    this.form = this.formBuilder.group({
      file: [''],
      uploadId: ['']
    });
    this.getClientRecords();
    this.getAllCourierRecods();
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
    console.log(this.form.get('file').value);
    console.log(this.form.get('uploadId').value);
    formData.append('files', this.form.get('file').value);
    formData.append('uploadId', 'awbSeriesBulk');
    this.upload(formData, 'api/uploadFile').subscribe(
      (res) => res,
      (err) => this.error = err
    );
  }

  async downloadTemplate() {
    this.apiserviceService.SpinnerService.show();
    const fileName = 'awbSeriesBulk';
    const url = AppUrls.AWB_SERIES_DOWNLOAD_TEMPLATE + '?templateName=' + fileName;
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], 'awbSeriesBulk.xlsx', {type: 'application/vnd.ms.excel'});
    saveAs(file);
  }

  async generateClientAwbSeries() {
    this.apiserviceService.SpinnerService.show();
    const clientCode = this.awbForm.get('client').value;
    const paymentTypes = this.awbForm.get('paymentTypes').value;
    const totalSeriesCount = this.awbForm.get('totalSeriesCount').value;
    const fileName = clientCode + '_AwbSerier';
    // tslint:disable-next-line:max-line-length
    const url = '/api/autoGenerateBulkSeries?clientCode=' + clientCode + '&paymentType=' + paymentTypes + '&totalSeriesCount=' + totalSeriesCount;
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], fileName + '.xlsx', {type: 'application/vnd.ms.excel'});
    saveAs(file);
  }

  async downloadSuccessFile() {
    this.apiserviceService.SpinnerService.show();
    // tslint:disable-next-line:max-line-length
    const url = AppUrls.AWB_SERIES_DOWNLOAD_SUCCESS_FILE + '?fileName=' + this.responseBody.successFileName + '&filePath=' + this.responseBody.filePath;
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    console.log(this.data);
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], this.responseBody.successFileName, {type: 'application/vnd.ms.excel'});
    saveAs(file);

  }

  async downloadErrorFile() {
    this.apiserviceService.SpinnerService.show();
    // tslint:disable-next-line:max-line-length
    const url = AppUrls.AWB_SERIES_DOWNLOAD_FILE_ERROR_URL + '?fileName=' + this.responseBody.errorFileName + '&filePath=' + this.responseBody.filePath;
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    console.log(this.data);
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], this.responseBody.errorFileName, {type: 'application/vnd.ms.excel'});
    saveAs(file);
  }

  async onDownloadPendingAwbSeries() {
    const seriesType = (<HTMLInputElement>document.getElementById('seriesType')).value;
    if (seriesType === null || seriesType === '') {
      alert('Please select series type');
    }
    let typeValue = '';
    if (seriesType === 'CLIENT') {
       typeValue = (<HTMLInputElement>document.getElementById('client')).value;
    } else if (seriesType === 'COURIER') {
      typeValue = (<HTMLInputElement>document.getElementById('courier')).value;
    }
    const fileName = 'pendingAwbSeries';
    const url = AppUrls.DOWNLOAD_PENDING_AWB_SERIE + '?seriesType=' + seriesType + '&typeValue=' + typeValue;
    this.apiserviceService.SpinnerService.show();
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], fileName + '.xlsx', {type: 'application/vnd.ms.excel'});
    saveAs(file);
  }

  async getAllCourierRecods() {
    this.apiserviceService.SpinnerService.show();
    this.responsedata = await this.apiserviceService.fetchAllRecords(AppUrls.GET_ACTIVE_COURIERS);
    if (this.responsedata.status === 'SUCCESS') {
      this.apiserviceService.SpinnerService.hide();
      this.courierList = this.responsedata.responseBody;
    } else {
      this.apiserviceService.SpinnerService.hide();
    }
  }

  async getClientRecords() {
    this.apiserviceService.SpinnerService.show();
    this.clients = await this.apiserviceService.fetchAllRecords(AppUrls.ALL_CLIENT);
    if (this.clients.status === 'SUCCESS') {
      this.apiserviceService.SpinnerService.hide();
      this.clientList = this.clients.responseBody;
    } else {
      this.apiserviceService.SpinnerService.hide();
    }
  }

  onChangeSeriesType() {
    const seriedType = (<HTMLInputElement>document.getElementById('seriesType')).value;
    if (seriedType === 'CLIENT') {
      this.isClientType = true;
      this.isCourierType = false;
    }
    if (seriedType === 'COURIER') {
      this.isCourierType = true;
      this.isClientType = false;
    }
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
        const url = AppUrls.UPLOAD_PREOGRESS + '?key=awbSeriesBulk&token=' + this.token;
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

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
