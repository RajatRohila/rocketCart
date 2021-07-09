import {Component, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiserviceService} from '../../apiservice.service';
import {AppUrls} from '../../common/Api_Url_Seeting';
import { RateCardType } from './rateCardType.model';

@Component({
  selector: 'app-rate-card-type',
  templateUrl: './rate-card-type.component.html',
  styleUrls: ['./rate-card-type.component.css']
})
export class RateCardTypeComponent implements OnInit {

  title = 'datatables';
  rateCardType: RateCardType[];
  public isDisplay = true;
  public isFirst = false;
  public isAdd = false;
  public isUpdate = false;
  public posts;
  public allRecords;
  public deleteRecord;
  public singleRecord = new RateCardType();
  public getSingleResponse;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  // dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = {};
  rateCardTypeForm = new FormGroup({
    typeName: new FormControl('', [Validators.required]),
    typeCode: new FormControl('', [Validators.required])

  });

  updateRateCardTypeForm = new FormGroup({
    id: new FormControl(''),
    typeName: new FormControl('', [Validators.required]),
    typeCode: new FormControl('', [Validators.required]),
    active: new FormControl('', [Validators.required])
  });

  constructor(private apiserviceService: ApiserviceService ) {}

  ngOnInit(): void {
    this.apiserviceService.urlAuthorization();

    this.dtOptions = this.buildDtOptionpkg(AppUrls.GET_ALL_RATE_CARD_TYPE);
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
              this.rateCardType = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              /*this.isAdd = true;*/
              this.rateCardType = [];
            }

          });
      },
      columns: [
        {data: 'id'},
        {data: 'typeName'},
        {data: 'typeCode'},
        {data: 'active'},
      ]
    };
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
  }


  onSubmit() {
    const body = JSON.stringify(this.rateCardTypeForm.value);
    this.apiserviceService.SpinnerService.show();
    this.apiserviceService.saveData(AppUrls.RATE_CARD_TYPE_SAVE_RECORD, body).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
        this.rateCardTypeForm.reset();
        this.cancelButtonAction();
        this.rerenderDatatable();
      } else {
        alert(this.getSingleResponse.message);
      }
    });
  }

  onUpdateSubmit() {
    const body = JSON.stringify(this.updateRateCardTypeForm.value);
    this.apiserviceService.SpinnerService.show();
    this.apiserviceService.updateData(AppUrls.RATE_CARD_TYPE_UPDATE, body).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
        /*alert('update successfully');*/
        this.rerenderDatatable();
        this.dtOptions = this.buildDtOptionpkg(AppUrls.BULK_HEADER_SORT_AND_PAGING);
        this.isDisplay = true;
        this.isUpdate = false;
      } else {
        alert(this.getSingleResponse.message);
      }

    });
  }

  async deleteRecordById(id) {
    const url = AppUrls.RATE_CARD_TYPE_DELETE_RECORD + id;
    this.apiserviceService.SpinnerService.show();
    this.deleteRecord = await this.apiserviceService.deleteById(url);
    this.apiserviceService.SpinnerService.hide();
    if (this.deleteRecord.status === 'SUCCESS') {
      alert('Record deleted successfully');
      this.rerenderDatatable();
      this.isDisplay = true;
    }
  }

  async findById(id) {
    this.apiserviceService.SpinnerService.show();
    const url = AppUrls.RATE_CARD_TYPE_FIND_BY_ID + id;
    this.getSingleResponse = await this.apiserviceService.findById(url);
    this.apiserviceService.SpinnerService.hide();
    this.singleRecord = this.getSingleResponse.responseBody;
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit(): void {
    this.dtTrigger.next();
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
