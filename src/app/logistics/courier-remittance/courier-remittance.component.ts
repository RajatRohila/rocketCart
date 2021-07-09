import {Component, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {Subject, interval, Subscription} from 'rxjs';
import {ApiserviceService} from '../../apiservice.service';
import {CourierRemittance} from './courierRemittance.model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {AppUrls} from '../../common/Api_Url_Seeting';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-courier-remittance',
  templateUrl: './courier-remittance.component.html',
  styleUrls: ['./courier-remittance.component.css']
})
export class CourierRemittanceComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  closedCourierRemittanceDb: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  courierRemittance: CourierRemittance[];
  title = 'datatables';

  public isDisplay = true;
  public isFirst = false;
  public isAdd = false;

  public posts;
  public allRecords;
  public singleRecord = new CourierRemittance();
  public getSingleResponse;
  public courierList;
  public data;
  public response;

  public uploadPresentage = 0;
  public isUploadStart = false;
  public isUploadButtonDisabled = false;
  public token = '';
  subscription: Subscription;

  courierRemittanceForm: FormGroup;
  error: string;
  responseBody = {errorFileName: '', errorRecord: 0, fileName: '', filePath: '', successFileName: '', successRecord: 0, totalRecord: 0};
  constructor(private apiserviceService: ApiserviceService, private formBuilder: FormBuilder, private http: HttpClient) {
  }

  ngOnInit(): void {
    this.apiserviceService.urlAuthorization();
    this.getAllCourierRecods();
    this.closedCourierRemittanceDb = this.buildClosedCourierRemittance(AppUrls.COURIER_REMITTANCE_CLOSED_RECODS);
    this.courierRemittanceForm = this.formBuilder.group({
      file: [''],
      uploadId: [''],
      extra: [],
      courierCode: new FormControl('', [Validators.required]),
    });
  }
  addNew() {
    this.isDisplay = false;
    this.isAdd = true;
    this.isFirst = false;
  }
  cancelButtonAction() {
    this.isDisplay = true;
    this.isAdd = false;
    this.isFirst = false;
  }
  async onDownload() {
    const courierCodes = this.courierRemittanceForm.get('courierCode').value;
    if(courierCodes == undefined || courierCodes == null || courierCodes == ''){
      alert("Please select courier.");
      return false;
    }
    const fileName = 'courierRemittance';
    const url = AppUrls.AWB_NO_PENDING_FOR_COURIER_REMITTANCE + '?courierCode=' + courierCodes;
    this.apiserviceService.SpinnerService.show();
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], fileName + '.xlsx', {type: 'application/vnd.ms.excel'});
    saveAs(file);
  }

  async downloadCourierRemittanceReport(remittanceNo) {
    const fileName = 'courierRemittanceReport';
    const url = AppUrls.COURIER_REMITTANCE_REPORT + '?remittanceNo=' + remittanceNo;
    this.apiserviceService.SpinnerService.show();
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], fileName + '.xlsx', {type: 'application/vnd.ms.excel'});
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

  onCloseCourierRemittance() {
    const file = this.courierRemittanceForm.get('file').value;
    if( file == null || file == undefined || file == ''){
      alert("Please select file.");
      return false;
    }
    const courierCoded = this.courierRemittanceForm.get('courierCode').value;
    if(courierCoded == undefined || courierCoded == null || courierCoded == ''){
      alert("Please select courier.");
      return false;
    }
    const formData = new FormData();
    console.log(this.courierRemittanceForm.get('courierCode').value);
    formData.append('files', this.courierRemittanceForm.get('file').value);
    formData.append('uploadId', 'closeCourierRemittance');
    formData.append('extra', this.courierRemittanceForm.get('courierCode').value);
    this.upload(formData, '/api/uploadFile').subscribe(
      (res) => res,
      (err) => this.error = err
    );
  }
  async getAllCourierRecods() {
    this.apiserviceService.SpinnerService.show();
    this.posts = await this.apiserviceService.fetchAllRecords(AppUrls.GET_ACTIVE_COURIERS);
    this.apiserviceService.SpinnerService.hide();
    if (this.posts.status === 'SUCCESS') {
      this.courierList = this.posts.responseBody;
    }
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  buildClosedCourierRemittance(url: string): DataTables.Settings {
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
              this.courierRemittance = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              /*this.isAdd = true;*/
              this.courierRemittance = [];
            }

          });
      },
      columns: [
        {data: 'remittanceNo'},
        {data: 'courierCode'},
        {data: 'totalAmountReceived', searchable: false, orderable: false},
        {data: 'date', searchable: false, orderable: false},
        {data: 'totalShipment', searchable: false, orderable: false},
      ],
    };
  }


  // tslint:disable-next-line:use-life-cycle-interface

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
      this.courierRemittanceForm.get('file').setValue(file);
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
        const url = AppUrls.UPLOAD_PREOGRESS + '?key=closeCourierRemittance&token=' + this.token;
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
