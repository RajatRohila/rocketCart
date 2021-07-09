import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiserviceService} from 'src/app/apiservice.service';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {Status} from '../status/status.model';
import {StatusTransition} from './status-transition';
import {AppUrls} from '../../common/Api_Url_Seeting';

@Component({
  selector: 'app-status-transition',
  templateUrl: './status-transition.component.html',
  styleUrls: ['./status-transition.component.css']
})
export class StatusTransitionComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  title = 'datatables';
  public isDisplay = true;
  public isFirst = false;
  public isAdd = false;
  public isUpdate = false;
  public posts;
  public allRecords;
  public deleteRecord;
  public singleRecord = new StatusTransition();
  public statusTransitions: StatusTransition[];
  public getSingleResponse;
  public statusList;

  statusTansitionForm = new FormGroup({

    statusTransitionName: new FormControl('', [Validators.required]),
    fromStatusCode: new FormControl('', [Validators.required]),
    toStatusCode: new FormControl('', [Validators.required]),
    statusTransitionCode: new FormControl('')
  });

  updatestatusTansitionForm = new FormGroup({
    id: new FormControl(''),
    statusTransitionName: new FormControl('', [Validators.required]),
    fromStatusCode: new FormControl('', [Validators.required]),
    toStatusCode: new FormControl('', [Validators.required]),
    statusTransitionCode: new FormControl(''),
    active: new FormControl('', [Validators.required])
  });

  constructor(private apiserviceService: ApiserviceService) {
  }

  async ngOnInit(): Promise<void> {
    this.apiserviceService.urlAuthorization();

    this.getstatusRecords();
    this.dtOptions = this.buildDtOptionpkg(AppUrls.STATUS_TRANSITION_SORT_AND_PAGING);
    this.isFirst = true;
  }

  addNew() {
    this.isDisplay = false;
    this.isAdd = true;
    this.isFirst = false;
    this.isUpdate = false;
    this.getstatusRecords();

  }

  cancelButtonAction() {
    this.isDisplay = true;
    this.isAdd = false;
    this.isFirst = false;
    this.isUpdate = false;
  }

  async updateRecords(id) {
    await this.getstatusRecords();
    await this.findById(id);
    console.log(id);
    this.isUpdate = true;
    this.isDisplay = false;
    this.isAdd = false;
    this.updatestatusTansitionForm.get('toStatusCode').patchValue(this.singleRecord.toStatusCode);
    this.updatestatusTansitionForm.get('fromStatusCode').patchValue(this.singleRecord.fromStatusCode);
  }

  async deleteRecords(id) {
    this.isUpdate = false;
    await this.deleteById(id);
    this.dtOptions = this.buildDtOptionpkg(AppUrls.STATUS_TRANSITION_DELETE_RECORD);
    console.log(id);
  }

  onSubmit() {
    this.apiserviceService.SpinnerService.show();
    const body = JSON.stringify(this.statusTansitionForm.value);
    this.apiserviceService.saveData(AppUrls.STATUS_TRANSITION_SAVE_RECORD, body).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
        /*alert('save successfully');*/
        this.statusTansitionForm.reset();
        this.cancelButtonAction();
        this.rerenderDatatable();
      } else {
        alert(this.getSingleResponse.message);
      }
    });
  }

  onUpdateSubmit() {
    this.apiserviceService.SpinnerService.show();
    const body = JSON.stringify(this.updatestatusTansitionForm.value);
    this.apiserviceService.updateData(AppUrls.STATUS_TRANSITION_UPDATE_RECORD, body).subscribe(result => {
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
    const url = AppUrls.STATUS_TRANSITION_DELETE_RECORD + id;
    this.deleteRecord = await this.apiserviceService.deleteById(url);
    this.apiserviceService.SpinnerService.hide();
    if (this.deleteRecord.status === 'SUCCESS') {
      //window.location.reload();
      alert('Record deleted successfully');
      this.rerenderDatatable();
    }
  }

  async findById(id) {
    this.apiserviceService.SpinnerService.show();
    const url = AppUrls.STATUS_TRANSITION_FIND_BY_ID + id;
    this.getSingleResponse = await this.apiserviceService.findById(url);
    this.apiserviceService.SpinnerService.hide();
    this.singleRecord = this.getSingleResponse.responseBody;
    console.log(this.singleRecord);
  }

  async getstatusRecords() {
    this.apiserviceService.SpinnerService.show();
    this.posts = await this.apiserviceService.fetchAllRecords('/api/getAllStatus');
    this.apiserviceService.SpinnerService.hide();
    if (this.posts.status === 'SUCCESS') {
      this.statusList = this.posts.responseBody;
      this.isFirst = false;
      this.isUpdate = false;
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
              this.statusTransitions = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              /*this.isAdd = true;*/
              this.statusTransitions = [];
            }

          });
      },
      columns: [
        {data: 'id'},
        {data: 'statusTransitionName'},
        {data: 'fromStatusCode'},
        {data: 'toStatusCode'},
        {data: 'statusTransitionCode'},
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
