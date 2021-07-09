import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultLayoutComponent } from './layouts/default-layout/default-layout.component';
import { DEFAULT_ROUTES } from './routes/default-layout-routes';
import { BACKEND_LAYOUT } from './routes/backend-layout-routes';
import { BackendLayoutComponent } from './layouts/backend-layout/backend-layout.component';
import {HomeComponent} from './logistics/home/home.component';
import {BulkheaderComponent} from './logistics/bulkheader/bulkheader.component';
const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'main', component: DefaultLayoutComponent, children: DEFAULT_ROUTES, },
  { path: 'backend', component: BackendLayoutComponent, children: BACKEND_LAYOUT },
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
