export class AppUrls {
  // LOGIN URL
  public static LOGIN_URL = '/auth/signin';
  public static UPLOAD_PREOGRESS = '/api/getUploadProgress';

  // BULKHEADER
  public static BULK_HEADER_SORT_AND_PAGING = '/api/getAllPaginationAndSort';
  public static BULK_HEADER_SAVE_RECORD = '/api/addBulkHeader';
  public static BULK_HEADER_DELETE_RECORD = '/api/deleteBulkHeader/';
  public static BULK_HEADER_FIND_BY_ID = '/api/findByIdBulkHeader/';
  public static BULK_HEADER_UPDATE = '/api/updateBulkHeader/';

  // BULKHEADER
  public static BULK_MASTER_SORT_AND_PAGING = '/api/bulkMaster/getAllPaginationAndSort';
  public static BULK_MASTER_SAVE_RECORD = '/api/addBulkMaster';
  public static BULK_MASTER_UPDATE_RECORD = '/api/updateBulkMaster';
  public static BULK_MASTER_DELETE_RECORD = '/api/deleteBulkMaster/';
  public static BULK_MASTER_FIND_BY_ID = '/api/findByBulkMasterId/';
  public static BULK_MASTER_GET_ALL_BULK_HEADER = '/api/getAllBulkHeader';

  // BRANCH
  public static BRANCH_SORT_AND_PAGING = '/api/branch/getAllPaginationAndSort';
  public static BRANCH_SAVE_RECORD = '/api/addBranch';
  public static BRANCH_DELETE_RECORD = '/api/deleteBranch/';
  public static BRANCH_FIND_BY_ID = '/api/findByBranchId/';
  public static BRANCH_UPDATE_RECORD = '/api/updateBranch';
  public static GET_ALL_ACTIVE_BRANCH = '/api/getAllActiveBranch';
  public static DOWNLOAD_BRANCH_REPORT = '/api/branchReport';

  // PINCODE
  public static GET_CITY_STATTE_COUNTRY_BY_PINCODE = '/api/getCityStateCountryByPincode/';

  // CLIENT
  public static CLIENT_SORT_AND_PAGING = '/api/client/getAllPaginationAndSort';
  public static CLIENT_SAVE_RECORD = '/api/addClient';
  public static CLIENT_DELETE_RECORD = '/api/deleteClient/';
  public static DOWNLOAD_DOC = '/api/docController/downloadDoc';
  public static CLIENT_FIND_BY_ID = '/api/findById/';
  public static CLIENT_UPDATE_RECORD = '/api/updateClient';
  public static DOWNLOAD_CLIENT_REPORT = '/api/clientReport';

  // CLIENT FACILITY
  public static CLIENT_FACILITY_SORT_AND_PAGING = '/api/clientFacility/getAllPaginationAndSort';
  public static CLIENT_FACILITY_SAVE_RECORD = '/api/addClientFacility';
  public static CLIENT_FACILITY_DELETE_RECORD = '/api/deleteClientFacility/';
  public static CLIENT_FACILITY_FIND_BY_ID = '/api/findByClientFacilityId/';
  // public static CLIENT_FACILITY_UPDATE_RECORD = '/api/updateClientFacility';
  public static CLIENT_FACILITY_GAT_ALL_CLIENT = 'api/getAllClient';
  public static GET_CLIENT_SERVICE_TYPE = 'api/getClientServiceType';
  public static GET_CLIENT_ALLOWED_COURIER = 'api/getClientAllowedCourier';


  // COURIER
  public static COURIER_SORT_AND_PAGING = '/api/courier/getAllPaginationAndSort';
  public static COURIER_SAVE_RECORD = '/api/addCourier';
  public static COURIER_UPDATE_RECORD = '/api/updateCourier';
  public static COURIER_DELETE_RECORD = '/api/deleteCourier/';
  public static COURIER_FIND_BY_ID = '/api/findByCourierId/';
  public static COURIER_GET_ALL_SERVICE_PROVIDER = '/api/getAllServiceProvider';
  public static COURIER_GET_ALL_SERVICE_TYPE = '/api/getAllServiceType';
  public static GET_SEVICEABLE_COURIERS = '/api/getServiceableCouriers';
  public static CLIENT_SERVICE_PROVIDER = '/api/clientServiceProviders';
  public static GET_SERVICE_PROVIDERS_FOR_BULK = '/api/getServiceProvidersForBulk';
  public static GET_ACTIVE_COURIERS = '/api/findByActiveCourier';
  public static GET_ACTIVE_COLOADERS = '/api/findByActiveColoader';
  public static GET_ACTIVE_CLIENTS = '/api/findByActiveClient';
  public static DOWNLOAD_COURIER_REPORT = '/api/courierReport';
  public static GET_ALL_COURIER_BY_SERVICE_WISE = '/api/getAllCourierByServiceWise';

