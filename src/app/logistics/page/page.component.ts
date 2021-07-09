import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiserviceService} from 'src/app/apiservice.service';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {Page} from './page';
import {AppUrls} from '../../common/Api_Url_Seeting';


@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {

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
  public singleRecord = new Page();
  public pages: Page[];
  public getSingleResponse;

  pageForm = new FormGroup({

    module: new FormControl('', [Validators.required]),
    subModule: new FormControl('', [Validators.required]),
    page: new FormControl('', [Validators.required]),
    displayName: new FormControl('', [Validators.required]),
    pageURL: new FormControl('', [Validators.required]),
    description: new FormControl('')

  });

  updatePageForm = new FormGroup({
    id: new FormControl(''),
    module: new FormControl('', [Validators.required]),
    subModule: new FormControl('', [Validators.required]),
    page: new FormControl('', [Validators.required]),
    displayName: new FormControl('', [Validators.required]),
    pageURL: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    active: new FormControl('')
  });

  constructor(private apiserviceService: ApiserviceService) {

  }

  async ngOnInit(): Promise<void> {
    this.apiserviceService.urlAuthorization();

    this.dtOptions = this.buildDtOptionpkg(AppUrls.PAGE_SORT_AND_PAGING);
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
    this.isUpdate = true;
    this.isDisplay = false;
    this.isAdd = false;
    await this.findById(id);
    console.log(id);
  }

  async deleteRecords(id) {
    this.isUpdate = false;
    await this.deleteById(id);
    this.dtOptions = this.buildDtOptionpkg(AppUrls.PAGE_SORT_AND_PAGING);
    console.log(id);
  }

  onSubmit() {
    this.apiserviceService.SpinnerService.show();
    const body = JSON.stringify(this.pageForm.value);
    this.apiserviceService.saveData(AppUrls.PAGE_SAVE_RECORD, body).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
        /*alert('save successfully');*/
        this.pageForm.reset();
        this.cancelButtonAction();
        this.rerenderDatatable();
        /*this.dtOptions = this.buildDtOptionpkg(AppUrls.PAGE_SORT_AND_PAGING);*/
      } else {
        alert(this.getSingleResponse.message);
      }
    });
  }

  onUpdateSubmit() {
    const body = JSON.stringify(this.updatePageForm.value);
    this.apiserviceService.SpinnerService.show();
    this.apiserviceService.updateData(AppUrls.PAGE_UPDATE_RECORD, body).subscribe(result => {
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

  async deleteById(id) {
    const url = AppUrls.PAGE_DELETE_RECORD + id;
    this.apiserviceService.SpinnerService.show();
    this.deleteRecord = await this.apiserviceService.deleteById(url);
    this.apiserviceService.SpinnerService.hide();
    if (this.deleteRecord.status === 'SUCCESS') {
      alert('Record deleted successfully');
      this.rerenderDatatable();
    }
  }

  async findById(id) {
    const url = AppUrls.PAGE_FIND_BY_ID + id;
    this.apiserviceService.SpinnerService.show();
    this.getSingleResponse = await this.apiserviceService.findById(url);
    this.apiserviceService.SpinnerService.hide();
    this.singleRecord = this.getSingleResponse.responseBody;
    console.log(this.singleRecord);
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
              this.pages = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              /*this.isAdd = true;*/
              this.pages = [];
            }

          });
      },
      columns: [
        {data: 'id'},
        {data: 'module'},
        {data: 'subModule'},
        {data: 'page'},
        {data: 'displayName'},
        {data: 'pageURL'},
        {data: 'description'},
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
