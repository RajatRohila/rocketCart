import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiserviceService} from '../../apiservice.service';
import {AppUrls} from '../../common/Api_Url_Seeting';
import {saveAs} from 'file-saver';
import {NgbCalendar, NgbDateStruct, NgbDatepicker} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-master-report',
  templateUrl: './master-report.component.html',
  styleUrls: ['./master-report.component.css']
})
export class MasterReportComponent implements OnInit {
  title = 'datatables';
  dtOptions: DataTables.Settings = {};

  fromModel: NgbDateStruct;
  toModel: NgbDateStruct;
  /*fromToday = this.calendar.getToday();
  toToday = this.calendar.getWeeksPerMonth();*/
  fromToday = this.calendar.getDaysPerWeek();
  toToday = this.calendar.getDaysPerWeek();
  public posts;
  public getSingleResponse;
  public isAwbActive = false;
  public isCustomActive = false;
  public isDateRangeActive = false;
  public reportTypeValue;
  public data;
  /*reportTypeList = ['AWB', 'CUSTOM', 'DATE_RANGE'];
  reportCustomTypeList = ['SAME_DAY', 'PREVIOUS_DAY', 'LAST_7_DAY', 'LAST_15_DAY', 'LAST_30_DAY'];*/
  masterReportForm = new FormGroup({
    reportType: new FormControl(''),
    reportCustomType: new FormControl(),
    fromDate: new FormControl(),
    toDate: new FormControl(),
    reportStatus: new FormControl(),
    awbList: new FormControl(''),
    userType: new FormControl(),
    createDate: new FormControl(),
    createdBy: new FormControl('')
  });
  constructor(private apiserviceService: ApiserviceService, private calendar: NgbCalendar) {

  }

  async ngOnInit(): Promise<void> {
    this.apiserviceService.urlAuthorization();
    console.log(this.posts);
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 8,
      processing: true,
      scrollY : '100%'
    };
  }
  onChangeReportTypeValue() {
    if (this.reportTypeValue === 'AWB') {
      this.isAwbActive = true;
      this.isDateRangeActive = false;
      this.isCustomActive = false;
    } else if (this.reportTypeValue === 'CUSTOM') {
      this.isCustomActive = true;
      this.isDateRangeActive = false;
      this.isAwbActive = false;
    } else if (this.reportTypeValue === 'DATE_RANGE') {
      this.isDateRangeActive = true;
      this.isCustomActive = false;
      this.isAwbActive = false;
    } else if (this.reportTypeValue === 'PENDING_CLIENT_REMITTANCE') {
      this.isDateRangeActive = false;
      this.isCustomActive = false;
      this.isAwbActive = false;
    }
  }

  async onGenerate() {
    if (this.masterReportForm.get('reportType').value === 'AWB') {
      this.masterReportForm.value.reportCustomType = null;
      this.masterReportForm.value.fromDate = null;
      this.masterReportForm.value.toDate = null;
      const awbList = this.masterReportForm.get('awbList').value;
      if (awbList === undefined || awbList === '') {
        alert('Please enter Awb number');
      }
      this.masterReportForm.value.awbList = awbList.split(',');
    } else if (this.masterReportForm.get('reportType').value === 'CUSTOM') {
      this.masterReportForm.value.awbList = null;
      this.masterReportForm.value.fromDate = null;
      this.masterReportForm.value.toDate = null;
      const reportCustomType = this.masterReportForm.get('reportCustomType').value;
      if (reportCustomType === undefined || reportCustomType === '') {
        alert('Please salect custom type');
      }
    } else if (this.masterReportForm.get('reportType').value === 'DATE_RANGE' ) {
      const  fromDate = (<HTMLInputElement>document.getElementById('fromDate')).value;
      console.log(fromDate);
      const  toDate = (<HTMLInputElement>document.getElementById('toDate')).value;
      console.log(toDate);
      this.masterReportForm.value.fromDate = fromDate;
      this.masterReportForm.value.toDate = toDate;
      this.masterReportForm.value.reportCustomType = null;
      this.masterReportForm.value.awbList = null;
    } else if (this.masterReportForm.get('reportType').value === 'PENDING_CLIENT_REMITTANCE') {
      this.masterReportForm.value.awbList = null;
      this.masterReportForm.value.fromDate = null;
      this.masterReportForm.value.toDate = null;
    }
    const body = JSON.stringify(this.masterReportForm.value);
    const fileName = 'masterReport';
    const url = AppUrls.GENERATE_MASTER_REPORT;
    this.apiserviceService.SpinnerService.show();
    this.getSingleResponse = await this.apiserviceService.fileDownloadByPostMethod(url, body);
    this.apiserviceService.SpinnerService.hide();
    const blob = new Blob([this.getSingleResponse], {type: 'application/octet-stream'});
    const file = new File([blob], fileName + '.xlsx');
    saveAs(file);
  }

}