  // COLOADER
  public static COLOADER_SORT_AND_PAGING = '/api/coloader/getAllPaginationAndSort';
  public static COLOADER_SAVE_RECORD = '/api/addColoader';
  public static COLOADER_UPDATE_RECORD = '/api/updateColoader';
  public static COLOADER_FIND_BY_ID = '/api/findByColoaderId/';
  public static COLOADER_DELETE_RECORD = '/api/deleteColoader/';
  public static DOWNLOAD_COLOADER_REPORT = '/api/coloaderReport';

  // PAGE
  public static PAGE_SORT_AND_PAGING = '/api/page/getAllPaginationAndSort';
  public static PAGE_SAVE_RECORD = '/api/addPage';
  public static PAGE_UPDATE_RECORD = '/api/updatePage';
  public static PAGE_DELETE_RECORD = '/api/deletePage/';
  public static PAGE_FIND_BY_ID = '/api/findByPageId/';

  // USER
  public static USER_SORT_AND_PAGING = '/api/user/getAllPaginationAndSort';
  public static USER_DELETE_RECORD = '/api/deleteUser/';
  public static USER_SAVE_RECORD = '/api/addUser';
  public static USER_UPDATE_RECORD = '/api/updateUser';
  public static USER_FIND_BY_ID = '/api/findByUserId/';
  public static USER_GET_ALL_ROLE = '/api/getAllRole';
  public static DOWNLOAD_USER_REPORT = '/api/userReport';
  public static CHANGE_USER_PASSWORD = '/api/changePassword';

  // ROLE
  public static ROLE_SORT_AND_PAGING = '/api/role/getAllPaginationAndSort';
  public static ROLE_DELETE_RECORD = '/api/deleteRole/';
  public static ROLE_SAVE_RECORD = '/api/addRole';
  public static ROLE_UPDATE_RECORD = '/api/updateRole';
  public static ROLE_FIND_BY_ID = '/api/findByRoleId/';
  public static ROLE_GET_ALL_PAGE = '/api/getAllPage';

  // COURIER STATUS MAPPING
  public static COURIER_STATUS_MAPPING_SORT_AND_PAGING = '/api/courierStatusMapping/getAllPaginationAndSort';
  public static COURIER_STATUS_MAPPING_DELETE_RECORD = '/api/deleteCourierStatusMapping/';
  public static COURIER_STATUS_MAPPING_UPDATE_RECORD = '/api/updateCourierStatusMapping';
  public static COURIER_STATUS_MAPPING_FIND_BY_ID = '/api/findByCourierStatusMappingId/';
  public static COURIER_STATUS_MAPPING_SAVE_RECORD = '/api/addCourierStatusMapping';

  //  SERVICE TYPE
  public static SERVICE_TYPE_SORT_AND_PAGING = '/api/serviceType/getAllPaginationAndSort';
  public static SERVICE_TYPE_DELETE_RECORD = '/api/deleteServiceType/';
  public static SERVICE_TYPE_SAVE_RECORD = '/api/addServiceType';
  public static SERVICE_TYPE_UPDATE_RECORD = '/api/updateServiceType';
  public static SERVICE_TYPE_FIND_BY_ID = '/api/findByServiceTypeId/';
  public static GET_CLIENT_SERVICE_COURIER = '/api/getClientServiceCourier';

