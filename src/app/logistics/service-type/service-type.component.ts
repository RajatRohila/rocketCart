import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiserviceService} from 'src/app/apiservice.service';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {ServiceType} from './service-type';
import {AppUrls} from '../../common/Api_Url_Seeting';


@Component({
  selector: 'app-service-type',
  templateUrl: './service-type.component.html',
  styleUrls: ['./service-type.component.css']
})
export class ServiceTypeComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  title = 'datatables';
  public isDisplay = true;
  public isFirst = true;
  public isAdd = false;
  public isUpdate = false;
  public posts;
  public responsedata;
  public allRecords;
  public deleteRecord;
  public singleRecord = new ServiceType();
  public servicetypes: ServiceType[];
  public getSingleResponse;

  serviceTypeForm = new FormGroup({
    serviceCode: new FormControl('', [Validators.required]),
    serviceName: new FormControl('', [Validators.required]),
    extra: new FormControl(''),

  });

  updateServiceTypeForm = new FormGroup({
    id:  new FormControl(''),
    serviceCode: new FormControl('', [Validators.required]),
    serviceName: new FormControl('', [Validators.required]),
    extra: new FormControl(''),
    active: new FormControl('', [Validators.required]),
  });

  constructor(private apiserviceService: ApiserviceService) {

  }

  async ngOnInit(): Promise<void> {
    this.apiserviceService.urlAuthorization();
    this.dtOptions = this.buildDtOptionpkg(AppUrls.SERVICE_TYPE_SORT_AND_PAGING);
    this.isFirst = true;
  }

  addNew() {
    this.isDisplay = false;
    this.isAdd = true;
    this.isFirst = false;
    this.isUpdate = false;

  }
  async updateRecords(id) {
    this.isUpdate = true;
    this.isDisplay = false;
    this.isAdd = false;
    await this.findById(id);
  }

  async deleteRecords(id) {
    this.isUpdate = false;
    await this.deleteById(id);
    this.dtOptions = this.buildDtOptionpkg(AppUrls.SERVICE_TYPE_DELETE_RECORD);
  }

  onSubmit() {
    this.apiserviceService.SpinnerService.show();
    const body = JSON.stringify(this.serviceTypeForm.value);
    this.apiserviceService.saveData(AppUrls.SERVICE_TYPE_SAVE_RECORD, body).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
        /*alert('save successfully');*/
        this.serviceTypeForm.reset();
        this.cancelButtonAction();
        this.rerenderDatatable();
      } else {
        alert(this.getSingleResponse.message);
      }
    });
  }



  onUpdateSubmit() {
    this.apiserviceService.SpinnerService.show();
    const body = JSON.stringify(this.updateServiceTypeForm.value);
    this.apiserviceService.updateData(AppUrls.SERVICE_TYPE_UPDATE_RECORD, body).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
       /* alert(' update successfully ');*/
        this.cancelButtonAction();
        this.rerenderDatatable();
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
  }
  async deleteById(id) {
    this.apiserviceService.SpinnerService.show();
    const url = AppUrls.SERVICE_TYPE_DELETE_RECORD + id;
    this.deleteRecord = await this.apiserviceService.deleteById(url);
    this.apiserviceService.SpinnerService.hide();
    if (this.deleteRecord.status === 'SUCCESS') {
      alert('Record deleted successfully');
      this.rerenderDatatable();
    } else {
      alert(this.getSingleResponse.message);
    }
  }

  async findById(id) {
    this.apiserviceService.SpinnerService.show();
    const url = AppUrls.SERVICE_TYPE_FIND_BY_ID + id;
    this.getSingleResponse = await this.apiserviceService.findById(url);
    this.apiserviceService.SpinnerService.hide();
    if (this.getSingleResponse.status === 'SUCCESS') {
      this.singleRecord = this.getSingleResponse.responseBody;
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
              this.servicetypes = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              /*this.isAdd = true;*/
              this.servicetypes = [];
            }

          });
      },
      columns: [
        {data: 'id'},
        {data: 'serviceCode'},
        {data: 'serviceName'},
        {data: 'extra'},
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

