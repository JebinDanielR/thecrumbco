import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItems: Product[] = [];

  // 🔥 Reactive cart stream
  private cartSubject = new BehaviorSubject<Product[]>([]);

  cart$ = this.cartSubject.asObservable();

  constructor() {}

  // ✅ Add to cart
  addToCart(product: Product) {

    const existing = this.cartItems.find(p => p.id === product.id);

    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      this.cartItems.push({ ...product, qty: 1 });
    }

    this.cartSubject.next(this.cartItems);
  }

  // ✅ Get cart (normal)
  getCartItems(): Product[] {
    return this.cartItems;
  }

  // ✅ Remove item
  removeItem(productId: number) {

    this.cartItems = this.cartItems.filter(p => p.id !== productId);

    this.cartSubject.next(this.cartItems);
  }

  // ✅ Clear cart
  clearCart() {

    this.cartItems = [];

    this.cartSubject.next(this.cartItems);
  }

  // ✅ Update quantity
  updateQty(productId: number, qty: number) {

    const item = this.cartItems.find(p => p.id === productId);

    if (item) {
      item.qty = qty;
    }

    this.cartSubject.next(this.cartItems);
  }

  // ✅ Total price
  getTotalPrice(): number {

    return this.cartItems.reduce(
      (sum, item) => sum + item.price * (item.qty || 1),
      0
    );
  }

}