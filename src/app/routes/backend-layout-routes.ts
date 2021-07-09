import { Routes } from '@angular/router';
import {LogisticsModule} from '../logistics/logistics.module';
export const BACKEND_LAYOUT: Routes = [
  {
    path: '', loadChildren: () => LogisticsModule
  }];
