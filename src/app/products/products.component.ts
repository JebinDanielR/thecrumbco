import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../models/product.model';
import { ProductCardComponent } from "../product-card/product-card.component";
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-products',
  imports: [ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  title :string = "Our Products";
 
  products : Product [] = [ ] 
  cart :string [] = []

  constructor(private productService:ProductService, private route:ActivatedRoute){
           
  }

  ngOnInit(): void{
    // this.route.queryParamMap.subscribe(params => {
    //   const description = params.get('desc');
    //   this.loadCourses(description);
    // })
    this.productService.getProducts().subscribe({
          next:(response:Product[])=>{
            this.products=response;
          },
          error:(err)=>{
            console.log(err);
          }
        });
        console.log("initialized");
  }

  
  //  loadCourses(desc: string|null){
  //   this.productService.getProducts(desc).subscribe({
  //     next:(response:Product[])=>{
  //       this.products=response;
  //     },
  //     error:(err)=>{
  //       console.log(err);
  //     }
  //   });
  //   console.log("initialized");
  // }

}
