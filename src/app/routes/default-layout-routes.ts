import { Routes } from '@angular/router';
import {AuthModule} from '../auth/auth.module';
export const DEFAULT_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () => AuthModule
  }];



