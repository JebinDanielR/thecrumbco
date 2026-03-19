import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.css'
})
export class ProductManagementComponent implements OnInit {
  products: Product[] = [];
  productForm!: FormGroup;
  isEditing = false;
  editingProductId: string | number | null = null;
  showForm = false;
  submissionSuccess = false;
  submissionError = '';
  loading = true;

  constructor(private fb: FormBuilder, private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.initForm();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      desc: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      img: ['', [Validators.required]]
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.loading = false;
      }
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  editProduct(product: Product): void {
    this.isEditing = true;
    this.editingProductId = product.id;
    this.showForm = true;
    this.productForm.patchValue({
      name: product.name,
      desc: product.desc,
      price: product.price,
      img: product.img
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteProduct(id: string | number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== id);
        },
        error: (err) => console.error('Error deleting product:', err)
      });
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const productData: Product = {
      id: this.isEditing ? this.editingProductId! : 0,
      ...this.productForm.value
    };

    if (this.isEditing) {
      this.productService.updateProduct(productData).subscribe({
        next: (updated) => {
          const index = this.products.findIndex(p => p.id === updated.id);
          if (index !== -1) this.products[index] = updated;
          this.handleSuccess('Product updated successfully!');
        },
        error: (err) => this.handleError(err)
      });
    } else {
      this.productService.addProduct(productData).subscribe({
        next: (added) => {
          this.products.push(added);
          this.handleSuccess('Product added successfully!');
        },
        error: (err) => this.handleError(err)
      });
    }
  }

  handleSuccess(message: string): void {
    this.submissionSuccess = true;
    setTimeout(() => {
      this.submissionSuccess = false;
      this.resetForm();
      this.showForm = false;
    }, 2000);
  }

  handleError(err: any): void {
    this.submissionError = 'An error occurred. Please try again.';
    console.error(err);
    setTimeout(() => this.submissionError = '', 3000);
  }

  resetForm(): void {
    this.isEditing = false;
    this.editingProductId = null;
    this.productForm.reset({ price: 0 });
  }
}
