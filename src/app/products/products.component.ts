import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../models/product.model';
import { ProductCardComponent } from "../product-card/product-card.component";
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductCardComponent, CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  title :string = "Our Products";
  products : Product [] = [ ] 
  filteredProducts: Product[] = [];
  searchQuery: string = '';
  isLoading: boolean = true;

  constructor(private productService:ProductService, private route:ActivatedRoute){}

  ngOnInit(): void{
    this.isLoading = true;
    this.productService.getProducts().subscribe({
          next:(response:Product[])=>{
            this.products=response;
            this.filteredProducts = response;
            // Delay slightly for skeleton loading effect
            setTimeout(() => this.isLoading = false, 1500);
          },
          error:(err)=>{
            console.log(err);
            this.isLoading = false;
          }
        });
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.filteredProducts = this.products;
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredProducts = this.products.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.desc.toLowerCase().includes(query)
      );
    }
  }
}
