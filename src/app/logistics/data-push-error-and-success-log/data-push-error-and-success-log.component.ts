import {Component, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {ApiserviceService} from '../../apiservice.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AppUrls} from '../../common/Api_Url_Seeting';

@Component({
  selector: 'app-data-push-error-and-success-log',
  templateUrl: './data-push-error-and-success-log.component.html',
  styleUrls: ['./data-push-error-and-success-log.component.css']
})
export class DataPushErrorAndSuccessLogComponent implements OnInit {


  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  DataPushErrorLogDataTableSetting: DataTables.Settings = {};
  DataPushSuccessLogDataTableSetting: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  title = 'datatables';
  public data;
  public dtaPushErrorLog  = [];
  public dtaPushSuccessLog  = [];



  constructor(private apiserviceService: ApiserviceService) { }

  async ngOnInit(): Promise<void>  {
    this.apiserviceService.urlAuthorization();
    this.DataPushSuccessLogDataTableSetting = this.DataPushSuccessLogDataTable(AppUrls.DATA_PUSH_SUCCESS_LOG);
    this.DataPushErrorLogDataTableSetting = this.DataPushErrorLogDataTable(AppUrls.DATA_PUSH_ERROR_LOG);
  }
  loadDataPushSuccessLogDataTableDataTable() {
  }
  DataPushSuccessLogDataTable(url): DataTables.Settings {
    return {
      pagingType: 'full_numbers',
      processing: false,
      destroy: true,
      searching: true,
      serverSide: true,
      pageLength: 10,
      ajax: (dataTablesParameters: any, callback) => {
        this.apiserviceService.SpinnerService.show();
        this.apiserviceService.saveData(url, dataTablesParameters)
          .subscribe
          (resp => {
            this.apiserviceService.SpinnerService.hide();
            if (resp.data.length > 0) {
              this.dtaPushSuccessLog = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              this.dtaPushSuccessLog = [];
            }
          });
      },
      columns: [
        {data: 'awb'},
        {data: 'url' , searchable: false, orderable: false},
        {data: 'request' , searchable: false, orderable: false},
        {data: 'response' , searchable: false, orderable: false},
        {data: 'message' , orderable: false},
        {data: 'status' , searchable: false, orderable: false},
        {data: 'date' , searchable: false, orderable: false},
      ],
    };
  }

  DataPushErrorLogDataTable(url): DataTables.Settings {
    return {
      pagingType: 'full_numbers',
      processing: false,
      destroy: true,
      searching: true,
      serverSide: true,
      pageLength: 10,
      ajax: (dataTablesParameters: any, callback) => {
        this.apiserviceService.SpinnerService.show();
        this.apiserviceService.saveData(url, dataTablesParameters)
          .subscribe
          (resp => {
            this.apiserviceService.SpinnerService.hide();
            if (resp.data.length > 0) {
              this.dtaPushErrorLog = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              this.dtaPushErrorLog = [];
            }
          });
      },
      columns: [
        {data: 'awb'},
        {data: 'url' , searchable: false, orderable: false},
        {data: 'request' , searchable: false, orderable: false},
        {data: 'response' , searchable: false, orderable: false},
        {data: 'message' , orderable: false},
        {data: 'status' , searchable: false, orderable: false},
        {data: 'date' , searchable: false, orderable: false}
      ],
    };
  }


  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  rerenderDatatable(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }
}
