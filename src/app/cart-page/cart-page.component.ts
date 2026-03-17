import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { Product } from '../models/product.model';
import { CartService } from '../services/cart.service';



@Component({
  selector: 'app-cart-page',
  imports: [CurrencyPipe,RouterModule],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
})
export class CartPageComponent {
  cartItems: Product[] = [];
  total: number = 0;

  constructor(private cartService: CartService, private router:Router) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    // this.cartItems = this.cartService.getCartItems();
    this.cartService.cart$.subscribe(items => {
  this.cartItems = items;
});
    this.total = this.cartService.getTotalPrice();
  }

  removeItem(id: number): void {
    this.cartService.removeItem(id);
    this.loadCart();
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce((sum, item) => {
      return sum + item.price * (item.qty || 1);
    }, 0);
  }

  increaseQty(item: Product): void {
    item.qty! += 1;
    this.cartService.updateQty(item.id, item.qty!);
    this.calculateTotal();
  }
  
  decreaseQty(item: Product): void {
    if (item.qty! > 1) {
      item.qty! -= 1;
      this.cartService.updateQty(item.id, item.qty!);
      this.calculateTotal();
    }
  }

  goToCheckout(): void {
    if (this.cartItems.length > 0) {
      this.router.navigate(['/thecrumbco/checkout']);
    } else {
      alert('Your cart is empty!');
    }
  }

  goToProducts(): void {
      this.router.navigate(['/thecrumbco/products']);
  }
}
