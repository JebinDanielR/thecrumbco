import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '../models/product.model';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.css',
  imports: [ReactiveFormsModule]
})
export class CheckoutPageComponent implements OnInit {
  checkoutForm!: FormGroup;
  cartItems: Product[] = [];
  total: number = 0;
  orderPlaced = false;

  constructor(private fb: FormBuilder, private cartService: CartService, private router:Router) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    this.total = this.cartService.getTotalPrice();

    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      pincode: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      const order = {
        ...this.checkoutForm.value,
        items: this.cartItems,
        total: this.total,
        placedAt: new Date()
      };

      // Simulate placing order (can replace with real API call)
      console.log('Order Placed:', order);

      this.orderPlaced = true;
      this.cartService.clearCart();
      this.checkoutForm.reset();
    }
  }

  closePopup(): void {
    this.orderPlaced = false;
    this.router.navigate(['/thecrumbco']);
}
  }
  

