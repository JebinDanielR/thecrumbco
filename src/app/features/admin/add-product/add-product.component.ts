import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-add-product',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {

  addProductForm !:FormGroup;
  submissionSuccess: boolean= false;
  submissionError: string ='';

  constructor(private fb:FormBuilder, private productService:ProductService) {}

  ngOnInit(): void {
    this.addProductForm = this.fb.group({
      name: ['',[Validators.required, Validators.minLength(5)]],
      desc: ['',[Validators.required]],
      price: [0,[Validators.required]],
      img:['',[Validators.required]]
    });
  }
  get name() {
    return this.addProductForm.get('name');
  }

  get desc() {
    return this.addProductForm.get('desc');
  }

  get price() {
    return this.addProductForm.get('price');
  }
  get img() {
    return this.addProductForm.get('img');
  }

  onSubmit(): void {
    if(this.addProductForm.invalid) return;

    const newProduct: Product = {
      id:0,
      name: this.addProductForm.value.name,
      desc: this.addProductForm.value.desc,
      price: this.addProductForm.value.price,
      img: this.addProductForm.value.img
    }

    this.productService.addProduct(newProduct).subscribe({
      next: (customer) => {
        console.log('Customer signed up', customer);
        this.submissionSuccess = true;
        this.addProductForm.reset();
      },

      error: (err) => {
        console.log('Error',err);
        this.submissionError = 'There was some error: '+err;
      }
    })
  }

}
