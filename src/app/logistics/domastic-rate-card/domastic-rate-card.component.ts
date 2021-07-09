import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiserviceService} from 'src/app/apiservice.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Slab} from './slab.model';
import * as $ from 'jquery';
import {DataTableDirective} from 'angular-datatables';
import {interval, Subject, Subscription} from 'rxjs';
import {DomasticRateCard} from './domastic-rate-card';
import {AppUrls} from '../../common/Api_Url_Seeting';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {saveAs} from 'file-saver';
import {map} from 'rxjs/operators';
import {any} from 'codelyzer/util/function';

@Component({
  selector: 'app-domastic-rate-card',
  templateUrl: './domastic-rate-card.component.html',
  styleUrls: ['./domastic-rate-card.component.css']
})
export class DomasticRateCardComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  title = 'datatables';
  public isDisplay = true;
  public isFirst = false;
  public isAdd = false;
  public isUpdate = false;
  public selectFrightType = false;
  public flateRate = false;
  public slabRate = false;

  dynLocalZone: Array<Slab> = [];
  dynMetroZone: Array<Slab> = [];
  dynRoiZone: Array<Slab> = [];
  dynNejkZone: Array<Slab> = [];
  dynWithinRegionZone: Array<Slab> = [];

  newSingleSlab: any = {};
  public flateRateLocal = false;
  public slabRateLocal = false;
  public posts;
  public allRecords;
  public deleteRecord;
  public singleRecord = new DomasticRateCard();
  public domasticRateCards: DomasticRateCard[];
  /*public singleRecord = new BulkHeader();*/
  public getSingleResponse;
  public courierList;
  public serviceProviderList;
  public serviceTypeList;
  public rateCardTypeList;

  public uploadPresentage = 0;
  public isUploadStart = false;
  public isUploadButtonDisabled = false;
  public token = '';
  subscription: Subscription;

  public isUpload = false;
  public isUpdateBulkupload = false;
  public response;
  public data;
  form: FormGroup;
  error: string;
  responseBody = {errorFileName: '', errorRecord: 0, fileName: '', filePath: '', successFileName: '', successRecord: 0, totalRecord: 0};

  public actualZones = {LOCAL: 'localZone', METRO: 'metroZone', ROI: 'roiZone', NEJK: 'nejkZone', WITHINSTATE: 'withinRegionZone'};
  localOtherCharges: any = {};
  ROYOtherCharges: any = {};
  NEJKOtherCharges: any = {};
  WITHINSTATEOtherCharges: any = {};
  METROOtherCharges: any = {};

  localFlateCharge: any = {};
  metroFlateCharge: any = {};
  roiFlateCharge: any = {};
  nejkFlateCharge: any = {};
  withinStateFlateCharge: any = {};
  domasticRateCardForm = new FormGroup({
    rateCardCode: new FormControl('', [Validators.required]),
    rateCardName: new FormControl('', [Validators.required]),
    freightType: new FormControl('', [Validators.required]),
    serviceProviderCode: new FormControl('', [Validators.required]),
    // serviceTypeCode: new FormControl('', [Validators.required]),
    courierCode: new FormControl('', [Validators.required]),
    rateMatrixList: new FormControl(''),
    rateCardTypeCode: new FormControl('', [Validators.required]),
  });

  updateDomasticRateCardForm = new FormGroup({
    id: new FormControl(''),
    rateCardCode: new FormControl('', [Validators.required]),
    rateCardName: new FormControl('', [Validators.required]),
    freightType: new FormControl('', [Validators.required]),
    serviceProviderCode: new FormControl('', [Validators.required]),
    // serviceTypeCode: new FormControl('', [Validators.required]),
    courierCode: new FormControl('', [Validators.required]),
    rateMatrixList: new FormControl(''),
    rateCardTypeCode: new FormControl('', [Validators.required]),
  });

  constructor(private apiserviceService: ApiserviceService, private formBuilder: FormBuilder, private http: HttpClient) {

  }

  async ngOnInit(): Promise<void> {
    this.apiserviceService.urlAuthorization();

    this.dtOptions = this.buildDtOptionpkg(AppUrls.DOMASTIC_RATE_CARD_SORT_AND_PAGING);
    this.getAllCourier();
    this.getAllServiceProvider();
    // this.getAllServiceType();
    this.getAllRateCardType();
    this.isFirst = true;
    /*$(document).ready(function () {
      $('#delete1').click(function () {
        alert('welcome');
      });
    });*/
    this.form = this.formBuilder.group({
      file: [''],
      uploadId: [''],
      isUpdate: false
    });
  }

  async onDownloadDomesticRateCardReport() {
    const fileName = 'DomesticRateCardReport';
    const url = AppUrls.DOWNLOAD_DOMESTIC_RATE_CARD_REPORT;
    this.apiserviceService.SpinnerService.show();
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], fileName + '.xlsx', {type: 'application/vnd.ms.excel'});
    saveAs(file);
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.get('file').setValue(file);
    }
  }
  isCheck(elementName) {
    if (elementName === 'UPDATE') {
      if (this.isUpdateBulkupload) {
        this.isUpdateBulkupload = false;
      } else {
        this.isUpdateBulkupload = true;
      }
      console.log(this.isUpdateBulkupload);
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
      formData.append('uploadId', 'domesticRateCardBulkUpload');
      formData.append('isUpdate', this.isUpdateBulkupload + '');
      this.upload(formData, 'api/uploadFile').subscribe(
        (res) => res,
        (err) => this.error = err
      );
    }
  }

  async downloadTemplate() {
    const fileName = 'domesticRateCardBulkUpload';
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


  onChangeFrightType(freightType: String) {
    console.log(freightType);
    if (freightType === 'SLAB') {
      this.dynLocalZone = [];
      this.newSingleSlab = {fromWeight: '', toWeight: '', rate: ''};
      this.dynLocalZone.push(this.newSingleSlab);

      this.dynMetroZone = [];
      this.dynMetroZone.push(this.newSingleSlab);

      this.dynRoiZone = [];
      this.dynRoiZone.push(this.newSingleSlab);

      this.dynNejkZone = [];
      this.dynNejkZone.push(this.newSingleSlab);

      this.dynWithinRegionZone = [];
      this.dynWithinRegionZone.push(this.newSingleSlab);

      this.newSingleSlab = {};

      this.selectFrightType = true;
      this.slabRate = true;
      this.flateRate = false;

    } else if (freightType === 'FLAT') {
      this.flateRate = true;
      this.slabRate = false;
      this.selectFrightType = true;

    } else {
      this.slabRate = false;
      this.flateRate = false;
      this.selectFrightType = false;

    }
  }

  addTableRowLocal() {
    this.newSingleSlab = {fromWeight: '', toWeight: '', rate: ''};
    this.dynLocalZone.push(this.newSingleSlab);
    this.newSingleSlab = {};
  }

  addTableRowMetro() {
    this.newSingleSlab = {fromWeight: '', toWeight: '', rate: ''};
    this.dynMetroZone.push(this.newSingleSlab);
    this.newSingleSlab = {};
  }

  addTableRowRoi() {
    this.newSingleSlab = {fromWeight: '', toWeight: '', rate: ''};
    this.dynRoiZone.push(this.newSingleSlab);
    this.newSingleSlab = {};
  }

  addTableRowNejk() {
    this.newSingleSlab = {fromWeight: '', toWeight: '', rate: ''};
    this.dynNejkZone.push(this.newSingleSlab);
    this.newSingleSlab = {};
  }

  addTableWithinRegion() {
    this.newSingleSlab = {fromWeight: '', toWeight: '', rate: ''};
    this.dynWithinRegionZone.push(this.newSingleSlab);
    this.newSingleSlab = {};
  }

  deleteFieldValueLocal(index) {
    this.dynLocalZone.splice(index, 1);
  }

  deleteFieldValueMetro(index) {
    this.dynMetroZone.splice(index, 1);
  }

  deleteFieldValueRoi(index) {
    this.dynRoiZone.splice(index, 1);
  }

  deleteFieldValueNejk(index) {
    this.dynNejkZone.splice(index, 1);
  }

  deleteFieldValueWithinRegion(index) {
    this.dynWithinRegionZone.splice(index, 1);
  }


  addNew() {
    this.isUpdateBulkupload = false;
    this.isUpload = false;
    this.isDisplay = false;
    this.isAdd = true;
    this.isFirst = false;
    this.isUpdate = false;
    this.selectFrightType = false;
  }

  cancelButtonAction() {
    this.isUpdateBulkupload = false;
    this.isUpload = false;
    this.isDisplay = true;
    this.isAdd = false;
    this.isFirst = false;
    this.isUpdate = false;
  }

  excalUpload() {
    this.isUpdateBulkupload = false;
    this.isDisplay = false;
    this.isAdd = false;
    this.isFirst = false;
    this.isUpload = true;
  }

  async updateRecords(objectID) {
    await this.findById(objectID);
    this.isUpdateBulkupload = false;
    this.isUpdate = true;
    this.isDisplay = false;
    this.isAdd = false;
    this.isUpload = false;

    if (this.singleRecord.freightType === 'SLAB') {
      const freightType1 = this.singleRecord.freightType;
      for (const rateMatrix of this.singleRecord.rateMatrixList) {
        const zoneType = rateMatrix.zoneType;
        console.log(zoneType);
        console.log(rateMatrix);
        console.log('====================');
        if (zoneType === 'LOCAL') {
          this.dynLocalZone = [];
          console.log(rateMatrix.awbCharge);
          this.localOtherCharges = rateMatrix;

          for (const slabFreight of rateMatrix.slabFreights) {
            console.log(slabFreight);

            this.newSingleSlab = {fromWeight: slabFreight.fromWeight, toWeight: slabFreight.toWeight, rate: slabFreight.rate};
            this.dynLocalZone.push(this.newSingleSlab);
            this.newSingleSlab = {};
          }
        }
        if (zoneType === 'METRO') {
          this.METROOtherCharges = rateMatrix;
          this.dynMetroZone = [];
          for (const slabFreight of rateMatrix.slabFreights) {
            console.log(slabFreight);
            this.newSingleSlab = {fromWeight: slabFreight.fromWeight, toWeight: slabFreight.toWeight, rate: slabFreight.rate};
            this.dynMetroZone.push(this.newSingleSlab);
            this.newSingleSlab = {};
          }
        }

        if (zoneType === 'ROI') {
          this.ROYOtherCharges = rateMatrix;
          this.dynRoiZone = [];
          for (const slabFreight of rateMatrix.slabFreights) {
            console.log(slabFreight);
            this.newSingleSlab = {fromWeight: slabFreight.fromWeight, toWeight: slabFreight.toWeight, rate: slabFreight.rate};
            this.dynRoiZone.push(this.newSingleSlab);
            this.newSingleSlab = {};
          }
        }

        if (zoneType === 'NEJK') {
          this.NEJKOtherCharges = rateMatrix;
          this.dynNejkZone = [];
          for (const slabFreight of rateMatrix.slabFreights) {
            console.log(slabFreight);
            this.newSingleSlab = {fromWeight: slabFreight.fromWeight, toWeight: slabFreight.toWeight, rate: slabFreight.rate};
            this.dynNejkZone.push(this.newSingleSlab);
            this.newSingleSlab = {};
          }
        }

        if (zoneType === 'WITHINSTATE') {
          this.WITHINSTATEOtherCharges = rateMatrix;
          this.dynWithinRegionZone = [];
          for (const slabFreight of rateMatrix.slabFreights) {
            console.log(slabFreight);
            this.newSingleSlab = {fromWeight: slabFreight.fromWeight, toWeight: slabFreight.toWeight, rate: slabFreight.rate};
            this.dynWithinRegionZone.push(this.newSingleSlab);
            this.newSingleSlab = {};
          }
        }
      }

      this.newSingleSlab = {};
      this.slabRate = true;
      this.flateRate = false;
      this.selectFrightType = true;
    } else if (this.singleRecord.freightType === 'FLAT') {

      const freightType1 = this.singleRecord.freightType;
      for (const rateMatrix of this.singleRecord.rateMatrixList) {
        const zoneType = rateMatrix.zoneType;
        console.log(zoneType);
        console.log(rateMatrix);
        console.log('====================');
        if (zoneType === 'LOCAL') {
          console.log(rateMatrix.awbCharge);
          this.localOtherCharges = rateMatrix;
          this.localFlateCharge = rateMatrix.flatFreight;
        }
        if (zoneType === 'METRO') {
          this.METROOtherCharges = rateMatrix;
          this.metroFlateCharge = rateMatrix.flatFreight;
        }

        if (zoneType === 'ROI') {
          this.ROYOtherCharges = rateMatrix;
          this.roiFlateCharge = rateMatrix.flatFreight;
        }

        if (zoneType === 'NEJK') {
          this.NEJKOtherCharges = rateMatrix;
          this.nejkFlateCharge = rateMatrix.flatFreight;
        }

        if (zoneType === 'WITHINSTATE') {
          this.WITHINSTATEOtherCharges = rateMatrix;
          this.withinStateFlateCharge = rateMatrix.flatFreight;
        }
      }

      this.newSingleSlab = {};
      this.slabRate = true;
      this.flateRate = false;
      this.selectFrightType = true;

      this.flateRate = true;
      this.slabRate = false;
      this.selectFrightType = true;
    }
    /*this.updateDomasticRateCardForm.value.id = this.singleRecord.id;
    this.updateDomasticRateCardForm.value.rateCardCode = this.singleRecord.;
    this.updateDomasticRateCardForm.value.rateCardName = this.singleRecord.active;
    this.updateDomasticRateCardForm.value.courierCode = this.singleRecord.client.id;
    this.updateDomasticRateCardForm.value.serviceProviderCode = this.singleRecord.deliveryType;
    this.updateDomasticRateCardForm.value.serviceTypeCode = this.singleRecord.deliveryType;
    this.updateDomasticRateCardForm.value.rateMatrixList = this.singleRecord.deliveryType;*/
    /*(<HTMLInputElement>document.getElementById('rateCardCodeUpdate')).value = this.singleRecord.rateCardCode;
    (<HTMLInputElement>document.getElementById('rateCardNameUpdate')).value  = this.singleRecord.rateCardName;
    (<HTMLSelectElement>document.getElementById('courierUpdate')).value  = this.singleRecord.courierCode;
    (<HTMLSelectElement>document.getElementById('serviceProviderUpdate')).value  = this.singleRecord.serviceProviderCode;
    (<HTMLSelectElement>document.getElementById('serviceTypeUpdate')).value  = this.singleRecord.serviceTypeCode;
    (<HTMLSelectElement>document.getElementById('freightTypeUpdate')).value  = this.singleRecord.freightType;*/

    /*const rateMatrixArray = [];
    const freightType = this.singleRecord.freightType;
    for (const rateMatrix of this.singleRecord.rateMatrixList) {
      const id = this.actualZones[rateMatrix.zoneType];
      (<HTMLInputElement>document.getElementById(id + 'AwbChargeUpdate')).value = rateMatrix.awbCharge;
      (<HTMLInputElement>document.getElementById(id + 'MinCodChargeUpdate')).value = rateMatrix.minCodCharge;
      (<HTMLInputElement>document.getElementById(id + 'CodChargePercentUpdate')).value = rateMatrix.codChargePercent;
      (<HTMLInputElement>document.getElementById(id + 'FSCUpdate')).value = rateMatrix.fsc;
      (<HTMLInputElement>document.getElementById(id + 'GSTUpdate')).value = rateMatrix.gst;
      (<HTMLInputElement>document.getElementById(id + 'ROVUpdate')).value = rateMatrix.rovCharge;
      (<HTMLInputElement>document.getElementById(id + 'FOVUpdate')).value = rateMatrix.fov;
      (<HTMLInputElement>document.getElementById(id + 'HandlingChargeUpdate')).value = rateMatrix.handlingCharges;
      (<HTMLInputElement>document.getElementById(id + 'ODAUpdate')).value = rateMatrix.oda;
      (<HTMLInputElement>document.getElementById(id + 'InsuranceChargeUpdate')).value = rateMatrix.insuranceCharges;
      (<HTMLInputElement>document.getElementById(id + 'CovidChargeUpdate')).value = rateMatrix.covidCharges;
      (<HTMLInputElement>document.getElementById(id + 'OtherChargeUpdate')).value = rateMatrix.otherCharges;
      if (freightType === 'SLAB') {
        if (rateMatrix.zoneType === 'LOCAL') {
          this.dynLocalZone = rateMatrix.slabFreights;
        } else if (rateMatrix.zoneType === 'METRO') {
          this.dynMetroZone = rateMatrix.slabFreights;
        } else if (rateMatrix.zoneType === 'ROI') {
          this.dynRoiZone = rateMatrix.slabFreights;
        } else if (rateMatrix.zoneType === 'NEJK') {
          this.dynNejkZone = rateMatrix.slabFreights;
        } else if (rateMatrix.zoneType === 'WITHINSTATE') {
          this.dynWithinRegionZone = rateMatrix.slabFreights;
        }
      } else if (freightType === 'FLAT') {
        (<HTMLInputElement>document.getElementById(id + 'BaseWeightUpdate')).value = rateMatrix.flatFreight.baseWeight;
        (<HTMLInputElement>document.getElementById(id + 'BaseRateUpdate')).value = rateMatrix.flatFreight.baseRate;
        (<HTMLInputElement>document.getElementById(id + 'IncrementalWeightUpdate')).value = rateMatrix.flatFreight.incrementalWeight;
        (<HTMLInputElement>document.getElementById(id + 'IncrementalRateUpdate')).value = rateMatrix.flatFreight.incrementalRate;
      }
    }*/
  }

  /*async deleteRecords(id) {
    this.isUpdate = false;
    await this.deleteById(id);
    this.dtOptions = this.buildDtOptionpkg(AppUrls.DOMASTIC_RATE_CARD_DELETE_RECORD);
    console.log(id);
  }*/

  async deleteById(id) {
    const url = '/api/deleteDomasticRateCard/' + id;
    this.apiserviceService.SpinnerService.show();
    this.deleteRecord = await this.apiserviceService.deleteById(url);
    this.apiserviceService.SpinnerService.hide();
    if (this.deleteRecord.status === 'SUCCESS') {
      alert('Record deleted successfully');
      this.rerenderDatatable();
      this.isDisplay = true;
    }
  }

  async findById(id) {
    this.singleRecord = null;
    const url = '/api/findDomasticRateCardById/' + id;
    this.apiserviceService.SpinnerService.show();
    this.getSingleResponse = await this.apiserviceService.findById(url);
    this.apiserviceService.SpinnerService.hide();
    this.singleRecord = this.getSingleResponse.responseBody;
    console.log(this.singleRecord);
  }

  async getAllCourier() {
    this.apiserviceService.SpinnerService.show();
    this.posts = await this.apiserviceService.fetchAllRecords('/api/getAllCourier');
    this.apiserviceService.SpinnerService.hide();
    if (this.posts.status === 'SUCCESS') {
      this.courierList = this.posts.responseBody;
    }
  }

  async getAllServiceProvider() {
    this.apiserviceService.SpinnerService.show();
    this.posts = await this.apiserviceService.fetchAllRecords('/api/getAllServiceProvider');
    this.apiserviceService.SpinnerService.hide();
    if (this.posts.status === 'SUCCESS') {
      this.serviceProviderList = this.posts.responseBody;
    }
  }

  /*async getAllServiceType() {
    this.apiserviceService.SpinnerService.show();
    this.posts = await this.apiserviceService.fetchAllRecords('/api/getAllServiceType');
    this.apiserviceService.SpinnerService.hide();
    if (this.posts.status === 'SUCCESS') {
      this.serviceTypeList = this.posts.responseBody;
    }
  }*/

  async getAllRateCardType() {
    this.apiserviceService.SpinnerService.show();
    this.posts = await this.apiserviceService.fetchAllRecords(AppUrls.GET_ALL_ACTIVE_RATE_CARD_TYPE);
    this.apiserviceService.SpinnerService.hide();
    if (this.posts.status === 'SUCCESS') {
      this.rateCardTypeList = this.posts.responseBody;
    }
  }

  angularFunctionCalled() {
    alert('Angular 2+ function is called');
  }

  onSubmit() {

    this.domasticRateCardForm.value.rateCardCode = (<HTMLInputElement>document.getElementById('rateCardCode')).value;
    this.domasticRateCardForm.value.rateCardName = (<HTMLInputElement>document.getElementById('rateCardName')).value;
    this.domasticRateCardForm.value.courierCode = (<HTMLInputElement>document.getElementById('courier')).value;
    this.domasticRateCardForm.value.serviceProviderCode = (<HTMLInputElement>document.getElementById('serviceProvider')).value;
    //this.domasticRateCardForm.value.serviceTypeCode = (<HTMLInputElement>document.getElementById('serviceType')).value;
    this.domasticRateCardForm.value.freightType = (<HTMLInputElement>document.getElementById('freightType')).value;
    this.domasticRateCardForm.value.rateCardTypeCode = (<HTMLInputElement>document.getElementById('rateCardType')).value;
    const rateMatrixArray = [];
    const freightType = (<HTMLInputElement>document.getElementById('freightType')).value;
    for (const key in this.actualZones) {
      const rateMatrixObj = {};
      const id = this.actualZones[key];

      rateMatrixObj ['zoneType'] = key;
      rateMatrixObj ['awbCharge'] = (<HTMLInputElement>document.getElementById(id + 'AwbCharge')).value;
      rateMatrixObj ['minCodCharge'] = (<HTMLInputElement>document.getElementById(id + 'MinCodCharge')).value;
      rateMatrixObj ['codChargePercent'] = (<HTMLInputElement>document.getElementById(id + 'CodChargePercent')).value;
      rateMatrixObj ['fsc'] = (<HTMLInputElement>document.getElementById(id + 'FSC')).value;
      rateMatrixObj ['gst'] = (<HTMLInputElement>document.getElementById(id + 'GST')).value;
      rateMatrixObj ['rovCharge'] = (<HTMLInputElement>document.getElementById(id + 'ROV')).value;
      rateMatrixObj ['fov'] = (<HTMLInputElement>document.getElementById(id + 'FOV')).value;
      rateMatrixObj ['handlingCharges'] = (<HTMLInputElement>document.getElementById(id + 'HandlingCharge')).value;
      rateMatrixObj ['oda'] = (<HTMLInputElement>document.getElementById(id + 'ODA')).value;
      rateMatrixObj ['insuranceCharges'] = (<HTMLInputElement>document.getElementById(id + 'InsuranceCharge')).value;
      rateMatrixObj ['covidCharges'] = (<HTMLInputElement>document.getElementById(id + 'CovidCharge')).value;
      rateMatrixObj ['otherCharges'] = (<HTMLInputElement>document.getElementById(id + 'OtherCharge')).value;

      if (freightType === 'SLAB') {
        if (key === 'LOCAL') {
          rateMatrixObj['slabFreights'] = this.dynLocalZone;
        } else if (key === 'METRO') {
          rateMatrixObj['slabFreights'] = this.dynMetroZone;
        } else if (key === 'ROI') {
          rateMatrixObj['slabFreights'] = this.dynRoiZone;
        } else if (key === 'NEJK') {
          rateMatrixObj['slabFreights'] = this.dynNejkZone;
        } else if (key === 'WITHINSTATE') {
          rateMatrixObj['slabFreights'] = this.dynWithinRegionZone;
        }
      } else if (freightType === 'FLAT') {
        const flatObj = {};
        flatObj ['baseWeight'] = (<HTMLInputElement>document.getElementById(id + 'BaseWeight')).value;
        flatObj ['baseRate'] = (<HTMLInputElement>document.getElementById(id + 'BaseRate')).value;
        flatObj ['incrementalWeight'] = (<HTMLInputElement>document.getElementById(id + 'IncrementalWeight')).value;
        flatObj ['incrementalRate'] = (<HTMLInputElement>document.getElementById(id + 'IncrementalRate')).value;
        rateMatrixObj ['flatFreight'] = flatObj;
      }
      rateMatrixArray.push(rateMatrixObj);
    }
    this.domasticRateCardForm.value.rateMatrixList = rateMatrixArray;
    const body = JSON.stringify(this.domasticRateCardForm.value);
    this.apiserviceService.SpinnerService.show();
    this.apiserviceService.saveData(AppUrls.DOMASTIC_RATE_CARD_SAVE_RECORD, body).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
        this.domasticRateCardForm.reset();
        (<HTMLInputElement>document.getElementById('courier')).value = '';
        (<HTMLInputElement>document.getElementById('serviceProvider')).value = '';
        //(<HTMLInputElement>document.getElementById('serviceType')).value = '';
        (<HTMLInputElement>document.getElementById('freightType')).value = '';
        (<HTMLInputElement>document.getElementById('rateCardType')).value = '';
        this.cancelButtonAction();
        this.rerenderDatatable();
      } else {
        alert(this.getSingleResponse.message);
      }
    });
  }

  onUpdateRecord() {
    this.updateDomasticRateCardForm.value.id = (<HTMLInputElement>document.getElementById('mainObjId')).value;
    this.updateDomasticRateCardForm.value.rateCardCode = (<HTMLInputElement>document.getElementById('rateCardCodeUpdate')).value;
    this.updateDomasticRateCardForm.value.rateCardName = (<HTMLInputElement>document.getElementById('rateCardNameUpdate')).value;
    this.updateDomasticRateCardForm.value.courierCode = (<HTMLInputElement>document.getElementById('courierUpdate')).value;
    this.updateDomasticRateCardForm.value.serviceProviderCode = (<HTMLInputElement>document.getElementById('serviceProviderUpdate')).value;
    //this.updateDomasticRateCardForm.value.serviceTypeCode = (<HTMLInputElement>document.getElementById('serviceTypeUpdate')).value;
    this.updateDomasticRateCardForm.value.freightType = (<HTMLInputElement>document.getElementById('freightTypeUpdate')).value;
    this.updateDomasticRateCardForm.value.rateCardTypeCode = (<HTMLInputElement>document.getElementById('rateCardTypeUpdate')).value;
    const rateMatrixArray = [];
    const freightType = (<HTMLInputElement>document.getElementById('freightTypeUpdate')).value;
    for (const key in this.actualZones) {
      const rateMatrixObj = {};
      const id = this.actualZones[key];

      rateMatrixObj ['zoneType'] = key;
      rateMatrixObj ['id'] = (<HTMLInputElement>document.getElementById(id + 'Id')).value;
      rateMatrixObj ['awbCharge'] = (<HTMLInputElement>document.getElementById(id + 'AwbChargeUpdate')).value;
      rateMatrixObj ['minCodCharge'] = (<HTMLInputElement>document.getElementById(id + 'MinCodChargeUpdate')).value;
      rateMatrixObj ['codChargePercent'] = (<HTMLInputElement>document.getElementById(id + 'CodChargePercentUpdate')).value;
      rateMatrixObj ['fsc'] = (<HTMLInputElement>document.getElementById(id + 'FSCUpdate')).value;
      rateMatrixObj ['gst'] = (<HTMLInputElement>document.getElementById(id + 'GSTUpdate')).value;
      rateMatrixObj ['rovCharge'] = (<HTMLInputElement>document.getElementById(id + 'ROVUpdate')).value;
      rateMatrixObj ['fov'] = (<HTMLInputElement>document.getElementById(id + 'FOVUpdate')).value;
      rateMatrixObj ['handlingCharges'] = (<HTMLInputElement>document.getElementById(id + 'HandlingChargeUpdate')).value;
      rateMatrixObj ['oda'] = (<HTMLInputElement>document.getElementById(id + 'ODAUpdate')).value;
      rateMatrixObj ['insuranceCharges'] = (<HTMLInputElement>document.getElementById(id + 'InsuranceChargeUpdate')).value;
      rateMatrixObj ['covidCharges'] = (<HTMLInputElement>document.getElementById(id + 'CovidChargeUpdate')).value;
      rateMatrixObj ['otherCharges'] = (<HTMLInputElement>document.getElementById(id + 'OtherChargeUpdate')).value;

      if (freightType === 'SLAB') {
        if (key === 'LOCAL') {
          rateMatrixObj['slabFreights'] = this.dynLocalZone;
        } else if (key === 'METRO') {
          rateMatrixObj['slabFreights'] = this.dynMetroZone;
        } else if (key === 'ROI') {
          rateMatrixObj['slabFreights'] = this.dynRoiZone;
        } else if (key === 'NEJK') {
          rateMatrixObj['slabFreights'] = this.dynNejkZone;
        } else if (key === 'WITHINSTATE') {
          rateMatrixObj['slabFreights'] = this.dynWithinRegionZone;
        }
      } else if (freightType === 'FLAT') {
        const flatObj = {};
        //flatObj ['baseWeight'] = (<HTMLInputElement>document.getElementById(id + 'FlateId')).value;
        flatObj ['baseWeight'] = (<HTMLInputElement>document.getElementById(id + 'BaseWeightUpdate')).value;
        flatObj ['baseRate'] = (<HTMLInputElement>document.getElementById(id + 'BaseRateUpdate')).value;
        flatObj ['incrementalWeight'] = (<HTMLInputElement>document.getElementById(id + 'IncrementalWeightUpdate')).value;
        flatObj ['incrementalRate'] = (<HTMLInputElement>document.getElementById(id + 'IncrementalRateUpdate')).value;
        rateMatrixObj ['flatFreight'] = flatObj;
      }
      rateMatrixArray.push(rateMatrixObj);
    }
    this.updateDomasticRateCardForm.value.rateMatrixList = rateMatrixArray;
    const body = JSON.stringify(this.updateDomasticRateCardForm.value);
    this.apiserviceService.SpinnerService.show();
    this.apiserviceService.updateData(AppUrls.DOMASTIC_RATE_CARD_UPDATE_RECORD, body).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
        this.cancelButtonAction();
        this.updateDomasticRateCardForm.reset();
        (<HTMLInputElement>document.getElementById('courierUpdate')).value = '';
        (<HTMLInputElement>document.getElementById('serviceProviderUpdate')).value = '';
        //(<HTMLInputElement>document.getElementById('serviceTypeUpdate')).value = '';
        (<HTMLInputElement>document.getElementById('freightTypeUpdate')).value = '';
        (<HTMLInputElement>document.getElementById('rateCardTypeUpdate')).value = '';
        this.rerenderDatatable();
      } else {
        alert(this.getSingleResponse.message);
      }
    });
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
              this.domasticRateCards = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              /*this.isAdd = true;*/
              this.domasticRateCards = [];
            }

          });
      },
      columns: [
        {data: 'id'},
        {data: 'rateCardCode'},
        {data: 'rateCardName'},
        {data: 'freightType'},
        {data: 'courierCode'},
        {data: 'serviceProviderCode'},
        {data: 'rateCardTypeCode'},
        {data: 'active'},
      ],
    };
  }

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

  /*async findById(id) {
    let url = AppUrls.DOMESTIC_RATE_CAR_FIND_BY_ID + id;
    this.getSingleResponse = await this.apiserviceService.findById(url);
    this.singleRecord = this.getSingleResponse.responseBody;

  }*/
}