  //  SERVICE PROVIDER
  public static SERVICE_PROVIDER_SORT_AND_PAGING = '/api/serviceProvider/getAllPaginationAndSort';
  public static SERVICE_PROVIDER_DELETE_RECORD = '/api/deleteServiceProvider/';
  public static SERVICE_PROVIDER_SAVE_RECORD = '/api/addServiceProvider';
  public static SERVICE_PROVIDER_UPDATE_RECORD = '/api/updateServiceProvider';
  public static SERVICE_PROVIDER_FIND_BY_ID = '/api/findByServiceProviderId/';

  //  COURIER PRIORITY
  public static COURIER_PRIORITY_SORT_AND_PAGING = '/api/courierPriority/getAllPaginationAndSort';
  public static COURIER_PRIORITY_DELETE_RECORD = '/api/deleteCourierPriority/';
  public static COURIER_PRIORITY_SAVE_RECORD = '/api/addCourierPriority';
  public static COURIER_PRIORITY_UPDATE_RECORD = '/api/updateCourierPriority';
  public static COURIER_PRIORITY_FIND_BY_ID = '/api/findByCourierPriorityId/';
  public static GENERATE_ORDER_PRINT_LABEL = '/api/generateOrderPrintLabel';
  public static GENERATE_INVOICE_PRINT_LABEL = '/api/generateInvoicePrintLabel';

  //  STATUS
  public static STATUS_SORT_AND_PAGING = '/api/status/getAllPaginationAndSort';
  public static STATUS_DELETE_RECORD = '/api/deleteStatus/';
  public static STATUS_SAVE_RECORD = '/api/addStatus';
  public static STATUS_UPDATE_RECORD = '/api/updateStatus';
  public static STATUS_FIND_BY_ID = '/api/findBystatusId/';
  public static GET_ALL_STATUS = '/api/getAllStatus';

  //  STATUS TRANSITION
  public static STATUS_TRANSITION_SORT_AND_PAGING = '/api/statusTransition/getAllPaginationAndSort';
  public static STATUS_TRANSITION_DELETE_RECORD = '/api/deleteStatusTransition/';
  public static STATUS_TRANSITION_SAVE_RECORD = '/api/addStatusTransition';
  public static STATUS_TRANSITION_UPDATE_RECORD = '/api/updateStatusTransition';
  public static STATUS_TRANSITION_FIND_BY_ID = '/api/findByStatusTransitionId/';

  //  CONFIGRATION
  public static CONFIGRATION_SORT_AND_PAGING = '/api/configration/getAllPaginationAndSort';
  public static CONFIGRATION_DELETE_RECORD = '/api/deleteConfigration/';
  public static CONFIGRATION_SAVE_RECORD = '/api/addConfigration';
  public static CONFIGRATION_UPDATE_RECORD = '/api/updateConfigration';
  public static CONFIGRATION_FIND_BY_ID = '/api/findByConfigId/';

  //  STATUS FLOW
  public static STATUS_FLOW_SORT_AND_PAGING = '/api/statusFlow/getAllPaginationAndSort';
  public static STATUS_FLOW_DELETE_RECORD = '/api/deleteStatusFlow/';
  public static STATUS_FLOW_SAVE_RECORD = '/api/addStatusFlow';
  public static STATUS_FLOW_UPDATE_RECORD = '/api/updateStatusFlow';
  public static STATUS_FLOW_FIND_BY_ID = '/api/findByStatusFlowId/';
  public static STATUS_FLOW_GET_ALL_STATUS_TRANSITION = '/api/getAllStatusTransition';

  //  API-CONFIG
  public static API_CONFIG_SORT_AND_PAGING = '/api/apiConfig/getAllPaginationAndSort';
  public static API_CONFIG_DELETE_RECORD = '/api/deleteApiConfig/';
  public static API_CONFIG_SAVE_RECORD = '/api/addApiConfig';
  public static API_CONFIG_UPDATE_RECORD = '/api/updateApiConfig';
  public static API_CONFIG_FIND_BY_ID = '/api/findByApiConfigId/';

  //  DOMASTIC RATE CORD
  public static DOMASTIC_RATE_CARD_SORT_AND_PAGING = '/api/domasticRateCard/getAllPaginationAndSort';
  public static DOMASTIC_RATE_CARD_DELETE_RECORD = '/api/deleteDomasticRateCard/';
  public static DOMASTIC_RATE_CARD_SAVE_RECORD = '/api/addDomasticRateCard';
  public static DOMASTIC_RATE_CARD_UPDATE_RECORD = '/api/updateDomasticRateCard';
  public static DOWNLOAD_VIEW_CLIENT_RATE_REPORT = '/api/viewClientRateReport';
  public static DOWNLOAD_DOMESTIC_RATE_CARD_REPORT = '/api/domesticRateCardReport';

