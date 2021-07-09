import {Component, OnInit, ViewChild} from '@angular/core';
import {BulkHeader} from '../bulkheader/bulk-header.model';
import {ApiserviceService} from '../../apiservice.service';
import {AppUrls} from '../../common/Api_Url_Seeting';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {interval, Subscription} from 'rxjs';
import {saveAs} from 'file-saver';
import {map} from 'rxjs/operators';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {
  public response;
  public data;
  public uploadPresentage = 0;
  public isUploadStart = false;
  public isUploadButtonDisabled = false;
  public token = '';
  subscription: Subscription;

  public isDisplay = true;
  public isFirst = false;
  public isAdd = false;
  public isUpdate = false;
  public errorList;

  public posts;
  public allRecords;
  public deleteRecord;
  public singleRecord = new BulkHeader();
  public getSingleResponse;
  public statusList;
  public fieldsList = [];
  form: FormGroup;

  updateCourierForm: FormGroup;
  error: string;
  responseBody = {errorFileName: '', errorRecord: 0, fileName: '', filePath: '', successFileName: '', successRecord: 0, totalRecord: 0};

  constructor(private apiserviceService: ApiserviceService, private formBuilder: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.apiserviceService.urlAuthorization();
    this.getAllStatusRecords();
    this.getDeclaredClassFields();
    this.form = this.formBuilder.group({
      file: [''],
      uploadId: ['']
    });
    this.updateCourierForm = this.formBuilder.group({
      file: [''],
      uploadId: ['']
    });
  }
  async onUpdateStatus() {
   const awbs = (<HTMLInputElement>document.getElementById('awbs')).value;
    const  status = (<HTMLInputElement>document.getElementById('status')).value;
    let url = AppUrls.UPDATE_PACKET_STATUS + awbs + '/' + status;
    this.apiserviceService.SpinnerService.show();
    this.getSingleResponse = await this.apiserviceService.findById(url);
    this.apiserviceService.SpinnerService.hide();
      if (this.getSingleResponse.status === 'SUCCESS') {
        alert('Status update successfully');
        (<HTMLInputElement>document.getElementById('awbs')).value = '';
        (<HTMLInputElement>document.getElementById('status')).value = '';
      } else {
        alert(this.getSingleResponse.message);
      }
  }
  async getAllStatusRecords() {
    this.apiserviceService.SpinnerService.show();
    this.posts = await this.apiserviceService.fetchAllRecords(AppUrls.GET_ALL_STATUS);
    this.apiserviceService.SpinnerService.hide();
    if (this.posts.status === 'SUCCESS') {
      this.statusList = this.posts.responseBody;
    }
  }

  async getDeclaredClassFields() {
    this.apiserviceService.SpinnerService.show();
    this.posts = await this.apiserviceService.fetchAllRecords(AppUrls.GET_DECLARED_CLASS_FIELDS);
    this.apiserviceService.SpinnerService.hide();
    if (this.posts.status === 'SUCCESS') {
      for (const key in this.posts.responseBody) {
        if (key === 'id' || key === 'ID' || key === 'msg' || key === 'found') {
          continue;
        }
        this.fieldsList.push(key);
      }
    }
  }

  onUpdateSaleOrdeDetails() {
    const fieldsValue = (<HTMLInputElement>document.getElementById('field')).value;
    const value = (<HTMLInputElement>document.getElementById('updatableValue')).value;
    const awbNumbers = (<HTMLInputElement>document.getElementById('awbNumbers')).value;
    if (fieldsValue == null || fieldsValue === '' || fieldsValue === undefined) {
      alert('Please select field type');
      return false;
    }
    if (value == null || value === '' || value === undefined) {
      alert('Update value is empty');
      return  false;
    }
    if (awbNumbers == null || awbNumbers === '' || awbNumbers === undefined) {
      alert('Enter comma separated AWB numbers');
      return false;
    }
    const body = {};
    body['FIELD'] = fieldsValue;
    body['UPDATE_VALUE'] = value;
    body['AWB'] = awbNumbers;
    this.errorList = [];
    this.apiserviceService.SpinnerService.show();
    this.apiserviceService.saveData(AppUrls.UPDATE_DECLARED_CLASS_FIELDS, body).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
        const responseBodyValue = this.getSingleResponse.responseBody;
        if (responseBodyValue.length === 0) {
          this.errorList = [];
          alert('Order detail updated');
        } else {
          this.errorList = 'Error AWB -->' + this.getSingleResponse.responseBody;
        }
      } else {
        alert(this.getSingleResponse.message);
      }
    });
  }
  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.get('file').setValue(file);
    }
  }
  onChangeUpdateCouerFile(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.updateCourierForm.get('file').setValue(file);
    }
  }
  async getProgress() {
    this.apiserviceService.SpinnerService.show();
    const url = AppUrls.UPLOAD_PREOGRESS + '?key=saleOrderBuklUpload&token=' + this.token;
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

  public clearResponse() {
    this.responseBody.errorFileName = '';
    this.responseBody.successFileName = '';
    this.responseBody.errorRecord = 0;
    this.responseBody.successRecord = 0;
    this.responseBody.totalRecord = 0;
  }

  cancelButtonAction() {
    this.isDisplay = true;
    this.isAdd = false;
    this.isFirst = false;
    this.isUpdate = false;
  }

  onSubmit() {
    const file = this.form.get('file').value;
    if ( file == null || file === undefined || file === '') {
      alert('Please select file.');
      return false;
    }
    const formData = new FormData();
    console.log(this.form.get('file').value);
    console.log(this.form.get('uploadId').value);
    formData.append('files', this.form.get('file').value);
    formData.append('uploadId', 'updateSaleOrderDetails');
    this.upload(formData, '/api/uploadFile').subscribe(
      (res) => res,
      (err) => this.error = err
    );
  }

  async onUploade() {
    const file = this.form.get('file').value;
    if( file == null || file == undefined || file == ''){
      alert("Please select file.");
      return false;
    }
    const formData = new FormData();
    console.log(this.updateCourierForm.get('file').value);
    console.log(this.updateCourierForm.get('uploadId').value);
    formData.append('files', this.form.get('file').value);
    formData.append('uploadId', 'updateCourierDetails');
    this.upload(formData, '/api/uploadFile').subscribe(
      (res) => res,
      (err) => this.error = err
    );
  }

  startInterval() {
    this.subscription = interval(1000).subscribe(x => {
      this.getProgress();
    });
  }
  async orderCancellation() {
    this.apiserviceService.SpinnerService.show();
    const awbNo = (<HTMLInputElement>document.getElementById('awb')).value;
    const url = AppUrls.ORDER_CANCILATTION + awbNo;
    this.getSingleResponse = await this.apiserviceService.findById (url);
    this.apiserviceService.SpinnerService.hide();
    if (this.getSingleResponse.status === 'SUCCESS') {
      if (this.getSingleResponse.responseBody != null) {
        this.exportAsExcelFile(this.getSingleResponse.responseBody);
      }else{
        alert('Order cancel successfully.');
      }
    } else {
      alert(this.getSingleResponse.message);
    }
  }

  public exportAsExcelFile(json: any[]): void {
      const workBook = XLSX.utils.book_new();
      const workSheet = XLSX.utils.json_to_sheet(json);

      XLSX.utils.book_append_sheet(workBook, workSheet, '');
      XLSX.writeFile(workBook, 'order-cancel-error.xlsx');
  }

  async downloadTemplate() {
    this.apiserviceService.SpinnerService.show();
    const fileName = 'updateSaleOrderDetails';
    const url = AppUrls.SALE_ORDER_DOWNLOAD_TEMPLATE + '?templateName=' + fileName;
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], fileName + '.xlsx', {type: 'application/vnd.ms.excel'});
    saveAs(file);

  }

  async downloadCourierTemplate() {
    this.apiserviceService.SpinnerService.show();
    const fileName = 'updateCourierDetails';
    const url = AppUrls.SALE_ORDER_DOWNLOAD_TEMPLATE + '?templateName=' + fileName;
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], fileName + '.xlsx', {type: 'application/vnd.ms.excel'});
    saveAs(file);

  }

  async downloadSuccessFile() {
    // tslint:disable-next-line:max-line-length
    const url = AppUrls.SALE_ORDER_DOWNLOAD_SUCCESS_FILE + '?fileName=' + this.responseBody.successFileName + '&filePath=' + this.responseBody.filePath;
    this.apiserviceService.SpinnerService.show();
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], this.responseBody.successFileName, {type: 'application/vnd.ms.excel'});
    saveAs(file);
  }

  async downloadErrorFile() {
    this.apiserviceService.SpinnerService.show();
    // tslint:disable-next-line:max-line-length
    const url = AppUrls.SALE_ORDER_DOWNLOAD_FILE_ERROR_URL + '?fileName=' + this.responseBody.errorFileName + '&filePath=' + this.responseBody.filePath;
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], this.responseBody.errorFileName, {type: 'application/vnd.ms.excel'});
    saveAs(file);
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
