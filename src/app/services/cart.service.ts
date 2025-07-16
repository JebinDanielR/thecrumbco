import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: Product[] = [];

  constructor() {
    
  }



  addToCart(product: Product) {
    const existing = this.cartItems.find(p => p.id === product.id);
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      this.cartItems.push({ ...product, qty: 1 });
    }

  }

  getCartItems(): Product[] {
    return this.cartItems;
  }

  removeItem(productId: number) {
    this.cartItems = this.cartItems.filter(p => p.id !== productId);
    
  }

  clearCart() {
    this.cartItems = [];
    
  }

  updateQty(productId: number, qty: number) {
    const item = this.cartItems.find(p => p.id === productId);
    if (item) {
      item.qty = qty;
      
    }
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
  }
}
