import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { AdminOverviewComponent } from './admin-overview/admin-overview.component';
import { AdminOrdersComponent } from './admin-orders/admin-orders.component';
import { ProductManagementComponent } from './product-management/product-management.component';

const routes: Routes = [
  {
    path: '',
    component:AdminDashboardComponent,
    children: [
        {path: '', component: AdminOverviewComponent},
        {path: 'productmgmt', component: ProductManagementComponent},
        {path: 'customerlist', component:CustomerListComponent},
        {path: 'vieworders', component: AdminOrdersComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
