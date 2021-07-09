import {Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {ApiserviceService} from 'src/app/apiservice.service';
import {Bulkmaster} from './bulk-master.model';
import {AppUrls} from '../../common/Api_Url_Seeting';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-bulkmaster',
  templateUrl: './bulkmaster.component.html',
  styleUrls: ['./bulkmaster.component.css']
})
export class BulkmasterComponent implements OnInit {

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
  public isFirst = false;
  public isAdd = false;
  public isUpdate = false;
  public posts;
  public allRecords;
  public deleteRecord;
  public singleRecord = new Bulkmaster();
  public bulkMasters: Bulkmaster[];
  public getSingleResponse;
  public bulkHeaderList;
  public bulkHeaderSequencCodes;
  public bulkHeaderSequencCodeList = [];


  bulkMasterForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    bulkHeaderIds: new FormControl(''),
    bulkHeaderSequenceIds: new FormControl(''),
   /* bulkHeaderSupportingIds: new FormControl('', [Validators.required])*/
  });

  updateBulkMasterForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    bulkHeaderIds: new FormControl('', [Validators.required]),
    bulkHeaderSequenceIds: new FormControl(''),
    /*bulkHeaderSupportingIds: new FormControl('', [Validators.required]),*/
    active: new FormControl('', [Validators.required])
  });

  constructor(private apiserviceService: ApiserviceService) {

  }

  ngOnInit(): void {
    this.apiserviceService.urlAuthorization();

    this.dtOptions = this.buildDtOptionpkg(AppUrls.BULK_MASTER_SORT_AND_PAGING);
    this.selectedItems = [];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'headerCode',
      textField: 'displayName',
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
    this.getAllbulkHeaderRecords();
    this.selectedItems = [];
  }

  async updateRecords(id) {
    this.onDeselectAll();
    await this.getAllbulkHeaderRecords();
    await this.findById(id);
    this.isUpdate = true;
    this.isDisplay = false;
    this.isAdd = false;
    this.bulkHeaderSequencCodes = this.singleRecord.bulkHeaderSequenceIds;
    if (this.bulkHeaderSequencCodes != null && this.bulkHeaderSequencCodes !== undefined) {
      this.bulkHeaderSequencCodeList = this.bulkHeaderSequencCodes.split(',');
    }
    this.selectedItems = [];
    const ides: string[] = this.singleRecord.bulkHeaderIds.split(',');
    for (const item of this.bulkHeaderList) {
      if (ides.indexOf(item.headerCode.toString()) !== -1) {
        this.selectedItems.push(item);
      }
    }

  }

  async deleteRecords(id) {
    this.isUpdate = false;
    await this.deleteById(id);
    this.dtOptions = this.buildDtOptionpkg(AppUrls.BULK_MASTER_SORT_AND_PAGING);
    console.log(id);
  }

  onSubmit() {
    const ids = this.bulkMasterForm.value.bulkHeaderIds;
    let finalIdes = '';
    for (const item of ids) {
      console.log(item);
      finalIdes += item.headerCode + ',';
    }
    this.bulkMasterForm.value.bulkHeaderIds = finalIdes.slice(0, -1);
    const body = JSON.stringify(this.bulkMasterForm.value);
    this.apiserviceService.SpinnerService.show();
    this.apiserviceService.saveData(AppUrls.BULK_MASTER_SAVE_RECORD, body).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
        /*alert('save successfully');*/
        this.bulkMasterForm.reset();
        this.cancelButtonAction();
        this.rerenderDatatable();
        this.bulkHeaderSequencCodeList = [];
        //this.dtOptions = this.buildDtOptionpkg(AppUrls.BULK_MASTER_SORT_AND_PAGING);
      } else {
        alert(this.getSingleResponse.message);
      }
    });
  }

  onUpdateSubmit() {
    const ids = this.updateBulkMasterForm.value.bulkHeaderIds;
    let finalIdes = '';
    for (const item of ids) {
      finalIdes += item.headerCode + ',';
    }
    this.updateBulkMasterForm.value.bulkHeaderIds = finalIdes.slice(0, -1);
    const body = JSON.stringify(this.updateBulkMasterForm.value);
    this.apiserviceService.SpinnerService.show();
    this.apiserviceService.updateData(AppUrls.BULK_MASTER_UPDATE_RECORD, body).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
        /*alert('update successfully');*/
        this.dtOptions = this.buildDtOptionpkg(AppUrls.BULK_MASTER_SORT_AND_PAGING);
        this.isDisplay = true;
        this.isUpdate = false;
        this.rerenderDatatable();
        this.bulkHeaderSequencCodeList = [];
      } else {
        alert(this.getSingleResponse.message);
      }

    });
  }

  cancelButtonAction() {
    this.onDeselectAll;
    this.isDisplay = true;
    this.isAdd = false;
    this.isFirst = false;
    this.isUpdate = false;
  }

  async deleteById(id) {
    const url = AppUrls.BULK_MASTER_DELETE_RECORD + id;
    this.apiserviceService.SpinnerService.show();
    this.deleteRecord = await this.apiserviceService.deleteById(url);
    this.apiserviceService.SpinnerService.hide();
    if (this.deleteRecord.status === 'SUCCESS') {
      alert('Record deleted successfully');
      this.rerenderDatatable();
    }
  }

  async findById(id) {
    const url = AppUrls.BULK_MASTER_FIND_BY_ID + id;
    this.apiserviceService.SpinnerService.show();
    this.getSingleResponse = await this.apiserviceService.findById(url);
    this.apiserviceService.SpinnerService.hide();
    this.singleRecord = this.getSingleResponse.responseBody;
    console.log(this.singleRecord);
  }

  async getAllbulkHeaderRecords() {
    this.apiserviceService.SpinnerService.show();
    this.posts = await this.apiserviceService.fetchAllRecords(AppUrls.BULK_MASTER_GET_ALL_BULK_HEADER);
    this.apiserviceService.SpinnerService.hide();
    if (this.posts.status === 'SUCCESS') {
      this.bulkHeaderList = this.posts.responseBody;
      this.isDisplay = false;
      this.isFirst = false;
      this.isUpdate = false;
    }
  }

  onItemSelect(item: any) {
    if (item !== undefined && item !== null) {
      this.bulkHeaderSequencCodeList.push(item.headerCode);
    }
    this.bulkHeaderSequencCodes = this.bulkHeaderSequencCodeList.toString();
    /*this.bulkMasterForm.value.bulkHeaderSequenceIds = this.bulkHeaderSequencCodeList.toString();*/
    console.log(this.bulkHeaderSequencCodes);
  }
  onDeSelect(item: any) {
    if (item !== undefined && item !== null) {
      this.bulkHeaderSequencCodeList.splice(this.bulkHeaderSequencCodeList.indexOf(item.headerCode), 1);

    }
    this.bulkHeaderSequencCodes = this.bulkHeaderSequencCodeList.toString();
  }

  onSelectAll(items: any) {
  this.bulkHeaderSequencCodeList = [];
    for (const item of items) {
      this.bulkHeaderSequencCodeList.push(item.headerCode);
    }
    // console.log(item);
    this.bulkHeaderSequencCodes = this.bulkHeaderSequencCodeList.toString();
  }
  onDeselectAll() {
    this.bulkHeaderSequencCodeList = [];
    this.bulkHeaderSequencCodes = '';
  }
  onChangeHeaderValue() {
    this.bulkHeaderSequencCodeList = this.bulkHeaderSequencCodes.split(',');
    this.bulkHeaderSequencCodes = this.bulkHeaderSequencCodeList.toString();

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
              this.bulkMasters = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              /*this.isAdd = true;*/
              this.bulkMasters = [];
            }

          });
      },
      columns: [
        {data: 'id'},
        {data: 'name'},
        {data: 'bulkHeaderIds'},
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