  // BULK_UPLOAD
  public static DOWNLOAD_FILE_ERROR_URL = '/api/downloadExcelFile';
  public static ALL_BULK_MASTER = '/api/getAllBulkMaster';
  public static BULK_UPLOAD_DOWNLOAD_SUCCESS_FILE = '/api/downloadExcelFile';
  public static BULK_UPLOAD_DOWNLOAD_TEMPLATE = '/api/downloadBulkTemplate';

  // SERVICEABLE PINCODE
  public static SERVICEABLE_PINCODE_DOWNLOAD_TEMPLATE = '/api/downloadBulkTemplate';
  public static SERVICEABLE_PINCODE_DOWNLOAD_SUCCESS_FILE = '/api/downloadExcelFile';
  public static SERVICEABLE_PINCODE_DOWNLOAD_FILE_ERROR_URL = '/api/downloadExcelFile';

  // ORDER PROCESSING
  public static GET_ALL_ORDER_RECEIVED = '/api/getAllOrderReceived';
  public static GET_ALL_ORDER_PROCESS = '/api/getAllOrderProcess';
  public static GET_ALL_ORDER_ASSIGNED = '/api/getAllOrderAssigned';
  public static ASSIGNED_COURIER = '/api/assigneeCourier';
  public static ASSIGNED_COURIER_BY_PRIORITY = '/api/assigneeCourierByPriority';
  public static ASSIGNED_COURIER_BULK = '/api/assigneeCourierBulk';
  public static DOWNLOAD_ORDER_RECEIVED_REPORT = '/api/downloadOrderReceivedReport';
  public static DOWNLOAD_ORDER_PROCESS_REPORT = '/api/downloadOrderProcessReport';
  public static DOWNLOAD_ORDER_ASSIGNED_REPORT = '/api/downloadOrderAssignedReport';

  // AWB_SERIES
  public static AWB_SERIES_DOWNLOAD_TEMPLATE = '/api/downloadBulkTemplate';
  public static AWB_SERIES_DOWNLOAD_SUCCESS_FILE = '/api/downloadExcelFile';
  public static AWB_SERIES_DOWNLOAD_FILE_ERROR_URL = '/api/downloadExcelFile';
  public static ALL_CLIENT = '/api/findByActiveClient';
  public static DOWNLOAD_PENDING_AWB_SERIE = '/api/downloadPendingAwbSeries';

  // SALE_ORDER
  public static SALE_ORDER_DOWNLOAD_TEMPLATE = '/api/downloadBulkTemplate';
  public static SALE_ORDER_DOWNLOAD_SUCCESS_FILE = '/api/downloadExcelFile';
  public static SALE_ORDER_DOWNLOAD_FILE_ERROR_URL = '/api/downloadExcelFile';


  // SALE_ORDER_SINGLE_UPLOAD
  public static SALE_ORDER_SINGLE_UPLOAD_SAVE_RECORD = '/api/addSaleOrder';
  // public static ALL_SALE_ORDER_SINGLE_UPLOAD = '/api/getAllClient';

  // Payment get way url
  public static SAVE_PAYMENT_GET_WAY_LOG = '/api/savePaymentGetWayLog';
  public static GET_PAYMENT_GET_WAY_CREDENTIAL = '/api/getPaymentGetWayCredential';
  public static GET_ALL_PAYMENT_GET_WAY_LOG = '/api/getAllPaymentGetWayLog';
  public static CREATE_PAYMENT_GET_WAY_ORDER = '/api/createPaymentOrder';
  public static GET_ALL_SALE_ORDER_TRANSACTION_LOG = '/api/getAllSaleOrderTransactions';
  public static ADD_PAYMENT = '/api/clientWalletManualRecharge';
  public static GET_ALL_CLIENT_WALLET = '/api/getAllClientWallet';
  public static DOWNLOAD_PAYMENT_GET_WAY_LOG_REPORT = '/api/downloadPaymentGetWayLogsReport';
  public static DOWNLOAD_SALE_ORDER_TRANSACTION_LOG_REPORT = '/api/saleOrderTransactionLogReport';

