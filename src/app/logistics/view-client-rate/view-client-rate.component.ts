import {Component, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {ApiserviceService} from '../../apiservice.service';
import {AppUrls} from '../../common/Api_Url_Seeting';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-view-client-rate',
  templateUrl: './view-client-rate.component.html',
  styleUrls: ['./view-client-rate.component.css']
})
export class ViewClientRateComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  public localZoneType = [];
  public metroZoneType = [];
  public roiZoneType = [];
  public nejkZoneType = [];
  public withinstate = [];
  public finalResult = [];
  public data;

  public map = new Map();
  public restMap = new Map();
  title = 'datatables';
  public isDisplay = true;
  public clientRate: [];

  constructor(private apiserviceService: ApiserviceService) {

  }

  async ngOnInit(): Promise<void> {
    this.apiserviceService.urlAuthorization();

    this.dtOptions = this.buildDtOptionpkg(AppUrls.DOMASTIC_RATE_CARD_SORT_AND_PAGING);
  }

  buildDtOptionpkg(url: string): DataTables.Settings {
    return {
      pagingType: 'full_numbers',
      processing: false,
      serverSide: true,
      pageLength: 10,
      order: [[0, 'desc']],
      ajax: (dataTablesParameters: any, callback) => {
        this.apiserviceService.SpinnerService.show();
        this.apiserviceService.saveData(url, dataTablesParameters)
          .subscribe
          (resp => {
            this.apiserviceService.SpinnerService.hide();
            if (resp.data.length > 0) {
              this.clientRate = resp.data;
              for (let i = 0; i < this.clientRate.length; i++) {
                this.localZoneType = [];
                this.metroZoneType = [];
                this.roiZoneType = [];
                this.nejkZoneType = [];
                this.withinstate = [];
                this.restMap = new Map();
                this.restMap.set('active', this.clientRate[i]['active']);
                this.restMap.set('courierCode', this.clientRate[i]['courierCode']);
                this.restMap.set('freightType', this.clientRate[i]['freightType']);
                this.restMap.set('id', this.clientRate[i]['id']);
                this.restMap.set('rateCardCode', this.clientRate[i]['rateCardCode']);
                this.restMap.set('rateCardCode', this.clientRate[i]['rateCardCode']);
                this.restMap.set('rateCardName', this.clientRate[i]['rateCardName']);
                this.restMap.set('rateCardTypeCode', this.clientRate[i]['rateCardTypeCode']);
                this.restMap.set('rateMatrixList', this.clientRate[i]['rateMatrixList']);
                this.restMap.set('serviceProviderCode', this.clientRate[i]['serviceProviderCode']);
                const serviceType = this.clientRate[i]['freightType'];
                let rateMatrixArray = [];
                rateMatrixArray = this.clientRate[i]['rateMatrixList'];
                if (rateMatrixArray.length > 0) {
                  this.map = new Map();
                  for (let j = 0; j < rateMatrixArray.length; j++) {

                    if (this.clientRate[i]['rateMatrixList'][j]['zoneType'] === 'LOCAL') {
                      if (serviceType === 'FLAT') {
                        this.localZoneType.push(this.clientRate[i]['rateMatrixList'][j]['flatFreight']);
                        this.map.set('LOCAL', this.localZoneType);
                      }
                    }
                    if (this.clientRate[i]['rateMatrixList'][j]['zoneType'] === 'METRO') {
                      if (serviceType === 'FLAT') {
                        this.metroZoneType.push(this.clientRate[i]['rateMatrixList'][j]['flatFreight']);
                        this.map.set('METRO', this.metroZoneType);
                      }
                    }
                    if (this.clientRate[i]['rateMatrixList'][j]['zoneType'] === 'ROI') {
                      if (serviceType === 'FLAT') {
                        this.roiZoneType.push(this.clientRate[i]['rateMatrixList'][j]['flatFreight']);
                        this.map.set('ROI', this.roiZoneType);
                      }
                    }
                    if (this.clientRate[i]['rateMatrixList'][j]['zoneType'] === 'NEJK') {
                      if (serviceType === 'FLAT') {
                        this.nejkZoneType.push(this.clientRate[i]['rateMatrixList'][j]['flatFreight']);
                        this.map.set('NEJK', this.nejkZoneType);
                      }
                    }
                    if (this.clientRate[i]['rateMatrixList'][j]['zoneType'] === 'WITHINSTATE') {
                      if (serviceType === 'FLAT') {
                        this.withinstate.push(this.clientRate[i]['rateMatrixList'][j]['flatFreight']);
                        this.map.set('WITHINSTATE', this.withinstate);
                      }
                    }
                  }

                } else {
                  this.map.set('LOCAL', null);
                  this.map.set('METRO', null);
                  this.map.set('ROI', null);
                  this.map.set('NEJK', null);
                  this.map.set('WITHINSTATE', null);
                }
                const jsonObjectMap = {};
                this.map.forEach((value, key) => {
                  jsonObjectMap[key] = value;
                });
                this.restMap.set('zoneData', jsonObjectMap);
                const jsonObject = {};
                this.restMap.forEach((value, key) => {
                  jsonObject[key] = value;
                });
                this.finalResult.push(jsonObject);
              }
              console.log(this.finalResult);
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: [],
              });
            } else {
              /*this.isAdd = true;*/
              this.clientRate = [];
            }

          });
      },
      columns: [
        {data: 'rateCardCode'},
        {data: 'rateCardTypeCode'},
        {data: 'freightType'},
        {data: 'courierCode'}
      ],
    };
  }

  async onDownloadViewClientRateReport() {
    const fileName = 'viewClientRateReport';
    const url = AppUrls.DOWNLOAD_VIEW_CLIENT_RATE_REPORT;
    this.apiserviceService.SpinnerService.show();
    this.data = await this.apiserviceService.downloadExcel(url);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.data], {type: 'application/octet-stream'});
    const file = new File([blob], fileName + '.xlsx', {type: 'application/vnd.ms.excel'});
    saveAs(file);
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
