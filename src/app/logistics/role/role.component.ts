import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiserviceService} from 'src/app/apiservice.service';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {Role} from './role';
import {AppUrls} from '../../common/Api_Url_Seeting';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

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
  public singleRecord = new Role();
  public roles: Role[];
  public getSingleResponse;
  public pageList;

  pageRoleForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    pages: new FormControl('', [Validators.required]),
    discription: new FormControl('')

  });
  updatePageRoleForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    pages: new FormControl('', [Validators.required]),
    discription: new FormControl(''),
    active: new FormControl('', [Validators.required])
  });

  constructor(private apiserviceService: ApiserviceService) {

  }

  async ngOnInit(): Promise<void> {
    this.apiserviceService.urlAuthorization();
    this.dtOptions = this.buildDtOptionpkg(AppUrls.ROLE_SORT_AND_PAGING);
    console.log(this.posts);

    this.selectedItems = [];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'page',
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
    this.getAllPageRecords();
    this.selectedItems = [];
  }
  async updateRecords(id) {
    await this.getAllPageRecords();
    this.isUpdate = true;
    this.isDisplay = false;
    this.isAdd = false;
    await this.findById(id);
    console.log(id);

    this.selectedItems = [];
    console.log(this.selectedItems);
    console.log(this.singleRecord.pages);
    for (const item of this.singleRecord.pages) {
      this.selectedItems.push(item);
    }
    console.log(this.selectedItems);
  }

  async deleteRecords(id) {
    this.isUpdate = false;
    await this.deleteById(id);
    this.dtOptions = this.buildDtOptionpkg(AppUrls.ROLE_DELETE_RECORD);
    console.log(id);
  }

  onSubmit() {
    this.apiserviceService.SpinnerService.show();
    const body = JSON.stringify(this.pageRoleForm.value);
    this.apiserviceService.saveData(AppUrls.ROLE_SAVE_RECORD, body).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
        /*alert('save successfully');*/
        this.pageRoleForm.reset();
        this.cancelButtonAction();
        this.rerenderDatatable();
      } else {
        alert(this.getSingleResponse.message);
      }
    });
  }

  onUpdateSubmit() {
    this.apiserviceService.SpinnerService.show();
    const body = JSON.stringify(this.updatePageRoleForm.value);
    this.apiserviceService.updateData(AppUrls.ROLE_UPDATE_RECORD, body).subscribe(result => {
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
    const url = AppUrls.ROLE_DELETE_RECORD + id;
    this.apiserviceService.SpinnerService.show();
    this.deleteRecord = await this.apiserviceService.deleteById(url);
    this.apiserviceService.SpinnerService.hide();
    if (this.deleteRecord.status === 'SUCCESS') {
      alert('Record deleted successfully');
      this.rerenderDatatable();
    }
  }

  async findById(id) {
    const url = AppUrls.ROLE_FIND_BY_ID + id;
    this.apiserviceService.SpinnerService.show();
    this.getSingleResponse = await this.apiserviceService.findById(url);
    this.apiserviceService.SpinnerService.hide();
    this.singleRecord = this.getSingleResponse.responseBody;
    console.log(this.singleRecord);
  }

  async getAllPageRecords() {
    this.apiserviceService.SpinnerService.show();
    this.posts = await this.apiserviceService.fetchAllRecords(AppUrls.ROLE_GET_ALL_PAGE);
    this.apiserviceService.SpinnerService.hide();
    if (this.posts.status === 'SUCCESS') {
      this.pageList = this.posts.responseBody;
      this.isDisplay = false;
      this.isFirst = false;
      this.isUpdate = false;
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
              this.roles = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              /*this.isAdd = true;*/
              this.roles = [];
            }

          });
      },
      columns: [
        {data: 'id'},
        {data: 'name'},
        {data: 'pages'},
        {data: 'discription'},
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
