import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiserviceService} from 'src/app/apiservice.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {StatusFlow} from './status-flow.model';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {AppUrls} from '../../common/Api_Url_Seeting';



@Component({
  selector: 'app-status-flow',
  templateUrl: './status-flow.component.html',
  styleUrls: ['./status-flow.component.css']
})
export class StatusFlowComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  disabled = false;
  showFilter = true;
  limitSelection = false;
  selectedItems: any = [];
  dropdownSettings: any = {};

  title = 'datatables';
  public isDisplay = true;
  public isFirst = true;
  public isAdd = false;
  public isUpdate = false;
  public posts;
  public responsedata;
  public allRecords;
  public deleteRecord;
  public singleRecord = new StatusFlow();
  public statusFlows: StatusFlow[];
  public getSingleResponse;
  public TransitionList;

  StatusFlowForm = new FormGroup({

    statusFlowName: new FormControl('', [Validators.required]),
    statusTransitionsList: new FormControl('', [Validators.required])

  });

  updateStatusFlowForm = new FormGroup({
    id: new FormControl(''),
    statusFlowName: new FormControl('', [Validators.required]),
    statusTransitionsList: new FormControl('', [Validators.required]),
    active: new FormControl('', [Validators.required])
  });

  constructor(private apiserviceService: ApiserviceService) {

  }

  async ngOnInit(): Promise<void> {
    this.apiserviceService.urlAuthorization();
    this.dtOptions = this.buildDtOptionpkg(AppUrls.STATUS_FLOW_SORT_AND_PAGING);
    this.getAllStatusTransitioncords();
    this.isFirst = true;

    this.selectedItems = [];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'statusTransitionCode',
      textField: 'statusTransitionName',
      selectedAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      //allowSelectFilter: this.showFilter
      allowSearchFilter: true
    };
  }

  addNew() {
    this.isDisplay = false;
    this.isAdd = true;
    this.isFirst = false;
    this.isUpdate = false;
    this.getAllStatusTransitioncords();
    this.selectedItems = [];
  }

  async updateRecords(id) {
    await this.getAllStatusTransitioncords();
    this.isUpdate = true;
    this.isDisplay = false;
    this.isAdd = false;
    await this.findById(id);
    console.log(id);

    this.selectedItems = [];
    const ides: string[] = this.singleRecord.statusTransitionsList.split(',');
    for (const item of this.TransitionList) {
      if (ides.indexOf(item.statusTransitionCode.toString()) !== -1) {
        this.selectedItems.push(item);
      }
    }
  }

  async deleteRecords(id) {
    this.isUpdate = false;
    await this.deleteById(id);
    this.dtOptions = this.buildDtOptionpkg(AppUrls.API_CONFIG_DELETE_RECORD);
    console.log(id);
  }

  onSubmit() {
    const ids = this.StatusFlowForm.value.statusTransitionsList;
    let finalIdes = '';
    for (const item of ids) {
      finalIdes += item.statusTransitionCode + ',';
    }
    this.StatusFlowForm.value.statusTransitionsList = finalIdes.slice(0, -1);
    const body = JSON.stringify(this.StatusFlowForm.value);
    this.apiserviceService.SpinnerService.show();
    this.apiserviceService.saveData(AppUrls.STATUS_FLOW_SAVE_RECORD, body).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
        /*alert('save successfully');*/
        this.StatusFlowForm.reset();
        this.cancelButtonAction();
        this.rerenderDatatable();
      } else {
        alert(this.getSingleResponse.message);
      }
    });
  }

  onUpdateSubmit() {
    const ids = this.updateStatusFlowForm.value.statusTransitionsList;
    let finalIdes = '';
    for (const item of ids) {
      finalIdes += item.statusTransitionCode + ',';
    }
    this.updateStatusFlowForm.value.statusTransitionsList = finalIdes.slice(0, -1);
    const body = JSON.stringify(this.updateStatusFlowForm.value);
    this.apiserviceService.SpinnerService.show();
    this.apiserviceService.updateData(AppUrls.STATUS_FLOW_UPDATE_RECORD, body).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
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
    const url = AppUrls.STATUS_FLOW_DELETE_RECORD + id;
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
    const url = AppUrls.STATUS_FLOW_FIND_BY_ID + id;
    this.getSingleResponse = await this.apiserviceService.findById(url);
    this.apiserviceService.SpinnerService.hide();
    if (this.getSingleResponse.status === 'SUCCESS') {
      this.singleRecord = this.getSingleResponse.responseBody;
      console.log(this.singleRecord);
    }
  }

  async getAllStatusTransitioncords() {
    this.apiserviceService.SpinnerService.show();
    this.responsedata = await this.apiserviceService.fetchAllRecords('/api/getAllStatusTransition');
    this.apiserviceService.SpinnerService.hide();
    if (this.responsedata.status === 'SUCCESS') {
      this.TransitionList = this.responsedata.responseBody;
    }
  }

  onItemSelect(item: any) {
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
      order: [[0, "desc" ]],
      ajax: (dataTablesParameters: any, callback) => {
        this.apiserviceService.SpinnerService.show();
        this.apiserviceService.saveData(url, dataTablesParameters)
          .subscribe
          (resp => {
            this.apiserviceService.SpinnerService.hide();
            if (resp.data.length > 0) {
              this.statusFlows = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              /*this.isAdd = true;*/
              this.statusFlows = [];
            }

          });
      },
      columns: [
        {data: 'id'},
        {data: 'statusFlowName'},
        {data: 'statusTransitionsList'},
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
