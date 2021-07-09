import {Component, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {ApiserviceService} from '../../apiservice.service';
import {AppUrls} from '../../common/Api_Url_Seeting';

@Component({
  selector: 'app-pending-status-mapping',
  templateUrl: './pending-status-mapping.component.html',
  styleUrls: ['./pending-status-mapping.component.css']
})
export class PendingStatusMappingComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  PendingVendarStatusMappingDataTableSetting: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  title = 'datatables';
  public data;
  public deleteRecord;
  public getSingleResponse;
  public isUpdate = false;
  public pdStatuMapping  = [];

  constructor(private apiserviceService: ApiserviceService) { }

  async ngOnInit(): Promise<void>  {
    this.apiserviceService.urlAuthorization();
    this.PendingVendarStatusMappingDataTableSetting = this.PendingVendarStatusMappingDataTable(AppUrls.PENDINGH_VENDOAR_STATUS_MAPPING);
  }

  async deleteRecords(id) {
    this.isUpdate = false;
    await this.deleteById(id);
    this.dtOptions = this.PendingVendarStatusMappingDataTable(AppUrls.PENDINGH_VENDOAR_STATUS_MAPPING_DELETE_RECORD);
    console.log(id);
  }

  async deleteById(id) {
    this.apiserviceService.SpinnerService.show();
    const url = AppUrls.PENDINGH_VENDOAR_STATUS_MAPPING_DELETE_RECORD + id;
    this.deleteRecord = await this.apiserviceService.deleteById(url);
    this.apiserviceService.SpinnerService.hide();
    if (this.deleteRecord.status === 'SUCCESS') {
      this.rerenderDatatable();
    } else {
      alert(this.getSingleResponse.message);
    }
  }

  PendingVendarStatusMappingDataTable(url): DataTables.Settings {
    return {
      pagingType: 'full_numbers',
      processing: false,
      destroy: true,
      searching: false,
      serverSide: true,
      pageLength: 10,
      ajax: (dataTablesParameters: any, callback) => {
        this.apiserviceService.SpinnerService.show();
        this.apiserviceService.saveData(url, dataTablesParameters)
          .subscribe
          (resp => {
            this.apiserviceService.SpinnerService.hide();
            if (resp.data.length > 0) {
              this.pdStatuMapping = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              this.pdStatuMapping = [];
            }
          });
      },

      columns: [
        {data: 'statusCode'},
        {data: 'date' , searchable: false, orderable: false},
        {data: 'ndrCode' , searchable: false, orderable: false},
        {data: 'remark' , searchable: false, orderable: false},
        {data: 'response' , orderable: false},
        {data: 'courierCode' , searchable: false, orderable: false}
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

