import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiserviceService} from 'src/app/apiservice.service';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {CourierPriority} from './courier-priority';
import {AppUrls} from '../../common/Api_Url_Seeting';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-courier-priority',
  templateUrl: './courier-priority.component.html',
  styleUrls: ['./courier-priority.component.css']
})
export class CourierPriorityComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  title = 'datatables';
  public isDisplay = true;
  public isFirst = true;
  public isAdd = false;
  public isUpdate = false;
  public isVisibleCourierPriority = false;
  public posts;
  public responsedata;
  public allRecords;
  public deleteRecord;
  public singleRecord = new CourierPriority();
  public courierPrioritys: CourierPriority[];
  public getSingleResponse;
  public serviceTypeArr = [];
  public clientArray = [];
  public allowedCourierMap = new Map();
  public allowedCourier = [];


  courierPriorityForm = new FormGroup({
    courierPriorityName: new FormControl('', [Validators.required]),
    prioritys: new FormControl(''),
    clientId: new FormControl('', [Validators.required]),
    serviceTypeId: new FormControl('', [Validators.required]),

  });

  updateCourierPriorityForm = new FormGroup({
    id: new FormControl(''),
    courierPriorityName: new FormControl('', [Validators.required]),
    prioritys: new FormControl(''),
    clientId: new FormControl('', [Validators.required]),
    serviceTypeId: new FormControl('', [Validators.required]),
  });

  constructor(private apiserviceService: ApiserviceService) {

  }

  async ngOnInit(): Promise<void> {
    this.apiserviceService.urlAuthorization();

    this.dtOptions = this.buildDtOptionpkg(AppUrls.COURIER_PRIORITY_SORT_AND_PAGING);
    this.getAllClientRecords();
    this.isFirst = true;

  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.allowedCourier, event.previousIndex, event.currentIndex);
    console.log(this.allowedCourier);
  }

  addNew() {
    this.isDisplay = false;
    this.isAdd = true;
    this.isFirst = false;
    this.isUpdate = false;

  }
  async updateRecords(id) {
    this.isVisibleCourierPriority = false;
    this.isUpdate = true;
    this.isDisplay = false;
    this.isAdd = false;
    await this.findById(id);
    this.updateCourierPriorityForm.get('clientId').patchValue(this.singleRecord.clientId);
    this.getClientServiceType('updateClientId');
    this.updateCourierPriorityForm.get('serviceTypeId').patchValue(this.singleRecord.serviceTypeId);
    this.getClientAllowedCourierForUpdate(this.singleRecord.clientId, this.singleRecord.serviceTypeId);
    console.log(id);
  }

  async deleteRecords(id) {
    this.isUpdate = false;
    await this.deleteById(id);
    this.dtOptions = this.buildDtOptionpkg(AppUrls.COURIER_PRIORITY_DELETE_RECORD);
  }

  onSubmit() {
    const courierCode = this.allowedCourier.toString();
    this.courierPriorityForm.value.prioritys = courierCode;
    const body = JSON.stringify(this.courierPriorityForm.value);
    this.apiserviceService.SpinnerService.show();
    this.apiserviceService.saveData(AppUrls.COURIER_PRIORITY_SAVE_RECORD, body).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
        this.courierPriorityForm.reset();
        this.cancelButtonAction();
        this.rerenderDatatable();
      } else {
        alert(this.getSingleResponse.message);
      }
    });
  }

  onUpdateSubmit() {
      const courierCode = this.allowedCourier.toString();
      this.courierPriorityForm.value.prioritys = courierCode;
      const body = JSON.stringify(this.updateCourierPriorityForm.value);
      this.apiserviceService.SpinnerService.show();
      this.apiserviceService.updateData(AppUrls.COURIER_PRIORITY_UPDATE_RECORD, body).subscribe(result => {
        this.apiserviceService.SpinnerService.hide();
        this.getSingleResponse = result;
        if (this.getSingleResponse.status === 'SUCCESS') {
          this.rerenderDatatable();
          /*this.dtOptions = this.buildDtOptionpkg(AppUrls.COURIER_PRIORITY_SORT_AND_PAGING);*/
        } else {
          alert(this.getSingleResponse.message);
        }
    });
  }

  cancelButtonAction() {
    this.isDisplay = true;
    this.isAdd = false;
    this.isFirst = false;
    this.isUpdate = false;
    this.serviceTypeArr = [];
    this.allowedCourier = [];
    this.isVisibleCourierPriority = false;
  }

  async deleteById(id) {
    const url = AppUrls.COURIER_PRIORITY_DELETE_RECORD + id;
    this.apiserviceService.SpinnerService.show();
    this.deleteRecord = await this.apiserviceService.deleteById(url);
    this.apiserviceService.SpinnerService.hide();
    if (this.deleteRecord.status === 'SUCCESS') {
      this.rerenderDatatable();
    } else {
      alert(this.getSingleResponse.message);
    }
  }

  async findById(id) {
    const url = AppUrls.COURIER_PRIORITY_FIND_BY_ID + id;
    this.apiserviceService.SpinnerService.show();
    this.getSingleResponse = await this.apiserviceService.findById(url);
    this.apiserviceService.SpinnerService.hide();
    if (this.getSingleResponse.status === 'SUCCESS') {
      this.singleRecord = this.getSingleResponse.responseBody;
    }
  }
  async getClientServiceType(clID) {
    const clientId = (<HTMLInputElement>document.getElementById(clID)).value;
    const url = AppUrls.GET_CLIENT_SERVICE_TYPE + '?clientId=' + clientId;
    this.apiserviceService.SpinnerService.show();
    this.getSingleResponse = await this.apiserviceService.getCall(url);
    this.apiserviceService.SpinnerService.hide();
    if (this.getSingleResponse.status === 'SUCCESS') {
      this.serviceTypeArr = this.getSingleResponse.responseBody;
    } else {
      this.serviceTypeArr =  [];
    }
  }
  async getClientAllowedCourier(clID, servId) {
    const clientId = (<HTMLInputElement>document.getElementById(clID)).value;
    const serviceId = (<HTMLInputElement>document.getElementById(servId)).value;
    const url = AppUrls.GET_CLIENT_ALLOWED_COURIER + '?clientId=' + clientId + '&serviceId=' + serviceId;
    this.apiserviceService.SpinnerService.show();
    this.getSingleResponse = await this.apiserviceService.getCall(url);
    this.apiserviceService.SpinnerService.hide();
    this.isVisibleCourierPriority = false;
    if (this.getSingleResponse.status === 'SUCCESS') {
      this.isVisibleCourierPriority = true;
      this.allowedCourierMap = this.getSingleResponse.responseBody;
      this.allowedCourier = [];
      // tslint:disable-next-line:forin
      for (const key in this.allowedCourierMap ) {
        this.allowedCourier.push(key);
      }
    } else {
      this.allowedCourier = [];
    }
  }

  async getClientAllowedCourierForUpdate(clientId, serviceId) {
    const url = AppUrls.GET_CLIENT_ALLOWED_COURIER + '?clientId=' + clientId + '&serviceId=' + serviceId;
    this.apiserviceService.SpinnerService.show();
    this.getSingleResponse = await this.apiserviceService.getCall(url);
    this.apiserviceService.SpinnerService.hide();
    this.isVisibleCourierPriority = false;
    if (this.getSingleResponse.status === 'SUCCESS') {
      this.isVisibleCourierPriority = true;
      this.allowedCourierMap = this.getSingleResponse.responseBody;
      this.allowedCourier = [];
      // tslint:disable-next-line:forin
      for (const key in this.allowedCourierMap ) {
        this.allowedCourier.push(key);
      }
    } else {
      this.allowedCourier = [];
    }
  }

  async getAllClientRecords() {
    this.apiserviceService.SpinnerService.show();
    this.posts = await this.apiserviceService.fetchAllRecords(AppUrls.CLIENT_FACILITY_GAT_ALL_CLIENT);
    this.apiserviceService.SpinnerService.hide();
    if (this.posts.status === 'SUCCESS') {
      this.clientArray = this.posts.responseBody;
      this.isFirst = false;
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
      order: [[0, "desc" ]],
      ajax: (dataTablesParameters: any, callback) => {
        this.apiserviceService.SpinnerService.show();
        this.apiserviceService.saveData(url, dataTablesParameters)
          .subscribe
          (resp => {
            this.apiserviceService.SpinnerService.hide();
            if (resp.data.length > 0) {
              this.courierPrioritys = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              /*this.isAdd = true;*/
              this.courierPrioritys = [];
            }

          });
      },
      columns: [
        {data: 'id'},
        {data: 'courierPriorityCode'},
        {data: 'courierPriorityName'},
        {data: 'prioritys'},
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
