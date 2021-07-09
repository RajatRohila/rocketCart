import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiserviceService} from '../../apiservice.service';
import {AppUrls} from '../../common/Api_Url_Seeting';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {ThreeplManifast} from './threeplManifast.model';
import {saveAs} from 'file-saver';
import {map} from 'rxjs/operators';
import {HttpClient, HttpEventType} from '@angular/common/http';

declare var $: any;

@Component({
  selector: 'app-threepl-manifest',
  templateUrl: './threepl-manifest.component.html',
  styleUrls: ['./threepl-manifest.component.css']
})
export class ThreeplManifestComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  cteateManifest: DataTables.Settings = {};
  pendingforManifestDb: DataTables.Settings = {};
  closedManifestDb: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();
  title = 'datatables';

  public threeplManifast = [];
  public pendingManifestArray = [];
  public closedManifest = [];
  public isDisplay = true;
  public isFirst = false;
  public isAdd = false;
  public isUpdate = false;
  public posts;
  public allRecords;
  public awbNumbersResponse = new Array();
  public listOfAwbNumbers = [];
  public singleRecord = new ThreeplManifast();
  public getSingleResponse;
  public courierList;
  public tabbleValue;
  // public sacnAwbNumbers = new Array();
  public data;
  form: FormGroup;
  error: string;
  public manifestNumber = '';

  manifastForm = new FormGroup({
    awbNumbers: new FormControl('', [Validators.required]),
    courierCode: new FormControl('', [Validators.required]),
    clientCode: new FormControl('')
  });

  updateManifastForm = new FormGroup({
    awbNumbers: new FormControl('', [Validators.required]),
    courierCode: new FormControl('', [Validators.required]),
    clientCode: new FormControl('')
  });

  responseBody = {fileName: '', filePath: ''};

  constructor(private apiserviceService: ApiserviceService, private formBuilder: FormBuilder, private http: HttpClient) {
  }

  ngOnInit(): void {
    this.apiserviceService.urlAuthorization();
    this.cteateManifest = this.buildDtOptionpkg(AppUrls.THREEPL_MANIFAST_SORT_AND_PAGING);
    this.pendingforManifestDb = this.buildDtpendingMenifest(AppUrls.GET_ALL_PENDING_FOR_3PL_MANIFEST);
    this.closedManifestDb = this.buildDtClosedMenifest(AppUrls.GET_ALL_POD_UPLOADED_MANIFEST);
    this.getAllCourierRecods();
    this.form = this.formBuilder.group({
      file: [''],
      manifestId: [''],
    });
  }

  buildDtOptionpkg(url: string): DataTables.Settings {
    return {
      pagingType: 'full_numbers',
      processing: false,
      serverSide: true,
      pageLength: 10,
      destroy: true,
      order: [[0, 'desc']],
      ajax: (dataTablesParameters: any, callback) => {
        this.apiserviceService.saveData(url, dataTablesParameters)
          .subscribe
          (resp => {
            if (resp.data.length > 0) {
              this.threeplManifast = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
              /*for (const item of this.threeplManifast.awbNumbers.split(',')) {

              }*/
            } else {
              /*this.isAdd = true;*/
              this.threeplManifast = [];
            }

          });
      },
      columns: [
        {data: 'id'},
        {data: 'manifestNumber'},
        {data: 'courierCode'},
        {data: 'awbNumbers'},
        {data: 'handoverBranch'},
        {data: 'createBy'},
        {data: 'createDate'},
      ],
    };
  }

  addNew() {
    this.listOfAwbNumbers = [];
    this.isDisplay = false;
    this.isAdd = true;
    this.isFirst = false;
    this.isUpdate = false;
  }

  cancelButtonAction() {
    this.isDisplay = true;
    this.isAdd = false;
    this.isFirst = false;
    this.isUpdate = false;
  }

  async updateRecords(id) {
    this.listOfAwbNumbers = [];
    await this.getManifestAndSaleOrders(id);
    this.isUpdate = true;
    this.isDisplay = false;
    this.isAdd = false;
    this.updateManifastForm.get('courierCode').patchValue(this.singleRecord.courierCode);
  }

  onSubmit() {
    let awbString = this.listOfAwbNumbers.join();
    this.manifastForm.value.awbNumbers = awbString;
    let body = JSON.stringify(this.manifastForm.value);
    this.apiserviceService.saveData(AppUrls.THREEPL_MANIFAST_SAVE_RECORD, body).subscribe(result => {
      console.log(result);
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
        /*alert('save successfully');*/
        this.awbNumbersResponse = [];
        //this.manifastForm.reset();
        this.cancelButtonAction();
        this.rerenderDatatable();
      } else {
        alert(this.getSingleResponse.message);
      }
    });
  }

  onUpdateSubmit() {
    let awbString = this.listOfAwbNumbers.join();
    // this.updateManifastForm.value.awbNumbers = awbString;
    this.singleRecord.awbNumbers = awbString;
    const body = JSON.stringify(this.singleRecord);
    this.apiserviceService.SpinnerService.show();
    this.apiserviceService.updateData(AppUrls.THREEPL_MANIFAST_UPDATE_RECORD, body).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
        /*alert('update successfully');*/
        //this.rerenderDatatable();
        this.rerenderDatatable();
        this.isDisplay = true;
        this.isUpdate = false;
      } else {
        alert(this.getSingleResponse.message);
      }
    });
  }


  async onScan(type) {
    let awbNumbers = '';
    let courierCode = '';
    if ('ADD' === type) {
      awbNumbers = this.manifastForm.value.awbNumbers;
      courierCode = this.manifastForm.value.courierCode;
    } else if ('UPDATE' === type) {
      awbNumbers = (<HTMLInputElement>document.getElementById('awbNumbersUpdate')).value;
      courierCode = (<HTMLInputElement>document.getElementById('courierCodeUpdate')).value;
    }
    let url = '/api/3PlManifestFindByAwbNumber/' + awbNumbers + '/' + courierCode;
    if (this.listOfAwbNumbers.indexOf(awbNumbers) === -1) {
      this.apiserviceService.SpinnerService.show();
      this.getSingleResponse = await this.apiserviceService.findById(url);
      this.apiserviceService.SpinnerService.hide();
      if (this.getSingleResponse.status === 'SUCCESS') {
        this.awbNumbersResponse.unshift(this.getSingleResponse.responseBody);
        this.listOfAwbNumbers.push(awbNumbers);
        console.log(this.awbNumbersResponse);
        if ('ADD' === type) {
          (<HTMLInputElement>document.getElementById('awbNumbers')).value = '';
        } else if ('UPDATE' === type) {
          (<HTMLInputElement>document.getElementById('awbNumbersUpdate')).value = '';
        }
      } else {
        this.apiserviceService.SpinnerService.hide();
        alert(this.getSingleResponse.message);
      }
    } else {
      this.apiserviceService.SpinnerService.hide();
      alert('Already scaned');
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

  async getManifestAndSaleOrders(id) {
    const url = AppUrls.GET_MANIFEST_AND_SALE_ORDERS + id;
    this.apiserviceService.SpinnerService.show();
    this.getSingleResponse = await this.apiserviceService.getCall(url);
    this.apiserviceService.SpinnerService.hide();

    this.awbNumbersResponse = new Array();
    this.listOfAwbNumbers = [];
    if (this.getSingleResponse.status === 'SUCCESS') {
      this.awbNumbersResponse = this.getSingleResponse.responseBody.saleOrderList;
      this.singleRecord = this.getSingleResponse.responseBody.manifest;
      this.awbNumbersResponse.forEach((key: any, val: any) => {
        this.listOfAwbNumbers.push(key.referanceNo);
      });
    } else {
      alert(this.getSingleResponse.message);
    }
  }

  deleteFieldValue(index, awbNo) {
    console.log(index);
    this.removeElementFromArray(awbNo);
    this.awbNumbersResponse.splice(index, 1);
  }

  removeElementFromArray(element: String) {
    this.listOfAwbNumbers.forEach((value, index) => {
      if (value === element) {
        this.listOfAwbNumbers.splice(index, 1);
      }
    });
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerenderDatatable(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  async printManifest(manifestNum) {
    const url = AppUrls.GENERATE_MANIFEST_PRINT_LABEL;
    this.data = await this.apiserviceService.fileDownloadByPostMethod(url, manifestNum);
    console.log(this.data);
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], manifestNum + '-invoice.pdf', {type: 'application/pdf'});
    saveAs(file);
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.get('file').setValue(file);
    }
  }

  uploadPod() {
    const formData = new FormData();
    formData.append('files', this.form.get('file').value);
    formData.append('manifestId', this.manifestNumber);
    this.upload(formData, 'api/upload3PlManifestPod').subscribe(
      (res) => res,
      (err) => this.error = err
    );
  }

  public upload(data, url) {
    const headers = {'Authorization': localStorage.getItem('token'), 'userID': localStorage.getItem('userID')};
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
              this.rerenderDatatable();
              $('#threeplManifestPodUploadModel').modal('hide');
            }
            return this.responseBody;
          default:
            this.apiserviceService.SpinnerService.hide();
            return `Unhandled event: ${event.type}`;
        }
      })
    );
  }

  getManifestNumber(manifestNumber) {
    this.manifestNumber = manifestNumber;
  }


  async download3plPod(podFileName) {
    this.apiserviceService.SpinnerService.show();
    const fileName = podFileName;
    const url = AppUrls.DOWLOAD_POD_FILE + '?podFileName=' + podFileName;
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], podFileName);
    saveAs(file);

  }


  buildDtpendingMenifest(url: string): DataTables.Settings {
    return {
      pagingType: 'full_numbers',
      processing: false,
      serverSide: true,
      pageLength: 10,
      destroy: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.apiserviceService.saveData(url, dataTablesParameters)
          .subscribe
          (resp => {
            if (resp.data.length > 0) {
              this.pendingManifestArray = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              /*this.isAdd = true;*/
              this.pendingManifestArray = [];
            }

          });
      },
      columns: [
        {data: 'referanceNo'},
        {data: 'courierCode'},
        {data: 'courierAWBNumber'},
        {data: 'clientOrderId'},
        {data: 'paymentType'},
        {data: 'codAmount'},
      ],
    };
  }


  buildDtClosedMenifest(url: string): DataTables.Settings {
    return {
      pagingType: 'full_numbers',
      processing: false,
      serverSide: true,
      pageLength: 10,
      destroy: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.apiserviceService.saveData(url, dataTablesParameters)
          .subscribe
          (resp => {
            if (resp.data.length > 0) {
              this.closedManifest = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              /*this.isAdd = true;*/
              this.closedManifest = [];
            }

          });
      },
      columns: [
        {data: 'id'},
        {data: 'manifestNumber'},
        {data: 'courierCode'},
        {data: 'awbNumbers'},
        {data: 'handoverBranch'},
        {data: 'createBy'},
        {data: 'createDate'},
      ],
    };
  }
}

