import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import {APP_BASE_HREF} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import { DefaultLayoutComponent } from './layouts/default-layout/default-layout.component';
import { BackendLayoutComponent } from './layouts/backend-layout/backend-layout.component';
import { SharedModule } from './shared/shared.module';
import {LogisticsModule} from './logistics/logistics.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxSpinnerModule } from 'ngx-spinner';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpConfigInterceptor} from './http-config-interceptor';
// @ts-ignore


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    DefaultLayoutComponent,
    BackendLayoutComponent,

  ],
  imports: [
    SharedModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    DataTablesModule,
    LogisticsModule,
    NgMultiSelectDropDownModule.forRoot(),
    DragDropModule,
    NgxSpinnerModule,
    NgbModule,
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue: '/'},
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
