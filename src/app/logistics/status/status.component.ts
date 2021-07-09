import {Component, OnInit, ViewChild} from '@angular/core';
import {Status} from './status.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiserviceService} from 'src/app/apiservice.service';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {AppUrls} from '../../common/Api_Url_Seeting';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {


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
  public singleRecord = new Status();
  public statuses: Status[];
  public getSingleResponse;
  statusList = ['PACKET_STATUS', 'BAG_STATUS', 'DRS_STATUS', 'MANIFEST_STATUS'];

  statusForm = new FormGroup({
    statusName: new FormControl('', [Validators.required]),
    statusCode: new FormControl('', [Validators.required]),
    statusType: new FormControl('', [Validators.required]),
    displayName: new FormControl('', [Validators.required]),
    external: new FormControl('')

  });
  updateStatusForm = new FormGroup({
    id: new FormControl(''),
    statusName: new FormControl('', [Validators.required]),
    statusCode: new FormControl('', [Validators.required]),
    statusType: new FormControl('', [Validators.required]),
    displayName: new FormControl('', [Validators.required]),
    external: new FormControl(''),
    active: new FormControl('', [Validators.required])
  });

  constructor(private apiserviceService: ApiserviceService) {

  }

  async ngOnInit(): Promise<void> {
    this.apiserviceService.urlAuthorization();
    this.dtOptions = this.buildDtOptionpkg(AppUrls.STATUS_SORT_AND_PAGING);
    this.isFirst = true;

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
    this.updateStatusForm.get('statusType').patchValue(this.singleRecord.statusType);
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
    this.dtOptions = this.buildDtOptionpkg(AppUrls.STATUS_DELETE_RECORD);
    console.log(id);
  }

  onSubmit() {
    this.statusForm.value.external = this.isExternal;
    const body = JSON.stringify(this.statusForm.value);
    this.apiserviceService.SpinnerService.show();
    this.apiserviceService.saveData(AppUrls.STATUS_SAVE_RECORD, body).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
       /* alert('save successfully');*/
        this.statusForm.reset();
        this.cancelButtonAction();
        this.rerenderDatatable();
      } else {
        alert(this.getSingleResponse.message);
      }
    });
  }

  onUpdateSubmit() {
    this.updateStatusForm.value.external = this.isExternal;
    const body = JSON.stringify(this.updateStatusForm.value);
    this.apiserviceService.SpinnerService.show();
    this.apiserviceService.updateData(AppUrls.STATUS_UPDATE_RECORD, body).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
        /*alert('update successfully');*/
        this.cancelButtonAction();
        this.rerenderDatatable();
      } else {
        alert(this.getSingleResponse.message);
      }

    });
  }

  async deleteById(id) {
    this.apiserviceService.SpinnerService.show();
    const url = AppUrls.STATUS_DELETE_RECORD + id;
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
    const url = AppUrls.STATUS_FIND_BY_ID + id;
    this.getSingleResponse = await this.apiserviceService.findById(url);
    this.apiserviceService.SpinnerService.hide();
    if (this.getSingleResponse.status === 'SUCCESS') {
      this.singleRecord = this.getSingleResponse.responseBody;
      console.log(this.singleRecord);
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
              this.statuses = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              /*this.isAdd = true;*/
              this.statuses = [];
            }

          });
      /*pagingType: 'full_numbers',
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
              this.statuses = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              this.statuses = [];
              /!*this.isAdd = true;*!/
            }

          });*/
      },
      columns: [
        {data: 'id'},
        {data: 'statusName'},
        {data: 'statusCode'},
        {data: 'statusType'},
        {data: 'displayName'},
        {data: 'external'},
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
}
