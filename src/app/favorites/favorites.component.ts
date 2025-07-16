import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-favorites',
  imports: [CurrencyPipe],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent {
  favoriteItems: any[] = [];

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    const stored = localStorage.getItem('favorites');
    this.favoriteItems = stored ? JSON.parse(stored) : [];
  }

  removeFromFavorites(id: number) {
    this.favoriteItems = this.favoriteItems.filter(item => item.id !== id);
    localStorage.setItem('favorites', JSON.stringify(this.favoriteItems));
  }
}
