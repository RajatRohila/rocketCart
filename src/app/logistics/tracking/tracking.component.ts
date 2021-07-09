import {Component, OnInit} from '@angular/core';
import {ApiserviceService} from '../../apiservice.service';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';

import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {AppUrls} from '../../common/Api_Url_Seeting';


@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css']
})
export class TrackingComponent implements OnInit {

  title = 'datatables';
  dtOptions: DataTables.Settings = {};
  /*private isDisplay = false;
  private isFirst = false;
  private isAdd = false;*/
  public posts;
  public allRecords;
  public singleRecord;
  public getSingleResponse;
  public awbNumbersResponse: any[];
  public isNotFound = false;
  public isAWB = false;
  public isCouries = false;
  public packetDetailsMap = new Map();
  public courierSaleOrderMap = new Map();
  public commaSepIds;
  public awbpacketHistory: any[];
  public awbNumbersArray: any[];
  public awbNotFound: any[];
  constructor(private apiserviceService: ApiserviceService, private modalService: NgbModal) {

  }

  async ngOnInit(): Promise<void> {
    this.apiserviceService.urlAuthorization();
    /*this.isFirst = true;*/
    /*console.log(this.posts);*/
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      processing: true,
      scrollY: '100%'
    };
  }
  handleKeyUp(e) {
    if ( e.keyCode === 13) {
      this.tracking();
    }
  }

  async tracking() {
    this.isNotFound = false;
    this.awbNumbersResponse = [];
    this.packetDetailsMap.clear();
    const searchType = (<HTMLInputElement>document.getElementById('searchType')).value;
    const serachingValues = (<HTMLInputElement>document.getElementById('commaSepIds')).value;
    if (searchType == null || searchType === undefined || searchType === '') {
      alert('Please select search type.');
      return false;
    }
    if (serachingValues == null || serachingValues === undefined || serachingValues === '') {
      alert('Please enter search value.');
      return false;
    }
    // const body = JSON.stringify(serachingValues);
    this.apiserviceService.SpinnerService.show();
    const url = AppUrls.TRACKING + '?trackingType=' + searchType;
    this.apiserviceService.saveData(url, serachingValues).subscribe(result => {
      this.apiserviceService.SpinnerService.hide();
      this.getSingleResponse = result;
      if (this.getSingleResponse.status === 'SUCCESS') {
        this.awbNumbersResponse = this.getSingleResponse.responseBody.FOUND;
        this.awbNotFound = this.getSingleResponse.responseBody.NOT_FOUND;
        if (this.awbNotFound.length > 0) {
          this.isNotFound = true;
        }
        (<HTMLInputElement>document.getElementById('commaSepIds')).value = '';
        for (const pktObj of this.getSingleResponse.responseBody.FOUND) {
          this.packetDetailsMap[pktObj.referanceNo] = pktObj;
        }
      } else {
        alert(this.getSingleResponse.message);
      }
    });
  }

  /*async onSearch() {
    const searchType = (<HTMLInputElement>document.getElementById('searchType')).value;
    const serachingValues = (<HTMLInputElement>document.getElementById('commaSepIds')).value;
    let str = '';
    for (const item of serachingValues.split(',')) {
      str += item.trim() + ',';
    }
    let url = '';

    this.packetDetailsMap = new Map();
    if (searchType === 'AwbNumber') {
      this.isAWB = true;
      this.isCouries = false;
      url = '/api/findByAwbNumbers/' + str;
      this.apiserviceService.SpinnerService.show();
      this.getSingleResponse = await this.apiserviceService.findById(url);
      this.apiserviceService.SpinnerService.hide();
      if (this.getSingleResponse.status === 'SUCCESS') {
        this.awbNumbersResponse = this.getSingleResponse.responseBody;
        this.isfound = true;
        (<HTMLInputElement>document.getElementById('commaSepIds')).value = '';
        for (const pktObj of this.getSingleResponse.responseBody) {
          this.packetDetailsMap[pktObj.referanceNo] = pktObj;
        }
      } else {
        this.isfound = false;
        alert(this.getSingleResponse.message);
      }
    } else if (searchType === 'CourierAwb') {
      this.isAWB = false;
      this.isCouries = true;
      console.log(serachingValues);
      url = '/api/findByCourierAwbNumber/' + str;
      this.apiserviceService.SpinnerService.show();
      this.getSingleResponse = await this.apiserviceService.findById(url);
      this.apiserviceService.SpinnerService.hide();
      if (this.getSingleResponse.status === 'SUCCESS') {
        this.awbNumbersResponse = this.getSingleResponse.responseBody;
        this.isfound = true;
        (<HTMLInputElement>document.getElementById('commaSepIds')).value = '';
        for (const pktObj of this.getSingleResponse.responseBody) {
          this.courierSaleOrderMap[pktObj.courierAWBNumber] = pktObj;
        }
      } else {
        this.isfound = false;
        alert(this.getSingleResponse.message);
      }
    }

  }*/

  getFullHistory(awbNumber, type) {
    this.awbNumbersArray = [];
    if ( type === 'AWB') {
      this.awbNumbersArray.push(this.packetDetailsMap[awbNumber]);
      this.awbpacketHistory = this.packetDetailsMap[awbNumber].packetHistory;
    } else if ( type === 'COURIER-AWB') {
      this.awbNumbersArray.push(this.courierSaleOrderMap[awbNumber]);
      this.awbpacketHistory = this.courierSaleOrderMap[awbNumber].packetHistory;
    }
    this.awbpacketHistory.reverse();
  }

  showPacketHistory(awbNumber) {
    this.singleRecord = this.packetDetailsMap[awbNumber];
  }

  async findByCourierCode(courierAWBNumber) {
    this.apiserviceService.SpinnerService.show();
    const url = '/api/findByCourierAwbNumber/' + courierAWBNumber;
    this.getSingleResponse = await this.apiserviceService.findById(url);
    this.apiserviceService.SpinnerService.hide();
    this.singleRecord = this.getSingleResponse.responseBody;
  }

  async findByAwbNumber(referanceNo) {
    this.apiserviceService.SpinnerService.show();
    const url = '/api/findByAwbNumber/' + referanceNo;
    this.getSingleResponse = await this.apiserviceService.findById(url);
    this.apiserviceService.SpinnerService.hide();
    this.singleRecord = this.getSingleResponse.responseBody;
  }
}
