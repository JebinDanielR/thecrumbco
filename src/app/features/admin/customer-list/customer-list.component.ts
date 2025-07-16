import { Component } from '@angular/core';
import { Customer } from '../../../models/customer.model';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-customer-list',
  imports: [],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css'
})
export class CustomerListComponent {

  loading: boolean = false;
  customers: Customer[] = [];
  errorMessage: string ='';
  products: Product[] = [];

constructor(private productService:ProductService){}

ngOnInit(): void{
this.fetchCustomers();
this.fetchProducts();
}

fetchCustomers():void {
  this.loading = true;
  this.productService.getCustomers().subscribe({
    next: (data:Customer[]) => {
      this.customers = data;
      this.loading = false;
    },
    error: (err) => {
      this.errorMessage="Something went wrong" + err;
      this.loading =false;

    }
  })
}

fetchProducts():void{
  this.productService.getProducts().subscribe({
    next: (data:Product[]) => {
      this.products = data;
    },
    error:(err)  => {
      console.error(err);
    }
  })
}




}
