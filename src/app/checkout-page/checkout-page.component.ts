import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '../models/product.model';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../services/order.service';

declare var Razorpay: any;

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.css',
  imports: [ReactiveFormsModule, CommonModule]
})
export class CheckoutPageComponent implements OnInit {
  checkoutForm!: FormGroup;
  cartItems: Product[] = [];
  total: number = 0;
  orderPlaced = false;
  isProcessingPayment = false;
  paymentSuccess = false;

  constructor(
    private fb: FormBuilder, 
    private cartService: CartService, 
    private router:Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    this.total = this.cartService.getTotalPrice();

    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
    });
  }

  payNow(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    if (this.total <= 0) {
      alert('Your cart is empty! Please add items before checkout.');
      return;
    }

    // 🕊️ Mode: Auto-Success (Bypass Razorpay Modal for now)
    console.log('Initiating Secure Payment Simulation...');
    this.isProcessingPayment = true;

    // Simulate 3 seconds of "Secure Transaction Authorization"
    setTimeout(() => {
      const mockPaymentId = 'MOCK_PAYID_' + Math.random().toString(36).substring(7).toUpperCase();
      console.log('Payment Authorized (Mock Mode):', mockPaymentId);
      this.processPaymentSuccess(mockPaymentId);
    }, 3000);

    /* 
    // Razorpay Integration (Re-enable when you have your KEY_ID)
    const options = {
      key: 'YOUR_KEY_HERE', 
      amount: Math.round(this.total * 100),
      ...
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    */
  }

  processPaymentSuccess(paymentId: string): void {
    this.isProcessingPayment = false;
    this.paymentSuccess = true;
    
    // Record order in backend via OrderService
    setTimeout(() => {
      const order: Order = {
        ...this.checkoutForm.value,
        items: this.cartItems.map(i => ({ name: i.name, price: i.price, qty: i.qty })),
        total: this.total,
        paymentId: paymentId,
        placedAt: new Date()
      };

      this.orderService.placeOrder(order).subscribe({
        next: (res) => {
          console.log('Order saved to database:', res);
          this.orderPlaced = true;
          this.cartService.clearCart();
          this.checkoutForm.reset();
        },
        error: (err) => {
          console.error('Failed to save order:', err);
          alert('Order placed successfully (Payment ID: ' + paymentId + '), but we had trouble saving it. Please contact support.');
          this.orderPlaced = true;
          this.cartService.clearCart();
        }
      });
    }, 2000);
  }

  onSubmit(): void {
    console.log('Form Submit triggered');
  }

  closePopup(): void {
    this.orderPlaced = false;
    this.paymentSuccess = false;
    this.router.navigate(['/thecrumbco']);
  }

  goToHome(): void {
    this.router.navigate(['/thecrumbco']);
  }
}
