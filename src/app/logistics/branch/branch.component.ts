import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiserviceService} from 'src/app/apiservice.service';
import {AppUrls} from '../../common/Api_Url_Seeting';
import {DataTableDirective} from 'angular-datatables';
import {interval, Subject, Subscription} from 'rxjs';
import {Branch} from './branch';
import {saveAs} from 'file-saver';
import {map} from 'rxjs/operators';
import {HttpClient, HttpEventType} from '@angular/common/http';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css']
})
export class BranchComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  title = 'datatables';
  public isDisplay = true;
  public isFirst = false;
  public isAdd = false;
  public isUpdate = false;
  public isDestinationBaggingAllow = false;
  public isManulManifestAllow = false;
  public posts;
  public allRecords;
  public deleteRecord;
  public singleRecord = new Branch();
  public branchs: Branch[];
  public getSingleResponse;
  public branchList;
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
  branchForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    branchCode: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    pincode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(6), Validators.maxLength(6)]),
    mobileNo: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]),
    emailId: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    parentBranchId: new FormControl(''),
    destinationBaggingAllow: new FormControl(''),
    manulManifestAllow: new FormControl(''),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    latLong: new FormControl(''),
  });
  updateBranchForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    branchCode: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    pincode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(6), Validators.maxLength(6)]),
    mobileNo: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]),
    emailId: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    parentBranchId: new FormControl(''),
    destinationBaggingAllow: new FormControl(''),
    manulManifestAllow: new FormControl(''),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    latLong: new FormControl(''),
    active: new FormControl('')
  });

  constructor(private apiserviceService: ApiserviceService, private formBuilder: FormBuilder, private http: HttpClient) {

  }

  ngOnInit(): void {
    this.apiserviceService.urlAuthorization();

    this.dtOptions = this.buildDtOptionpkg(AppUrls.BRANCH_SORT_AND_PAGING);
    this.getBranchRecords();
    console.log(this.dtOptions);
    this.isFirst = true;
    this.form = this.formBuilder.group({
      file: [''],
      uploadId: [''],
      isUpdate: false
    });
  }

  addNew() {
    this.setCheckBoxDefaltValue();
    this.isUpdateBulkupload = false;
    this.isUpload = false;
    this.isDisplay = false;
    this.isAdd = true;
    this.isFirst = false;
    this.isUpdate = false;

  }

  cancelButtonAction() {
    this.setCheckBoxDefaltValue();
    this.isUpdateBulkupload = false;
    this.isUpload = false;
    this.isDisplay = true;
    this.isAdd = false;
    this.isFirst = false;
    this.isUpdate = false;
  }
  async updateRecords(id) {
    this.setCheckBoxDefaltValue();
    await this.findById(id);
    this.isUpdateBulkupload = false;
    this.isUpload = false;
    this.isUpdate = true;
    this.isDisplay = false;
    this.isAdd = false;
    this.updateBranchForm.get('parentBranchId').patchValue(this.singleRecord.parentBranchId);
    this.pincodeDetails.city = this.singleRecord.city;
    this.pincodeDetails.state = this.singleRecord.state;
    this.pincodeDetails.country = this.singleRecord.country;


  }
  excalUpload() {
    this.isUpdateBulkupload = false;
    this.isDisplay = false;
    this.isAdd = false;
    this.isFirst = false;
    this.isUpload = true;
  }
  setCheckBoxDefaltValue() {
    this.isManulManifestAllow = false;
    this.isDestinationBaggingAllow = false;
  }
  isCheck(elementName) {
    if (elementName === 'DestinationBaggingAllow') {
      if (this.isDestinationBaggingAllow) {
        this.isDestinationBaggingAllow = false;
      } else {
        this.isDestinationBaggingAllow = true;
      }
      console.log(this.isDestinationBaggingAllow);
    } else if (elementName === 'ManulManifestAllow') {
      if (this.isManulManifestAllow) {
        this.isManulManifestAllow = false;
      } else {
        this.isManulManifestAllow = true;
      }
      console.log(this.isManulManifestAllow);
    } else if (elementName === 'UPDATE') {
      if (this.isUpdateBulkupload) {
        this.isUpdateBulkupload = false;
      } else {
        this.isUpdateBulkupload = true;
      }
      console.log(this.isUpdateBulkupload);
    }
  }


  async deleteRecords(id) {
    this.isUpdate = false;
    await this.deleteById(id);
    this.dtOptions = this.buildDtOptionpkg(AppUrls.BRANCH_DELETE_RECORD);
    console.log(id);
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
      formData.append('uploadId', 'branchBuklUpload');
      formData.append('isUpdate', this.isUpdateBulkupload + '');
      this.upload(formData, 'api/uploadFile').subscribe(
        (res) => res,
        (err) => this.error = err
      );
    }
  }

  async downloadTemplate() {
    const fileName = 'branchBuklUpload';
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
    this.branchForm.value.destinationBaggingAllow = this.isDestinationBaggingAllow;
    this.branchForm.value.manulManifestAllow = this.isManulManifestAllow;
    const body = JSON.stringify(this.branchForm.value);
    this.apiserviceService.SpinnerService.show();
    this.apiserviceService.saveData(AppUrls.BRANCH_SAVE_RECORD, body).subscribe(result => {
      console.log(result);
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
        this.apiserviceService.SpinnerService.hide();
        this.branchForm.reset();
        this.cancelButtonAction();
        this.rerenderDatatable();
      } else {
        this.apiserviceService.SpinnerService.hide();
        alert(this.getSingleResponse.message);
      }
    });
  }

  onUpdateSubmit() {
      this.branchForm.value.destinationBaggingAllow = this.isDestinationBaggingAllow;
      this.branchForm.value.manulManifestAllow = this.isManulManifestAllow;
      const body = JSON.stringify(this.updateBranchForm.value);
      this.apiserviceService.SpinnerService.show();
      this.apiserviceService.updateData(AppUrls.BRANCH_UPDATE_RECORD, body).subscribe(result => {
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
    const url = AppUrls.BRANCH_DELETE_RECORD + id;
    this.apiserviceService.SpinnerService.show();
    this.deleteRecord = await this.apiserviceService.deleteById(url);
    this.apiserviceService.SpinnerService.hide();
    if (this.deleteRecord.status === 'SUCCESS') {
      alert('Record deleted successfully');
      this.rerenderDatatable();
    }
  }

  async findById(id) {
    const url = AppUrls.BRANCH_FIND_BY_ID + id;
    this.apiserviceService.SpinnerService.show();
    this.getSingleResponse = await this.apiserviceService.findById(url);
    this.apiserviceService.SpinnerService.hide();
    this.singleRecord = this.getSingleResponse.responseBody;
    console.log(this.singleRecord);
  }

  async getBranchRecords() {
    this.apiserviceService.SpinnerService.show();
    this.posts = await this.apiserviceService.fetchAllRecords('/api/getAllBranch');
    this.apiserviceService.SpinnerService.hide();
    if (this.posts.status === 'SUCCESS') {
      this.branchList = this.posts.responseBody;
    }
  }

  async onDownloadBranchReport() {
    const fileName = 'branchReport';
    const url = AppUrls.DOWNLOAD_BRANCH_REPORT;
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
      pincode = this.updateBranchForm.value.pincode;
    } else {
      pincode = this.branchForm.value.pincode;
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
              this.branchs = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              /*this.isAdd = true;*/
              this.branchs = [];
            }
          });
      },
      columns: [
        {data: 'id'},
        {data: 'name'},
        {data: 'branchCode'},
        {data: 'mobileNo'},
        {data: 'emailId'},
        {data: 'parentBranchId'},
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


