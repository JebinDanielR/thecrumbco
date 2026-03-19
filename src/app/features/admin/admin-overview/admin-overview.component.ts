import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { OrderService } from '../../../services/order.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-overview.component.html',
  styleUrl: './admin-overview.component.css'
})
export class AdminOverviewComponent implements OnInit {
  productCount: number = 0;
  customerCount: number = 0;
  totalValue: number = 0;
  totalRevenue: number = 0;
  orderCount: number = 0;
  loading: boolean = true;

  constructor(
    private productService: ProductService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    forkJoin({
      products: this.productService.getProducts(),
      customers: this.productService.getCustomers(),
      orders: this.orderService.getOrders()
    }).subscribe({
      next: (data) => {
        this.productCount = data.products.length;
        this.customerCount = data.customers.length;
        this.orderCount = data.orders.length;
        
        // Calculate "Total Store Value" from products
        this.totalValue = data.products.reduce((acc, curr) => acc + Number(curr.price), 0);
        
        // Calculate Total Revenue from orders
        this.totalRevenue = data.orders.reduce((acc, order) => acc + (order.total || 0), 0);
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching dashboard stats', err);
        this.loading = false;
      }
    });
  }
}
