import {Component, OnInit, ViewChild} from '@angular/core';
import {interval, Subject, Subscription} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiserviceService} from '../../apiservice.service';
import {AppUrls} from '../../common/Api_Url_Seeting';
import {DataTableDirective} from 'angular-datatables';
import { ClientRemittance } from './clientRemittance.model';
import {saveAs} from 'file-saver';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {NgbCalendar, NgbDateStruct, NgbDatepicker} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-client-remittance',
  templateUrl: './client-remittance.component.html',
  styleUrls: ['./client-remittance.component.css']
})

export class ClientRemittanceComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  title = 'datatables';
  clientRemittance: ClientRemittance[];

  model: NgbDateStruct;
  today = this.calendar.getToday();

  public isDisplay = true;
  public isAdd = false;
  public isUpdate = false;
  public posts;
  public singleRecord = new ClientRemittance();
  public getSingleResponse;
  public clientList;
  public data;
  public deleteRecord;
  public response;

  public uploadPresentage = 0;
  public isUploadStart = false;
  public isUploadButtonDisabled = false;
  public token = '';
  subscription: Subscription;

  clientRemittanceForm: FormGroup;
  closeRemittanceForm: FormGroup;
  error: string;
  responseBody = {errorFileName: '', errorRecord: 0, fileName: '', filePath: '', successFileName: '', successRecord: 0, totalRecord: 0};
  constructor(private apiserviceService: ApiserviceService, private formBuilder: FormBuilder, private http: HttpClient,
              private calendar: NgbCalendar) {
  }

  ngOnInit(): void {
    this.apiserviceService.urlAuthorization();
    this.dtOptions = this.buildDtOptionpkg(AppUrls.CLIENT_REMITTANCE_GENERATED_RECODS);
    /*this.closedClientRemittanceDb = this.buildClosedClientRemittance(AppUrls.CLIENT_REMITTANCE_CLOSED_RECODS);*/
    this.clientRemittanceForm = this.formBuilder.group({
      file: [''],
      uploadId: [''],
      extra: [],
      clientCode: new FormControl('', [Validators.required]),
    });
    this.closeRemittanceForm = this.formBuilder.group({
      file: [''],
      accountNo: [''],
      bankName: [],
      remittanceNo: [],
      transactionNo: [],
      depositeDate: [],
      depositedAmt: [],
    });
  }

  addNew() {
    this.isDisplay = false;
    this.isAdd = true;
    this.isUpdate = false;
    this.getAllClientRecords();
  }

  async updateRecords(id) {
    await this.findById(id);
    this.isUpdate = true;
    this.isDisplay = false;
    this.isAdd = false;
  }


  onGenerateRemittance() {
    const file = this.clientRemittanceForm.get('file').value;
    if( file == null || file == undefined || file == ''){
      alert("Please select file.");
      return false;
    }
    const clientCoded = this.clientRemittanceForm.get('clientCode').value;
    if(clientCoded == undefined || clientCoded == null || clientCoded == ''){
      alert("Please select client.");
      return false;
    }
    const formData = new FormData();
    formData.append('files', this.clientRemittanceForm.get('file').value);
    formData.append('uploadId', 'generateRemittance');
    formData.append('extra', this.clientRemittanceForm.get('clientCode').value);
    this.upload(formData, '/api/uploadFile').subscribe(
      (res) => res,
      (err) => this.error = err
    );
  }

  async onDownload() {
    const clientCodes = this.clientRemittanceForm.get('clientCode').value;
    if(clientCodes == undefined || clientCodes == null || clientCodes == ''){
      alert("Please select client.");
      return false;
    }
    const fileName = 'clientRemittance';
    const url = '/api/getAllClientAwbNumber?clientCode=' + clientCodes;
    this.apiserviceService.SpinnerService.show();
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], fileName + '.xlsx', {type: 'application/vnd.ms.excel'});
    saveAs(file);
  }
  onUpdateSubmit() {
    const formData = new FormData();
    formData.append('file', this.closeRemittanceForm.get('file').value);
    formData.append('bankName', (<HTMLInputElement>document.getElementById('bankName')).value);
    formData.append('accountNo', (<HTMLInputElement>document.getElementById('accountNo')).value);
    formData.append('transactionNo', (<HTMLInputElement>document.getElementById('transactionNo')).value);
    formData.append('depositeDate', (<HTMLInputElement>document.getElementById('depositeDate')).value);
    formData.append('remittanceNo', (<HTMLInputElement>document.getElementById('remittanceNo')).value);
    formData.append('depositedAmt', (<HTMLInputElement>document.getElementById('depositedAmt')).value);
    formData.forEach((value, key) => {console.log('Key:' + key + '   value:' + value); });
    this.upload(formData, 'api/closedClientRemittance').subscribe(
      (res) => res,
      (err) => this.error = err
    );
  }

  async downloadErrorFile() {
    this.apiserviceService.SpinnerService.show();
    const url = AppUrls.SALE_ORDER_DOWNLOAD_FILE_ERROR_URL + '?fileName=' + this.responseBody.errorFileName + '&filePath=' + this.responseBody.filePath;
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], this.responseBody.errorFileName, {type: 'application/vnd.ms.excel'});
    saveAs(file);
  }

  async downloadClientRemittanceReport(remittanceNo) {
    const fileName = 'clientRemittanceReport';
    const url = AppUrls.CLIENT_REMITTANCE_REPORT + '?remittanceNo=' + remittanceNo;
    this.apiserviceService.SpinnerService.show();
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], fileName + '.xlsx', {type: 'application/vnd.ms.excel'});
    saveAs(file);
  }
  async deleteRecordById(id) {
    const url = AppUrls.DELETE_CLIENT_REMITTANCE + id;
    this.apiserviceService.SpinnerService.show();
    this.deleteRecord = await this.apiserviceService.getCall(url);
    this.apiserviceService.SpinnerService.hide();
    if (this.deleteRecord.status === 'SUCCESS') {
      alert('Record deleted successfully');
      this.rerenderDatatable();
      /*this.dtOptions = this.buildDtOptionpkg(AppUrls.CLIENT_REMITTANCE_GENERATED_RECODS);
      this.isDisplay = true;*/
    }
  }

  cancelButtonAction() {
    this.isDisplay = true;
    this.isAdd = false;
    this.isUpdate = false;
  }

  async findById(id) {
    const url = AppUrls.CLIENT_REMITTANCE_FIND_BY_ID + id;
    this.apiserviceService.SpinnerService.show();
    this.getSingleResponse = await this.apiserviceService.findById(url);
    this.apiserviceService.SpinnerService.hide();
    this.singleRecord = this.getSingleResponse.responseBody;
    console.log(this.singleRecord);
  }

  async getAllClientRecords() {
    this.apiserviceService.SpinnerService.show();
    this.posts = await this.apiserviceService.fetchAllRecords(AppUrls.ALL_CLIENT);
    this.apiserviceService.SpinnerService.hide();
    if (this.posts.status === 'SUCCESS') {
      this.clientList = this.posts.responseBody;
    }
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  buildDtOptionpkg(url: string): DataTables.Settings {
    return {
      pagingType: 'full_numbers',
      processing: false,
      serverSide: true,
      pageLength: 10,
      ajax: (dataTablesParameters: any, callback) => {
        this.apiserviceService.SpinnerService.show();
        this.apiserviceService.saveData(url, dataTablesParameters)
          .subscribe
          (resp => {
            this.apiserviceService.SpinnerService.hide();
            if (resp.data.length > 0) {
              this.clientRemittance = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              /*this.isAdd = true;*/
              this.clientRemittance = [];
            }

          });
      },
      columns: [
        {data: 'remittanceNo'},
        {data: 'date', searchable: false, orderable: false},
        {data: 'clientCode'},
        {data: 'collectedAmt', searchable: false, orderable: false},
        {data: 'status', searchable: false, orderable: false},
        {data: 'totalShipment', searchable: false, orderable: false},
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

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.clientRemittanceForm.get('file').setValue(file);
    }
  }

  oncloseRemittanceFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.closeRemittanceForm.get('file').setValue(file);
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
        const url = AppUrls.UPLOAD_PREOGRESS + '?key=generateRemittance&token=' + this.token;
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
}
