import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {AccessForbiddenComponent} from './access-forbidden/access-forbidden.component';
import {BulkheaderComponent} from './bulkheader/bulkheader.component';
import {BulkmasterComponent} from './bulkmaster/bulkmaster.component';
import {LoginComponent} from '../auth/login/login.component';
import {SignupComponent} from '../auth/signup/signup.component';
import { BulkuploadComponent } from './bulkupload/bulkupload.component';
import { StatusFlowComponent } from './status-flow/status-flow.component';
import { CourierComponent } from './courier/courier.component';
import { ServicablepincodeComponent } from './servicablepincode/servicablepincode.component';
import { StatusTransitionComponent } from './status-transition/status-transition.component';
import { StatusComponent } from './status/status.component';
import {PageComponent} from './page/page.component';
import {RoleComponent} from './role/role.component';
import {ConfigrationComponent} from './configration/configration.component';
import { BranchComponent } from './branch/branch.component';
import {ColoaderComponent} from './coloader/coloader.component';
import { ClientComponent } from './client/client.component';
import { ClientFacilityComponent } from './client-facility/client-facility.component';
import { UserComponent } from './user/user.component';
import { ServiceTypeComponent } from './service-type/service-type.component';
import { ServiceProviderComponent } from './service-provider/service-provider.component';
import {CourierPriorityComponent} from './courier-priority/courier-priority.component';
import { CourierStatusMappingComponent } from './courier-status-mapping/courier-status-mapping.component';
import {AwbSeriesComponent} from './awb-series/awb-series.component';
import {OrderLBHComponent} from './order-lbh/order-lbh.component';
import { ApiConfigComponent } from './api-config/api-config.component';
import {SaleOrderComponent} from './sale-order/sale-order.component';
import { SaleOrderSingleUoploadComponent } from './sale-order-single-uopload/sale-order-single-uopload.component';
import { DomasticRateCardComponent } from './domastic-rate-card/domastic-rate-card.component';
import {TrackingComponent} from './tracking/tracking.component';
import { ServiceableCouriersComponent } from './serviceable-couriers/serviceable-couriers.component';
import {OrderProcessingComponent} from './order-processing/order-processing.component';
import {DemocompComponent} from './democomp/democomp.component';
import {WalletComponent} from './wallet/wallet.component';
import { UploadCourierDetailsComponent } from './upload-courier-details/upload-courier-details.component';
import {SubtrackingComponent} from './subtracking/subtracking.component';
import {UpdatePacketStatusComponent} from './update-packet-status/update-packet-status.component';
import { ThreeplManifestComponent } from './threepl-manifest/threepl-manifest.component';
import {WareHouseComponent} from './ware-house/ware-house.component';
import { MasterReportComponent } from './master-report/master-report.component';
import { ClientWalletComponent } from './client-wallet/client-wallet.component';
import { ClientRemittanceComponent } from './client-remittance/client-remittance.component';
import { OrderStatusComponent } from './order-status/order-status.component';
import { DownloadLabelsComponent } from './download-labels/download-labels.component';
import { RateCardTypeComponent } from './rate-card-type/rate-card-type.component';
import { ViewClientRateComponent } from './view-client-rate/view-client-rate.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ViewClientWalletComponent } from './view-client-wallet/view-client-wallet.component';
// tslint:disable-next-line:max-line-length
import { SaleOrderPendingClientRemittanceComponent } from './sale-order-pending-client-remittance/sale-order-pending-client-remittance.component';
import {ClientCourierWarehouseMappingComponent} from './client-courier-warehouse-mapping/client-courier-warehouse-mapping.component';
import {CourierRemittanceComponent} from './courier-remittance/courier-remittance.component';
// tslint:disable-next-line:max-line-length
import { SaleOrderPendingForCourierRemittanceComponent } from './sale-order-pending-for-courier-remittance/sale-order-pending-for-courier-remittance.component';
import { SupportComponent } from './support/support.component';
import { DataPushErrorAndSuccessLogComponent } from './data-push-error-and-success-log/data-push-error-and-success-log.component';
import { PendingStatusMappingComponent } from './pending-status-mapping/pending-status-mapping.component';
import { UploadDocumentComponent } from './upload-document/upload-document.component';