  // ORDER_LBH
  public static ORDER_LBH_DOWNLOAD_TEMPLATE = '/api/downloadBulkTemplate';
  public static ORDER_LBH_DOWNLOAD_SUCCESS_FILE = '/api/downloadExcelFile';
  public static ORDER_LBH_FILE_ERROR_URL = '/api/downloadExcelFile';

  // CLIENT_WARE_HOUSE
  public static CLIENT_WAREHOUSE_SORT_AND_PAGING = '/api/clientWarehouse/getAllPaginationAndSort';
  public static CLIENT_WAREHOUSE_DELETE_RECORD =  '/api/deleteClientWarehouse/';
  public static CLIENT_WAREHOUSE_SAVE_RECORD = '/api/addClientWarehouse';
  public static CLIENT_WAREHOUSE_UPDATE_RECORD = '/api/updateClientWarehouse';
  public static CLIENT_WAREHOUSE_FIND_BY_ID = '/api/findByClientWarehouseId/';
  public static GET_LOGIN_USER_WAREHOUSES = '/api/getLoginUserWarehouses';
  public static DOWNLOAD_CLIENT_WAREHOUSE_REPORT = '/api/clientWarehouseReport';

  // THREEPL_MANIFAST
  public static THREEPL_MANIFAST_SORT_AND_PAGING = '/api/threeplManifest/getAllThreeplManifest';
  public static THREEPL_MANIFAST_SAVE_RECORD = '/api/addThreeplManifest';
  public static THREEPL_MANIFAST_UPDATE_RECORD = '/api/updateManifest';
  public static THREEPL_MANIFAST_FIND_ID = '/api/findByManifestId/';
  public static GET_MANIFEST_AND_SALE_ORDERS = '/api/getManifestAndSaleOrders/';
  public static GENERATE_MANIFEST_PRINT_LABEL = '/api/generateManifestPrintLabel';
  public static DOWLOAD_POD_FILE = '/api/download3PlManifestPod';
  public static GET_ALL_PENDING_FOR_3PL_MANIFEST = '/api/getAllPendingFor3PlManifest';
  public static GET_ALL_POD_UPLOADED_MANIFEST = '/api/getAllPodUploadedManifest';
  // public static THREEPL_MANIFAST_FIND_BY_AMB = '/api/packetHistory/findByAwbNumber/';

  // CLIENT COURIER WAREHOUSE MAPPING
  public static CLIENT_COURIER_WAREHOUSE_MAPPING_SORT_AND_PAGING = '/api/clientCourierWarehouseMapping/getAllPaginationAndSort';
  public static CLIENT_COURIER_WAREHOUSE_MAPPING_DELETE_RECORD =  '/api/deleteClientCourierWarehouseMapping/';
  public static CLIENT_COURIER_WAREHOUSE_MAPPING_SAVE_RECORD = '/api/addClientCourierWarehouseMapping';
  public static CLIENT_COURIER_WAREHOUSE_MAPPING_UPDATE_RECORD = '/api/updateClientCourierWarehouseMapping';
  public static CLIENT_COURIER_WAREHOUSE_MAPPING_FIND_BY_ID = '/api/findByClientCourierWarehouseMappingId/';
  public static DOWNLOAD_CLIENT_COURIER_WAREHOUSE_MAPPING_REPORT = '/api/clientCourierWarehouseMappingReport';

  // CLIENT REMITTANCE
  public static CLIENT_REMITTANCE_GENERATED_RECODS = '/api/getAllClientGeneratedRemittance';
  public static CLIENT_REMITTANCE_CLOSED_RECODS = '/api/getAllClientClosedRemittance';
  public static CLIENT_REMITTANCE_FIND_BY_ID = '/api/findByClientRemittanceId/';
  public static DOWNLOAD_DELOSIT_SLIP = '/api/downloadDepositeSlipFile';
  public static GET_PENDING_SALE_ORDER_FOR_CLIENT_RMT = '/api/getAllPendingForClientRemittance';
  public static CLIENT_REMITTANCE_REPORT = '/api/clientRemittanceReport/';
  public static DELETE_CLIENT_REMITTANCE = '/api/deleteClientRemittance/';


