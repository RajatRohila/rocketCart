import {Component, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {CheckBoxObj} from '../order-processing/CheckBoxObj';
import {ApiserviceService} from '../../apiservice.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AppUrls} from '../../common/Api_Url_Seeting';
import * as XLSX from 'xlsx';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-download-labels',
  templateUrl: './download-labels.component.html',
  styleUrls: ['./download-labels.component.css']
})
export class DownloadLabelsComponent implements OnInit {

  public data;

  constructor(private apiserviceService: ApiserviceService) { }

  async ngOnInit(): Promise<void>  {
    this.apiserviceService.urlAuthorization();
  }
  async downloadInvoiceAndPrintLable() {
    const type = (<HTMLInputElement>document.getElementById('type')).value;
    const awbnumber = (<HTMLInputElement>document.getElementById('awbNumbers')).value;
    let awb = '';
    for (const item of awbnumber.split(',')) {
      awb += item.trim() + ',';
    }
    if (awbnumber === '' || awbnumber === null) {
      alert('Please input comma separated AWB number');
    } else {
      if (type === 'invoice') {
        this.apiserviceService.SpinnerService.show();
        const url = AppUrls.GENERATE_INVOICE_PRINT_LABEL;
        this.data = await this.apiserviceService.fileDownloadByPostMethod(url, awb);
        this.apiserviceService.SpinnerService.hide();
        const blob = new Blob([this.data], {type: 'application/octet-stream'});
        const file = new File([blob], 'invoice.pdf', {type: 'application/pdf'});
        saveAs(file);
      } else if (type === 'printLeble') {
        this.apiserviceService.SpinnerService.show();
        const url = AppUrls.GENERATE_ORDER_PRINT_LABEL;
        this.data = await this.apiserviceService.fileDownloadByPostMethod(url, awb);
        this.apiserviceService.SpinnerService.hide();
        const blob = new Blob([this.data], {type: 'application/octet-stream'});
        const file = new File([blob],  'label.pdf', {type: 'application/pdf'});
        saveAs(file);
      }
    }
  }
}
