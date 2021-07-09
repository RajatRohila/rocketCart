import {Courierstatusmapping} from './courierstatusmapping.model';

export class CourierStatusMapping {
  id: number;
  courierId: any;
  token: any;
  active: any;
  serviceProviderId: any;
  statusMappings: Array<Courierstatusmapping>;
}
