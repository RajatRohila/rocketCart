import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiserviceService} from 'src/app/apiservice.service';
import {DataTableDirective} from 'angular-datatables';
import {interval, Subject, Subscription} from 'rxjs';
import {User} from './user';
import {AppUrls} from '../../common/Api_Url_Seeting';
import {saveAs} from 'file-saver';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  disabled = false;
  showFilter = true;
  limitSelection = false;
  selectedItems: any = [];
  selectedBranch: any = [];
  selectedClientCode: any = [];
  dropdownSettings: any = {};
  branchDropdownSettings: any = {};

  title = 'datatables';
  public isDisplay = true;
  public isFirst = false;
  public isAdd = false;
  public isUpdate = false;
  public posts;
  public allRecords;
  public deleteRecord;
  public singleRecord = new User();
  public users: User[];
  public getSingleResponse;
  public roleList;
  public branchList;
  public clientCodeList;
  public clientList;
  public data;
  public isUserTypeClient = false;
  public userTypeValue;
  public isadmin = false;
  public pincodeDetails = {city: '', state: '', country: ''};
  public Loacked = false;
  public Enabled = true;

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

  /*userTyprList = ['CLIENT', 'COURIER', 'COLOADER', 'SELF'];
  genderList = ['MALE', 'FEMALE'];*/
  // @ts-ignore
  // @ts-ignore
  userForm = new FormGroup({
    password: new FormControl('', [Validators.required]),
    loginId: new FormControl('', [Validators.required]),
    fisrtName: new FormControl('', [Validators.required]),
    lastName: new FormControl(''),
    pincode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(6), Validators.maxLength(6)]),
    // tslint:disable-next-line:max-line-length
    aadharNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(12), Validators.maxLength(12)]),
    panNumber: new FormControl('', [Validators.required]),
    contact: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]),
    email: new FormControl('', [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    gender: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    type: new FormControl(''),
    role: new FormControl(''),
    branch: new FormControl(''),
    /*userRoleIds: new FormControl(''),
    userRoleIdsForDatabind: new FormControl(''),*/
    alternateContact: new FormControl('', [Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]),
    department: new FormControl(''),
    designation: new FormControl(''),
    admin: new FormControl(''),
    vehicle: new FormControl(''),
    employeeCode: new FormControl(''),
    clientCode: new FormControl(''),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    latLong: new FormControl(''),
    company: new FormControl('')
  });
  updateUserForm = new FormGroup({
    id: new FormControl(''),
    password: new FormControl('', [Validators.required]),
    loginId: new FormControl('', [Validators.required]),
    fisrtName: new FormControl('', [Validators.required]),
    lastName: new FormControl(''),
    gender: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    pincode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(6), Validators.maxLength(6)]),
    aadharNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(12), Validators.maxLength(12)]),
    panNumber: new FormControl('', [Validators.required]),
    contact: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]),
    email: new FormControl('', [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    type: new FormControl(''),
    role: new FormControl(''),
    branch: new FormControl(''),
    alternateContact: new FormControl('', [Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]),
    department: new FormControl(''),
    designation: new FormControl(''),
    admin: new FormControl(''),
    vehicle: new FormControl(''),
    employeeCode: new FormControl(''),
    active: new FormControl('', [Validators.required]),
    clientCode: new FormControl(''),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    latLong: new FormControl(''),
    company: new FormControl(''),
  });

  constructor(private apiserviceService: ApiserviceService, private formBuilder: FormBuilder, private http: HttpClient) {

  }

  async ngOnInit(): Promise<void> {
    this.apiserviceService.urlAuthorization();
    this.getAllBranchRecords();
    this.getAllClientRecords();
    this.getAllRoleRecords();
    this.dtOptions = this.buildDtOptionpkg(AppUrls.USER_SORT_AND_PAGING);
    this.isFirst = true;

    this.selectedItems = [];
    this.selectedBranch = [];
    this.selectedClientCode = [];
    // @ts-ignore
    this.dropdownSettings = {
      singleSelection: false,
      allowSearchFilter: true,
      idField: 'id',
      textField: 'name',
      selectedAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      // allowSelectFilter: this.showFilter,
    };
    this.branchDropdownSettings = {
      singleSelection: false,
        idField: 'id',
        textField: 'name',
        selectedAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3,
       // allowSelectFilter: this.showFilter,
      allowSearchFilter: true
    };
    this.form = this.formBuilder.group({
      file: [''],
      uploadId: [''],
      isUpdate: false
    });
  }
  excalUpload() {
    this.isUpdateBulkupload = false;
    this.isDisplay = false;
    this.isAdd = false;
    this.isFirst = false;
    this.isUpload = true;
  }
  onChangeUserType() {
    if (this.userForm.value.type === 'CLIENT') {
      this.isUserTypeClient = true;
    } else {
      this.isUserTypeClient = false;
    }
  }

  addNew() {
    this.isUpdateBulkupload = false;
    this.isUpload = false;
    this.isadmin = false;
    this.isDisplay = false;
    this.isAdd = true;
    this.isFirst = false;
    this.isUpdate = false;
    this.selectedItems = [];

  }

  cancelButtonAction() {
    this.isUpdateBulkupload = false;
    this.isUpload = false;
    this.isadmin = false;
    this.isDisplay = true;
    this.isAdd = false;
    this.isFirst = false;
    this.isUpdate = false;
  }


  async updateRecords(id) {
    this.isadmin = false;
    await this.findById(id);
    this.isUpdateBulkupload = false;
    this.isUpload = false;
    this.isUpdate = true;
    this.isDisplay = false;
    this.isAdd = false;
    this.isadmin = false;
    if (this.singleRecord.admin !== null && this.singleRecord.admin !== undefined) {
      this.isadmin = this.singleRecord.admin;
    }
    this.updateUserForm.get('type').patchValue(this.singleRecord.type);
    this.updateUserForm.get('gender').patchValue(this.singleRecord.gender);
    this.updateUserForm.get('designation').patchValue(this.singleRecord.designation);
    /*this.updateUserForm.get('clientCode').patchValue(this.singleRecord.clientCode);*/
    if (this.singleRecord.type === 'CLIENT') {
      this.isUserTypeClient = true;
    } else {
      this.isUserTypeClient = false;
    }

    this.selectedItems = this.singleRecord.role;
    this.selectedBranch = this.singleRecord.branch;
    /*for (const item of this.singleRecord.role) {
      this.selectedItems.push(item);
    }*/

    this.pincodeDetails.city = this.singleRecord.city;
    this.pincodeDetails.state = this.singleRecord.state;
    this.pincodeDetails.country = this.singleRecord.country;
  }

  isCheck(elementName) {
    if (elementName === 'Admin') {
      if (this.isadmin) {
        this.isadmin = false;
      } else {
        this.isadmin = true;
      }
      console.log(this.isadmin);
    } else if (elementName === 'UPDATE') {
      if (this.isUpdateBulkupload) {
        this.isUpdateBulkupload = false;
      } else {
        this.isUpdateBulkupload = true;
      }
      console.log(this.isUpdateBulkupload);
    }
  }

  /*isCheck(elementName) {
    if (elementName === 'UPDATE') {
      if (this.isUpdateBulkupload) {
        this.isUpdateBulkupload = false;
      } else {
        this.isUpdateBulkupload = true;
      }
      console.log(this.isUpdateBulkupload);
    }
  }*/

  async deleteRecords(id) {
    this.isUpdate = false;
    await this.deleteById(id);
    this.dtOptions = this.buildDtOptionpkg(AppUrls.USER_DELETE_RECORD);
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
      formData.append('uploadId', 'userBuklUpload');
      formData.append('isUpdate', this.isUpdateBulkupload + '');
      this.upload(formData, 'api/uploadFile').subscribe(
        (res) => res,
        (err) => this.error = err
      );
    }
  }

  async downloadTemplate() {
    const fileName = 'userBuklUpload';
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
    this.userForm.value.admin = this.isadmin;
    const clientType = this.userForm.value.type;
    const clientCode = this.userForm.value.clientCode;
    if (clientType === 'CLIENT' && clientCode === '') {
      alert('Cleint id must be select');
      return false;
    }
    /*let clientId = '';
    for (let item of clientCode) {
      clientId += item.clientName + ',';
    }
    this.userForm.value.clientCode = clientId.slice(0, -1);*/
    const body = JSON.stringify(this.userForm.value);
    console.log(body);
    this.apiserviceService.SpinnerService.show();
    this.apiserviceService.saveData(AppUrls.USER_SAVE_RECORD, body).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
        /*alert('save successfully');*/
        this.userForm.reset();
        this.cancelButtonAction();
        this.rerenderDatatable();
      } else {
        alert(this.getSingleResponse.message);
      }
    });

  }

  onUpdateSubmit() {
    this.updateUserForm.value.admin = this.isadmin;
    const clientType = this.updateUserForm.value.type;
    const clientCode = this.updateUserForm.value.clientCode;
    if (clientType === 'CLIENT' && clientCode === '') {
      alert('Cleint id must be select');
      return false;
    }
/*
    let clientId = '';
    for (let item of clientCode) {
      clientId += item.clientName + ',';
    }
    this.updateUserForm.value.clientCode = clientId.slice(0, -1);*/

    const body = JSON.stringify(this.updateUserForm.value);
    console.log(body);
    this.apiserviceService.SpinnerService.show();
    this.apiserviceService.updateData(AppUrls.USER_UPDATE_RECORD, body).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
        /*alert('update successfully');*/
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
    const url = AppUrls.USER_DELETE_RECORD + id;
    this.deleteRecord = await this.apiserviceService.deleteById(url);
    this.apiserviceService.SpinnerService.hide();
    if (this.deleteRecord.status === 'SUCCESS') {
      this.rerenderDatatable();
    } else {
      alert(this.getSingleResponse.message);
    }
  }

  async findById(id) {
    this.apiserviceService.SpinnerService.show();
    const url = AppUrls.USER_FIND_BY_ID + id;
    this.getSingleResponse = await this.apiserviceService.findById(url);
    this.apiserviceService.SpinnerService.hide();
    if (this.getSingleResponse.status === 'SUCCESS') {
      this.singleRecord = this.getSingleResponse.responseBody;
      console.log(this.singleRecord);
    }

  }

  async getAllRoleRecords() {
    this.apiserviceService.SpinnerService.show();
    this.posts = await this.apiserviceService.fetchAllRecords(AppUrls.USER_GET_ALL_ROLE);
    this.apiserviceService.SpinnerService.hide();
    if (this.posts.status === 'SUCCESS') {
      this.roleList = this.posts.responseBody;
    }
  }

  async getAllBranchRecords() {
    this.apiserviceService.SpinnerService.show();
    this.posts = await this.apiserviceService.fetchAllRecords(AppUrls.GET_ALL_ACTIVE_BRANCH);
    this.apiserviceService.SpinnerService.hide();
    if (this.posts.status === 'SUCCESS') {
      this.branchList = this.posts.responseBody;
      console.log(this.branchList);
    }
  }

  async onDownloadUserReport() {
    const fileName = 'userReport';
    const url = AppUrls.DOWNLOAD_USER_REPORT;
    this.apiserviceService.SpinnerService.show();
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], fileName + '.xlsx', {type: 'application/vnd.ms.excel'});
    saveAs(file);
  }

  async getAllClientRecords() {
    this.apiserviceService.SpinnerService.show();
    this.posts = await this.apiserviceService.fetchAllRecords(AppUrls.CLIENT_FACILITY_GAT_ALL_CLIENT);
    this.apiserviceService.SpinnerService.hide();
    if (this.posts.status === 'SUCCESS') {
      this.clientList = this.posts.responseBody;
      this.isFirst = false;
    }
  }
  async getCityStateCountryByPincode(isUpdate) {
    let pincode = null;
    if (isUpdate === true) {
      pincode = this.updateUserForm.value.pincode;
    } else {
      pincode = this.userForm.value.pincode;
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

 /* keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }*/

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onBranchSelect(item: any) {
    console.log(item);
  }

  onClientCodeSelect(item: any) {
    console.log(item);
  }

  onSelectAll(item: any) {
    console.log(item);
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
      order: [[0, 'desc' ]],
      ajax: (dataTablesParameters: any, callback) => {
        this.apiserviceService.SpinnerService.show();
        this.apiserviceService.saveData(url, dataTablesParameters)
          .subscribe
          (resp => {
            this.apiserviceService.SpinnerService.hide();
            if (resp.data.length > 0) {
              this.users = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              /*this.isAdd = true;*/
              this.users = [];
            }

          });
      },
      columns: [
        {data: 'id'},
        {data: 'fisrtName'},
        {data: 'lastName'},
        {data: 'contact'},
        {data: 'type'},
        {data: 'department'},
        {data: 'address'},
        {data: 'branch'},
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

