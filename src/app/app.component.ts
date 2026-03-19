import { Component } from '@angular/core';
import { RouterModule, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { ChatbotComponent } from "./chatbot/chatbot.component";
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, ChatbotComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'thecrumbco';
  cartAnimating = false;

  showNav = true;

  constructor(
    public authService: AuthService, 
    public cartService: CartService,
    private router: Router
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const currentUrl = (event as NavigationEnd).urlAfterRedirects || (event as NavigationEnd).url;
      this.showNav = !currentUrl.includes('/thecrumbco/signup');
    });

    // 🔔 Listen for cart updates to trigger animation
    this.cartService.addToCartTrigger$.subscribe(() => {
      this.cartAnimating = true;
      setTimeout(() => this.cartAnimating = false, 1000); 
    });
  }

  getFavoriteCount(): number {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.length;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/thecrumbco/signup']);
  }
}