  // COURIER REMITTANCE
  public static AWB_NO_PENDING_FOR_COURIER_REMITTANCE = '/api/awbNOReadyForCourierRemittance/';
  public static COURIER_REMITTANCE_REPORT = '/api/courierRemittanceReport/';
  public static GET_PENDING_SALE_ORDER_FOR_COURIER_RMT = '/api/getAllPendingForCourierRemittance';

  // MASTER REPORT
  public static GENERATE_MASTER_REPORT = '/api/generateMasterReport';

  // COURIER REMITTANCE
  public static COURIER_REMITTANCE_CLOSED_RECODS = '/api/getAllCourierClosedRemittance';

  // SUPPORT
  public static UPDATE_PACKET_STATUS = '/api/packetHistory/updatePacketStatus/';
  public static ORDER_CANCILATTION = '/api/orderCancellation/';
  public static GET_DECLARED_CLASS_FIELDS = '/api/getDeclaredClassFields';
  public static UPDATE_DECLARED_CLASS_FIELDS = '/api/updateDeclaredClassFields';

  // ORDER STATUS
  public static GET_ALL_IN_TARNSIT_ORDER = '/api/getInTransitOrder';
  public static GET_ALL_DELIVERD_ORDER = '/api/getDeliverdOrder';
  public static GET_ALL_OFD_ORDER = '/api/getOutForDeliveryOrder';
  public static GET_ALL_RTO_ORDER = '/api/getRTOOrder';
  public static GET_ALL_CANCELLED_ORDER = '/api/getCancelledOrder';
  public static GET_ALL_DELIVERY_ATTEMPTED_ORDER = '/api/getDeliveryAttemptedOrder';

  public static DOWNLOAD_IN_TRANSIT_ORDER_REPORT = '/api/downloadInTransitOrderReport';
  public static DOWNLOAD_DELIVERD_REPORT = '/api/downloadDeliverdOrderReport';
  public static DOWNLOAD_OUR_FOR_DELIVERY_ORDER_REPORT = '/api/downloadOutForDeliveryOrderReport';
  public static DOWNLOAD_RTO_REPORT = '/api/downloadRTOOrderReport';
  public static DOWNLOAD_CANCELLED_ORDER_REPORT = '/api/downloadCancelledOrderReport';
  public static DOWNLOAD_DELIVERY_ATTEMPTED_REPORT = '/api/downloadDeliveryAttemptedOrderReport';

  // TRACKING
  public static TRACKING = '/api/tracking';

  // DATA PUSH ERROR AND SECCESS LOG
  public static DATA_PUSH_ERROR_LOG = '/api/dataPushErrorLog/getAllDataPushErrorLogPaginationAndSort';
  public static DATA_PUSH_SUCCESS_LOG = '/api/dataPushSuccessLog/getAllDataPushSuccessLogPaginationAndSort';

  // PENDINGH VENDOAR STATUS MAPPING
  public static PENDINGH_VENDOAR_STATUS_MAPPING = '/api/pendingVendarStatusMapping/getAllPendingVendarStatusMappingPaginationAndSort';
  public static PENDINGH_VENDOAR_STATUS_MAPPING_DELETE_RECORD = '/api/deletePendingVendarStatusMapping/';

  // RATE CARD TYPE
  public static GET_ALL_RATE_CARD_TYPE = '/api/getAllRateCardType';
  public static RATE_CARD_TYPE_SAVE_RECORD = '/api/addRateCardType';
  public static RATE_CARD_TYPE_DELETE_RECORD = '/api/deleteRateCardType/';
  public static RATE_CARD_TYPE_FIND_BY_ID = '/api/findByRateCardTypeId/';
  public static RATE_CARD_TYPE_UPDATE = '/api/updateRateCardType/';
  public static GET_ALL_ACTIVE_RATE_CARD_TYPE = '/api/getAllActiveRateCardType';

  // Upload Document Controller URL hear
  public static UPLOAD_DOC = '/api/docController/uploadDoc';
}

