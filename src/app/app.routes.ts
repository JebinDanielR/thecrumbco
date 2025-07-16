import { Routes } from '@angular/router';
import { AboutPageComponent } from './about-page/about-page.component';
import { CartPageComponent } from './cart-page/cart-page.component';
import { CheckoutPageComponent } from './checkout-page/checkout-page.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ProductsComponent } from './products/products.component';
import { SignupFormComponent } from './signup-form/signup-form.component';

export const routes: Routes = [
    {path: '',redirectTo:'thecrumbco',pathMatch:'full'},
    {path:'thecrumbco',component:HomePageComponent},
    {path:'thecrumbco/products',component:ProductsComponent},
    {path:'thecrumbco/cart',component:CartPageComponent},
    {path:'thecrumbco/checkout',component:CheckoutPageComponent},
    // { path: '', redirectTo: '/cart', pathMatch: 'full' },
    {path:'thecrumbco/about',component:AboutPageComponent},
    {path:'thecrumbco/favorites',component:FavoritesComponent},
    {path:'thecrumbco/signup',component:SignupFormComponent},
    // {path:'thecrumbco/cart', loadChildren: () => import('./features/cart/cart.module').then(m => m.CartModule)}
    {path:'thecrumbco/admin', loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule)}

];
