import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../../../services/order.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css'
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading: boolean = true;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data.sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
        this.loading = false;
      }
    });
  }

  formatDate(date: any): string {
    return new Date(date).toLocaleString();
  }
}
