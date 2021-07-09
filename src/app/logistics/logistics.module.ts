import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LogisticsRoutingModule} from './logistics-routing.module';
import {HomeComponent} from './home/home.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {BulkheaderComponent} from './bulkheader/bulkheader.component';
import {SharedModule} from '../shared/shared.module';
import {BulkmasterComponent} from './bulkmaster/bulkmaster.component';
import {BulkuploadComponent} from './bulkupload/bulkupload.component';
import {StatusFlowComponent} from './status-flow/status-flow.component';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CourierComponent} from './courier/courier.component';
import {ServicablepincodeComponent} from './servicablepincode/servicablepincode.component';
import {StatusTransitionComponent} from './status-transition/status-transition.component';
import {StatusComponent} from './status/status.component';
import {PageComponent} from './page/page.component';
import {RoleComponent} from './role/role.component';
import {ConfigrationComponent} from './configration/configration.component';
import {BranchComponent} from './branch/branch.component';
import {ColoaderComponent} from './coloader/coloader.component';
import {ClientComponent} from './client/client.component';
import {ClientFacilityComponent} from './client-facility/client-facility.component';
import {UserComponent} from './user/user.component';
import {ServiceTypeComponent} from './service-type/service-type.component';
import {ServiceProviderComponent} from './service-provider/service-provider.component';
import {CourierPriorityComponent} from './courier-priority/courier-priority.component';
import {CourierStatusMappingComponent} from './courier-status-mapping/courier-status-mapping.component';
import {AwbSeriesComponent} from './awb-series/awb-series.component';
import {OrderLBHComponent} from './order-lbh/order-lbh.component';
import {ApiConfigComponent} from './api-config/api-config.component';
import {SaleOrderComponent} from './sale-order/sale-order.component';
import {SaleOrderSingleUoploadComponent} from './sale-order-single-uopload/sale-order-single-uopload.component';
import {DomasticRateCardComponent} from './domastic-rate-card/domastic-rate-card.component';
import {DataTablesModule} from 'angular-datatables';
import {TrackingComponent} from './tracking/tracking.component';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from '../app-routing.module';
import {HttpClientModule} from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { OrderProcessingComponent } from './order-processing/order-processing.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DemocompComponent } from './democomp/democomp.component';
import { ServiceableCouriersComponent } from './serviceable-couriers/serviceable-couriers.component';
import {NgxSpinnerModule} from 'ngx-spinner';
import { WalletComponent } from './wallet/wallet.component';
import { SubtrackingComponent } from './subtracking/subtracking.component';
import { UpdatePacketStatusComponent } from './update-packet-status/update-packet-status.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { WareHouseComponent } from './ware-house/ware-house.component';
import { ThreeplManifestComponent } from './threepl-manifest/threepl-manifest.component';
import { UploadCourierDetailsComponent } from './upload-courier-details/upload-courier-details.component';
import { AccessForbiddenComponent } from './access-forbidden/access-forbidden.component';
import {ClientCourierWarehouseMappingComponent} from './client-courier-warehouse-mapping/client-courier-warehouse-mapping.component';
import { ClientWalletComponent } from './client-wallet/client-wallet.component';
import { ClientRemittanceComponent } from './client-remittance/client-remittance.component';
import { CourierRemittanceComponent } from './courier-remittance/courier-remittance.component';
import { MasterReportComponent } from './master-report/master-report.component';
// tslint:disable-next-line:max-line-length
import { SaleOrderPendingClientRemittanceComponent } from './sale-order-pending-client-remittance/sale-order-pending-client-remittance.component';
// tslint:disable-next-line:max-line-length
import { SaleOrderPendingForCourierRemittanceComponent } from './sale-order-pending-for-courier-remittance/sale-order-pending-for-courier-remittance.component';
import { SupportComponent } from './support/support.component';
import { OrderStatusComponent } from './order-status/order-status.component';
import { DownloadLabelsComponent } from './download-labels/download-labels.component';
import { DataPushErrorAndSuccessLogComponent } from './data-push-error-and-success-log/data-push-error-and-success-log.component';
import { PendingStatusMappingComponent } from './pending-status-mapping/pending-status-mapping.component';
import { RateCardTypeComponent } from './rate-card-type/rate-card-type.component';
import { ViewClientRateComponent } from './view-client-rate/view-client-rate.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ViewClientWalletComponent } from './view-client-wallet/view-client-wallet.component';
import { UploadDocumentComponent } from './upload-document/upload-document.component';



@NgModule({
  declarations: [
    HomeComponent,
    PageNotFoundComponent,
    BulkheaderComponent,
    BulkmasterComponent,
    BulkuploadComponent,
    StatusFlowComponent,
    CourierComponent,
    ServicablepincodeComponent,
    StatusTransitionComponent,
    StatusComponent,
    PageComponent,
    RoleComponent,
    ConfigrationComponent,
    BranchComponent,
    ColoaderComponent,
    ClientComponent,
    ClientFacilityComponent,
    UserComponent,
    ServiceTypeComponent,
    ServiceProviderComponent,
    CourierPriorityComponent,
    CourierStatusMappingComponent,
    AwbSeriesComponent,
    OrderLBHComponent,
    ApiConfigComponent,
    SaleOrderComponent,
    SaleOrderSingleUoploadComponent,
    DomasticRateCardComponent,
    TrackingComponent,
    OrderProcessingComponent,
    DemocompComponent,
    DemocompComponent,
    ServiceableCouriersComponent,
    SubtrackingComponent,
    WareHouseComponent,
    ClientCourierWarehouseMappingComponent,
    WalletComponent,
    UpdatePacketStatusComponent,
    UploadCourierDetailsComponent,
    ThreeplManifestComponent,
    AccessForbiddenComponent,
    ClientWalletComponent,
    ClientRemittanceComponent,
    MasterReportComponent,
    CourierRemittanceComponent,
    SaleOrderPendingClientRemittanceComponent,
    SaleOrderPendingForCourierRemittanceComponent,
    SupportComponent,
    OrderStatusComponent,
    DownloadLabelsComponent,
    DataPushErrorAndSuccessLogComponent,
    PendingStatusMappingComponent,
    RateCardTypeComponent,
    ViewClientRateComponent,
    ChangePasswordComponent,
    ViewClientWalletComponent,
    UploadDocumentComponent,


  ],

  imports: [
    RouterModule,
    CommonModule,
    LogisticsRoutingModule,
    SharedModule,
    NgMultiSelectDropDownModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    DataTablesModule,
    DragDropModule,
    NgxSpinnerModule,
    NgbModule
    /*SortablejsModule.forRoot({})*/
  ]
})
export class LogisticsModule {
}
