import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../models/product.model';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe,CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent implements OnInit {
  @Input() product: any;
  isFavorite: boolean = false;

  ngOnInit(): void {
    this.loadFavoriteStatus();
  }

constructor(private cartService: CartService, router:Router) {}


loadFavoriteStatus() {
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  this.isFavorite = favorites.some((item: any) => item.id === this.product.id);
}

toggleFavorite() {
  let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

  const index = favorites.findIndex((item: any) => item.id === this.product.id);

  if (index > -1) {
    // Remove from favorites
    favorites.splice(index, 1);
    this.isFavorite = false;
  } else {
    // Add to favorites
    favorites.push(this.product);
    this.isFavorite = true;
  }

  localStorage.setItem('favorites', JSON.stringify(favorites));
}

  addToCart() {
    this.cartService.addToCart(this.product);
    alert(`${this.product.name} added to cart`);
  }



}
