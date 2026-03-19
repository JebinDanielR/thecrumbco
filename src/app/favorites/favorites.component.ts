import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {
  favoriteItems: any[] = [];

  constructor(public cartService: CartService) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    const stored = localStorage.getItem('favorites');
    this.favoriteItems = stored ? JSON.parse(stored) : [];
  }

  addToCart(item: any) {
    this.cartService.addToCart(item);
  }

  removeFromFavorites(id: number) {
    this.favoriteItems = this.favoriteItems.filter(item => item.id !== id);
    localStorage.setItem('favorites', JSON.stringify(this.favoriteItems));
  }
}
