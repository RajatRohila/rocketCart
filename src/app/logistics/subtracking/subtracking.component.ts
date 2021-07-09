import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ApiserviceService} from '../../apiservice.service';
import {SaleOrder} from './sale-order';

@Component({
  selector: 'app-subtracking',
  templateUrl: './subtracking.component.html',
  styleUrls: ['./subtracking.component.css']
})
export class SubtrackingComponent implements OnInit {
  public url: any;
  public awbNo: any;
  public trackType: any;
  public getSingleResponse;
  public isAWB = false;
  public awbNumbersResponse: any[];
  public awbpacketHistory: any[];
  public saleOrder: SaleOrder[];

  constructor(private router: Router, private apiserviceService: ApiserviceService) {
    this.url = router.url;
  }

  ngOnInit(): void {
    this.apiserviceService.urlAuthorization();
    const arr = this.url.split('/');
    this.trackType = arr[3];
    this.awbNo = arr[4];
    this.onSearch(this.awbNo);
  }

  async onSearch(awnNo) {
    if (this.trackType === 'awbNo') {
      this.isAWB = true;
      this.url = '/api/findByAwbNumbers/' + this.awbNo;
      this.apiserviceService.SpinnerService.show();
      this.getSingleResponse = await this.apiserviceService.findById(this.url);
      this.apiserviceService.SpinnerService.hide();
      if (this.getSingleResponse.status === 'SUCCESS') {
        this.awbNumbersResponse = this.getSingleResponse.responseBody;
        this.saleOrder = this.awbNumbersResponse;
        //this.awbpacketHistory=this.saleOrder.forEach()
        this.saleOrder.forEach(value => {
          this.awbpacketHistory = value.packetHistory;
          console.log(this.awbpacketHistory);
          this.awbpacketHistory.reverse();
          console.log(this.awbpacketHistory);
        });
      }
    } else if (this.trackType === 'courier') {
        this.isAWB = true ;
        this.apiserviceService.SpinnerService.show();
        this.url = '/api/findByCourierAwbNumber/' + this.awbNo;
        this.getSingleResponse = await this.apiserviceService.findById(this.url);
        this.apiserviceService.SpinnerService.hide();
        if (this.getSingleResponse.status === 'SUCCESS') {
          this.awbNumbersResponse = this.getSingleResponse.responseBody;
          this.saleOrder = this.awbNumbersResponse;
          }
        }
  }

}
