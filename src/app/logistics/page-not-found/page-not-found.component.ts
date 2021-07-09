import { Component, OnInit } from '@angular/core';
import {ApiserviceService} from '../../apiservice.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  constructor(private apiserviceService: ApiserviceService) { }

  ngOnInit(): void {
    // this.apiserviceService.urlAuthorization();
  }

}
