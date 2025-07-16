import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Customer } from '../models/customer.model';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-signup-form',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './signup-form.component.html',
  styleUrl: './signup-form.component.css'
})
export class SignupFormComponent implements OnInit{
  signUpForm !:FormGroup;
  products:Product[]=[];
  submissionSuccess: boolean= false;
  submissionError: string ='';
  

  constructor(private fb:FormBuilder, private router:Router,private productService:ProductService){}

  ngOnInit(){
    this.signUpForm = this.fb.group({
      name: ['',[Validators.required, Validators.minLength(3)]],
      email:['',[Validators.required, Validators.email]],
      password:  ['',[Validators.required, Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]]  
    });

    this.productService.getProducts().subscribe({
      next:(data:Product[]) =>{
        this.products=data;
      },
      error: (err) =>{
        console.error("Error in fetching courses", err);
      }
    });
  }
  get name() {
    return this.signUpForm.get('name');
  }
 
  get email() {
    return this.signUpForm.get('email');
  }
 
  get password() {
    return this.signUpForm.get('password');
  }

  goToHome(): void {
    this.router.navigate(['/thecrumbco']);
}

  onSubmit(): void {
    if(this.signUpForm.invalid) return;

    const newCustomer: Customer = {
      id:0,
      name: this.signUpForm.value.name,
      email: this.signUpForm.value.email,
      password: this.signUpForm.value.password
    }

    this.productService.addCustomer(newCustomer).subscribe({
      next: (customer) => {
        console.log('Customer signed up', customer);
        this.submissionSuccess = true;
        this.signUpForm.reset();
      },

      error:err => {
        console.log('Error',err);
        this.submissionError = 'There was some error: '+err;
      }
    })
  }
}
