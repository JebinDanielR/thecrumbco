import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Customer } from '../models/customer.model';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { AuthService } from '../services/auth.service';

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
  isLoginMode: boolean = true;
  

  constructor(private fb:FormBuilder, private router:Router, private productService:ProductService, private authService: AuthService){}

  ngOnInit(){
    this.signUpForm = this.fb.group({
      name: ['', this.isLoginMode ? [] : [Validators.required, Validators.minLength(3)]],
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

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.submissionError = '';
    this.submissionSuccess = false;
    
    if (this.isLoginMode) {
      this.signUpForm.get('name')?.clearValidators();
    } else {
      this.signUpForm.get('name')?.setValidators([Validators.required, Validators.minLength(3)]);
    }
    this.signUpForm.get('name')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if(this.signUpForm.invalid) return;

    const { email, password, name } = this.signUpForm.value;

    if (this.isLoginMode) {
      this.authService.login(email, password).subscribe({
        next: (success) => {
          if (success) {
            this.submissionSuccess = true;
          } else {
            this.submissionError = 'Invalid email or password.';
          }
        },
        error: err => {
          this.submissionError = 'Login failed: ' + err.message;
        }
      });
    } else {
      const newCustomer: Customer = {
        id: 0,
        name: name,
        email: email,
        password: password
      };

      this.authService.signup(newCustomer).subscribe({
        next: (customer) => {
          console.log('Customer signed up', customer);
          this.submissionSuccess = true;
          this.signUpForm.reset();
        },
        error: err => {
          console.log('Error', err);
          this.submissionError = 'Signup failed: ' + (err.error?.message || err.message);
        }
      });
    }
  }
}
