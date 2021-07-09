import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiserviceService} from 'src/app/apiservice.service';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {Configration} from './configration';
import {AppUrls} from '../../common/Api_Url_Seeting';
@Component({
  selector: 'app-configration',
  templateUrl: './configration.component.html',
  styleUrls: ['./configration.component.css']
})
export class ConfigrationComponent implements OnInit {
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
  public singleRecord = new Configration();
  public configrations: Configration[];
  public getSingleResponse;
  configrationForm = new FormGroup({
    configType: new FormControl('', [Validators.required]),
    configValue: new FormControl('', [Validators.required]),
    configCode: new FormControl('', [Validators.required]),
    discription: new FormControl(''),
    extra1: new FormControl(''),
    extra2: new FormControl('')
  });
  updateConfigrationForm = new FormGroup({
    id: new FormControl(''),
    configType: new FormControl('', [Validators.required]),
    configValue: new FormControl('', [Validators.required]),
    configCode: new FormControl('', [Validators.required]),
    discription: new FormControl('', [Validators.required]),
    extra1: new FormControl(''),
    extra2: new FormControl(''),
    active: new FormControl('')
  });
  constructor(private apiserviceService: ApiserviceService) {
  }
  async ngOnInit(): Promise<void> {
    this.apiserviceService.urlAuthorization();
    this.dtOptions = this.buildDtOptionpkg(AppUrls.CONFIGRATION_SORT_AND_PAGING);
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
    this.isUpdate = true;
    this.isDisplay = false;
    this.isAdd = false;
    await this.findById(id);
    console.log(id);
  }
  async deleteRecords(id) {
    this.isUpdate = false;
    await this.deleteById(id);
    this.dtOptions = this.buildDtOptionpkg(AppUrls.CONFIGRATION_DELETE_RECORD);
    console.log(id);
  }
  onSubmit() {
    const body = JSON.stringify(this.configrationForm.value);
    this.apiserviceService.SpinnerService.show();
    this.apiserviceService.saveData(AppUrls.CONFIGRATION_SAVE_RECORD, body).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.configrationForm.reset();
      this.cancelButtonAction();
      this.rerenderDatatable();
    });
  }
  onUpdateSubmit() {
    const body = JSON.stringify(this.updateConfigrationForm.value);
    this.apiserviceService.SpinnerService.show();
    this.apiserviceService.updateData(AppUrls.CONFIGRATION_UPDATE_RECORD, body).subscribe(result => {
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
    const url = AppUrls.CONFIGRATION_DELETE_RECORD + id;
    this.apiserviceService.SpinnerService.show();
    this.deleteRecord = await this.apiserviceService.deleteById(url);
    this.apiserviceService.SpinnerService.hide();
    if (this.deleteRecord.status === 'SUCCESS') {
      alert('Record deleted successfully');
      this.rerenderDatatable();
    }
  }
  async findById(id) {
    const url = AppUrls.CONFIGRATION_FIND_BY_ID + id;
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
              this.configrations = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              /*this.isAdd = true;*/
              this.configrations = [];
            }
          });
      },
      columns: [
        {data: 'id'},
        {data: 'configType'},
        {data: 'configValue'},
        {data: 'configCode'},
        {data: 'discription'},
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
