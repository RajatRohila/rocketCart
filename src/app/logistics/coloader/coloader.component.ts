import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiserviceService} from 'src/app/apiservice.service';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {Coloader} from './coloader';
import {AppUrls} from '../../common/Api_Url_Seeting';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-coloader',
  templateUrl: './coloader.component.html',
  styleUrls: ['./coloader.component.css']
})
export class ColoaderComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  title = 'datatables';
  public isDisplay = true;
  public isFirst = false;
  public isAdd = false;
  public isUpdate = false;
  public isExternal = false;
  public posts;
  public allRecords;
  public deleteRecord;
  public singleRecord = new Coloader();
  public coloaders: Coloader[];
  public getSingleResponse;
  public data;
  public pincodeDetails = {city: '', state: '', country: ''};
  coloaderForm = new FormGroup({
    coloaderName: new FormControl('', [Validators.required]),
    coloaderCode: new FormControl('', [Validators.required]),
    registeredAdd: new FormControl('', [Validators.required]),
    pincode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(6), Validators.maxLength(6)]),
    contactPerson: new FormControl('', [Validators.required]),
    mobile: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]),
    email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    gstNumber: new FormControl(''),
    beneficiry: new FormControl(''),
    accountNo: new FormControl(''),
    bankName: new FormControl(''),
    ifscCode: new FormControl(''),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
  });
  updateColoaderForm = new FormGroup({
    id: new FormControl(''),
    coloaderName: new FormControl('', [Validators.required]),
    coloaderCode: new FormControl('', [Validators.required]),
    registeredAdd: new FormControl('', [Validators.required]),
    pincode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(6), Validators.maxLength(6)]),
    contactPerson: new FormControl('', [Validators.required]),
    mobile: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]),
    email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    gstNumber: new FormControl(''),
    beneficiry: new FormControl(''),
    accountNo: new FormControl(''),
    bankName: new FormControl(''),
    ifscCode: new FormControl(''),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    active: new FormControl('', [Validators.required])
  });


  constructor(private apiserviceService: ApiserviceService) {

  }

  async ngOnInit(): Promise<void> {
    this.apiserviceService.urlAuthorization();

    this.dtOptions = this.buildDtOptionpkg(AppUrls.COLOADER_SORT_AND_PAGING);
    this.isFirst = true;
    console.log(this.posts);
  }

  addNew() {
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
    await this.findById(id);
    console.log(id);
    this.isUpdate = true;
    this.isDisplay = false;
    this.isAdd = false;
    this.pincodeDetails.city = this.singleRecord.city;
    this.pincodeDetails.state = this.singleRecord.state;
    this.pincodeDetails.country = this.singleRecord.country;

  }

  changeValues() {
    if (this.isExternal) {
      this.isExternal = false;
    } else {
      this.isExternal = true;
    }
    console.log(this.isExternal);
  }

  async deleteRecords(id) {
    this.isUpdate = false;
    await this.deleteById(id);
    this.dtOptions = this.buildDtOptionpkg(AppUrls.COLOADER_SORT_AND_PAGING);
    console.log(id);
  }

  onSubmit() {
    const body = JSON.stringify(this.coloaderForm.value);
    this.apiserviceService.SpinnerService.show();
    this.apiserviceService.saveData(AppUrls.COLOADER_SAVE_RECORD, body).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
        /*alert('save successfully');*/
        this.cancelButtonAction();
        this.rerenderDatatable();
        this.coloaderForm.reset();
        this.isDisplay = true;
        this.isUpdate = false;
      } else {
        alert(this.getSingleResponse.message);
      }
    });
  }

  onUpdateSubmit() {
    const body = JSON.stringify(this.updateColoaderForm.value);
    this.apiserviceService.SpinnerService.show();
    this.apiserviceService.updateData(AppUrls.COLOADER_UPDATE_RECORD, body).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
        /*alert(' update successfully ');*/
        this.rerenderDatatable();
        this.isDisplay = true;
        this.isUpdate = false;
      } else {
        alert(this.getSingleResponse.message);
      }
    });
  }
  async deleteById(id) {
    this.apiserviceService.SpinnerService.show();
    const url = AppUrls.COLOADER_DELETE_RECORD + id;
    this.deleteRecord = await this.apiserviceService.deleteById(url);
    this.apiserviceService.SpinnerService.hide();
    if (this.deleteRecord.status === 'SUCCESS') {
      alert('Record deleted successfully');
      this.rerenderDatatable();
    }
  }

  async findById(id) {
    this.apiserviceService.SpinnerService.show();
    const url = AppUrls.COLOADER_FIND_BY_ID + id;
    this.getSingleResponse = await this.apiserviceService.findById(url);
    this.apiserviceService.SpinnerService.hide();
    this.singleRecord = this.getSingleResponse.responseBody;
  }

  async onDownloadColoaderReport() {
    const fileName = 'coloaderReport';
    const url = AppUrls.DOWNLOAD_COLOADER_REPORT;
    this.apiserviceService.SpinnerService.show();
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], fileName + '.xlsx', {type: 'application/vnd.ms.excel'});
    saveAs(file);
  }

  async downloadlDoc(coloaderCode) {
    this.apiserviceService.SpinnerService.show();
    const url = AppUrls.DOWNLOAD_DOC + '?entityCode=' + coloaderCode + '&entityType=COLOADER';
    this.data = await this.apiserviceService.downloadlDoc(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    if (blob != null && blob !== undefined) {
      const file = new File([blob], 'coloaderDoc.zip');
      saveAs(file);
    }
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  async getCityStateCountryByPincode(isUpdate) {
    let pincode = null;
    if (isUpdate === true) {
      pincode = this.updateColoaderForm.value.pincode;
    } else {
      pincode = this.coloaderForm.value.pincode;
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
              this.coloaders = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              /*this.isAdd = true;*/
              this.coloaders = [];
            }

          });
      },
      columns: [
        {data: 'id'},
        {data: 'coloaderName'},
        {data: 'coloaderCode'},
        {data: 'registeredAdd'},
        {data: 'pincode'},
        {data: 'mobile'},
        {data: 'email'},
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


