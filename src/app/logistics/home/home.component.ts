import { Component, OnInit } from '@angular/core';
import {ApiserviceService} from '../../apiservice.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private apiserviceService: ApiserviceService) { }

  ngOnInit(): void {
    this.apiserviceService.urlAuthorization();
  }

}
