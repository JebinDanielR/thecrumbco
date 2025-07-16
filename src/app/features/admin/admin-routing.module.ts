import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { CustomerListComponent } from './customer-list/customer-list.component';

const routes: Routes = [
  {
    path: '',
    component:AdminDashboardComponent,
    children: [
      
        {path: 'addproduct', component:AddProductComponent},
        {path: 'customerlist', component:CustomerListComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