const routes: Routes = [

  { path: 'accessForbidden', component: AccessForbiddenComponent},
  { path: 'bulkheader', component: BulkheaderComponent },
  { path: 'bulkMaster', component: BulkmasterComponent },
  { path: 'bulkUpload', component: BulkuploadComponent },
  { path: 'statusFlow', component: StatusFlowComponent },
  { path: 'courier', component: CourierComponent },
  { path: 'servicablepincode', component: ServicablepincodeComponent },
  { path: 'statusTransition', component: StatusTransitionComponent },
  { path: 'page', component: PageComponent },
  { path: 'status', component: StatusComponent },
  { path: 'role', component: RoleComponent },
  { path: 'configration', component: ConfigrationComponent },
  { path: 'branch', component: BranchComponent },
  { path: 'coloader', component: ColoaderComponent },
  { path: 'client', component: ClientComponent },
  { path: 'clientFacility', component: ClientFacilityComponent },
  { path: 'serviceType', component: ServiceTypeComponent },
  { path: 'user', component: UserComponent },
  { path: 'serviceProvider', component: ServiceProviderComponent },
  { path: 'courierPriority', component: CourierPriorityComponent },
  { path: 'courierStatusMapping', component: CourierStatusMappingComponent },
  { path: 'awbSeries', component: AwbSeriesComponent },
  { path: 'orderLBH', component: OrderLBHComponent },
  { path: 'configDataAPI', component: ApiConfigComponent },
  { path: 'saleOrder', component: SaleOrderComponent },
  { path: 'saleOrderSingleUpload', component: SaleOrderSingleUoploadComponent },
  { path: 'domasticRateCard', component: DomasticRateCardComponent },
  { path: 'tracking', component: TrackingComponent },
  { path: 'subtracking/:trackTypes/:awbNo', component: SubtrackingComponent},
  { path: 'serviceableCouriers', component: ServiceableCouriersComponent},
  { path: 'home', component: HomeComponent},
  { path: 'orderProcessing', component: OrderProcessingComponent},
  { path: 'wallet', component: WalletComponent },
  { path: 'wareHouses', component: WareHouseComponent },
  { path: 'clientCourierWarehouseMapping', component: ClientCourierWarehouseMappingComponent },
  { path: 'sortable', component: DemocompComponent},
  { path: 'threeplManifest', component: ThreeplManifestComponent},
  { path: 'uploadCourierDetails', component: UploadCourierDetailsComponent},
  { path: 'updatePacketStatus', component: UpdatePacketStatusComponent},
  { path: 'clientWallet', component: ClientWalletComponent},
  { path: 'courierRemittance', component: CourierRemittanceComponent},
  { path: 'masterReport', component: MasterReportComponent},
  { path: 'clientRemittance', component: ClientRemittanceComponent},
  { path: 'saleOrderPendingClientRemittance', component: SaleOrderPendingClientRemittanceComponent},
  { path: 'saleOrderPendingCourierRemittance', component: SaleOrderPendingForCourierRemittanceComponent},
  { path: 'support', component: SupportComponent},
  { path: 'orderStatus', component: OrderStatusComponent},
  { path: 'downloadLabels', component: DownloadLabelsComponent},
  { path: 'dataPushErrorAndSuccessLog', component: DataPushErrorAndSuccessLogComponent},
  { path: 'pendingStatusMapping', component: PendingStatusMappingComponent},
  { path: 'rateCardType', component: RateCardTypeComponent},
  { path: 'viewCilentRate', component: ViewClientRateComponent},
  { path: 'changePassword', component: ChangePasswordComponent},
  { path: 'viewCilentWallet', component: ViewClientWalletComponent},
  { path: 'uploadDocument', component: UploadDocumentComponent},
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: '**', component: PageNotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  // imports: [RouterModule.forRoot(routes,  {useHash: false})],
  exports: [RouterModule]
})
export class LogisticsRoutingModule { }
