import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ApiserviceService} from '../../apiservice.service';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {AppUrls} from '../../common/Api_Url_Seeting';

@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.css']
})
export class UploadDocumentComponent implements OnInit {
  public response;
  public courierList;
  public clientList;
  public coloaderList;
  public posts;
  public data;

  public isClientActive = false;
  public isCourierActive = false;
  public isColoaderActive = false;
  public uploadDocTypeValue;

  public isGSTActive = false;
  public isAgreementActive = false;
  public isPanCardActive = false;
  public isAadharCardActive = false;


  public uploadPresentage = 0;
  public isUploadStart = false;
  public isUploadButtonDisabled = false;
  public token = '';
  subscription: Subscription;
  form: FormGroup;
  error: string;
  responseBody = {};

  constructor(private apiserviceService: ApiserviceService, private formBuilder: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.getAllCourierRecods();
    this.getAllClientRecods();
    this.getAllColoaderRecods();
    this.apiserviceService.urlAuthorization();
    this.form = this.formBuilder.group({
      gstFile: [''],
      agreementFile: [''],
      pancardFile: [''],
      aadharFile: [''],
      entityType: ['']
    });
  }

  onSubmit() {
    const entityType = this.form.get('entityType').value;
    if (entityType === undefined || entityType === null || entityType === '') {
      alert('Please select entityType.');
      return false;
    }
    let entityValue = null;
    if (entityType === 'CLIENT') {
      entityValue = (<HTMLInputElement>document.getElementById('clientCode')).value;
      if (entityValue === null || entityValue === undefined || entityValue === '') {
        alert('Please select client.');
        return false;
      }
    } else if (entityType === 'COLOADER') {
      entityValue = (<HTMLInputElement>document.getElementById('coloaderCode')).value;
      if (entityValue === null || entityValue === undefined || entityValue === '') {
        alert('Please select coloader.');
        return false;
      }
    } else if (entityType === 'COURIER') {
      entityValue = (<HTMLInputElement>document.getElementById('courierCode')).value;
      if (entityValue === null || entityValue === undefined || entityValue === '') {
        alert('Please select courier.');
        return false;
      }
    }

    const gstFile = this.form.get('gstFile').value;
    if (gstFile === undefined || gstFile === null) {
      alert('Please select GST file.');
      return false;
    }
    const agreementFile = this.form.get('agreementFile').value;
    if (agreementFile === undefined || agreementFile === null) {
      alert('Please select agreement file.');
      return false;
    }
    if (entityType === 'CLIENT') {
      const pancardFile = this.form.get('pancardFile').value;
      if (pancardFile === undefined || pancardFile === null) {
        alert('Please select pan-card file.');
        return false;
      }
      const aadharFile = this.form.get('aadharFile').value;
      if (aadharFile === undefined || aadharFile === null) {
        alert('Please select aadhar file.');
        return false;
      }
    }
    const formData = new FormData();
    formData.append('gst', this.form.get('gstFile').value);
    formData.append('agrement', this.form.get('agreementFile').value);
    formData.append('panCard', this.form.get('pancardFile').value);
    formData.append('aadharCard', this.form.get('aadharFile').value);
    formData.append('entityCode', entityValue);
    formData.append('entityType', this.form.get('entityType').value);

    this.upload(formData, AppUrls.UPLOAD_DOC).subscribe(
      (res) => res,
      (err) => this.error = err
    );
  }
  onFileChange(event, type) {
    let file = null;
    if (event.target.files.length > 0 && 'GST' === type) {
      file = event.target.files[0];
      this.form.get('gstFile').setValue(file);
    } else if (event.target.files.length > 0 && 'AGREEMENT' === type) {
      file = event.target.files[0];
      this.form.get('agreementFile').setValue(file);
    } else if (event.target.files.length > 0 && 'PANCARD' === type) {
      file = event.target.files[0];
      this.form.get('pancardFile').setValue(file);
    } else if (event.target.files.length > 0 && 'AADHAR' === type) {
      file = event.target.files[0];
      this.form.get('aadharFile').setValue(file);
    }
  }
  onChangeUploadTypeValue() {
    if (this.uploadDocTypeValue === 'CLIENT') {
      this.isClientActive = true;
      this.isCourierActive = false;
      this.isColoaderActive = false;

      this.isGSTActive = true;
      this.isAgreementActive = true;
      this.isPanCardActive = true;
      this.isAadharCardActive = true;

    } else if (this.uploadDocTypeValue === 'COURIER') {
      this.isCourierActive = true;
      this.isClientActive = false;
      this.isColoaderActive = false;

      this.isGSTActive = true;
      this.isAgreementActive = true;
      this.isPanCardActive = false;
      this.isAadharCardActive = false;

    } else if (this.uploadDocTypeValue === 'COLOADER') {
      this.isColoaderActive = true;
      this.isClientActive = false;
      this.isCourierActive = false;

      this.isGSTActive = true;
      this.isAgreementActive = true;
      this.isPanCardActive = false;
      this.isAadharCardActive = false;
    }
  }

  async getAllClientRecods() {
    this.apiserviceService.SpinnerService.show();
    this.posts = await this.apiserviceService.fetchAllRecords(AppUrls.GET_ACTIVE_CLIENTS);
    this.apiserviceService.SpinnerService.hide();
    if (this.posts.status === 'SUCCESS') {
      this.clientList = this.posts.responseBody;
    }
  }

  async getAllCourierRecods() {
    this.apiserviceService.SpinnerService.show();
    this.posts = await this.apiserviceService.fetchAllRecords(AppUrls.GET_ACTIVE_COURIERS);
    this.apiserviceService.SpinnerService.hide();
    if (this.posts.status === 'SUCCESS') {
      this.courierList = this.posts.responseBody;
    }
  }

  async getAllColoaderRecods() {
    this.apiserviceService.SpinnerService.show();
    this.posts = await this.apiserviceService.fetchAllRecords(AppUrls.GET_ACTIVE_COLOADERS);
    this.apiserviceService.SpinnerService.hide();
    if (this.posts.status === 'SUCCESS') {
      this.coloaderList = this.posts.responseBody;
    }
  }

  public upload(data, url) {
    this.isUploadButtonDisabled = true;
    this.isUploadStart = true;
    this.token = '';
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
              alert('Upload Doc successfully');
              /*this.form.get('gstFile').value) = '';*/
              /*this.form.get('agreementFile').value) = '';
              this.form.get('pancardFile').value) = '';
              this.form.get('aadharFile').value) = '';
              this.form.get('entityType').value) = '';*/
            } else {
              alert(event.body.message);
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
