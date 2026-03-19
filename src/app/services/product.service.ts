import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model';
import { Product } from '../models/product.model';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = environment.apiUrl;

  constructor(private httpResource:HttpClient) { }

  getProducts(desc?:string|null): Observable <Product[]>{
    let url = `${this.baseUrl}/products`;
    if(desc){
      url += `?desc=${desc}`;
    }
    return this.httpResource.get<Product[]>(url);
  }

  getProductsbyId(id:number): Observable<Product>{
    return this.httpResource.get<Product>(`${this.baseUrl}/products/${id}`);
}

  getCustomers(): Observable<Customer[]> {
  return this.httpResource.get<Customer[]>(`${this.baseUrl}/customers`);
  }

  addCustomer(customer:Customer): Observable<Customer>{
    return this.httpResource.post<Customer>(`${this.baseUrl}/customers`,customer);
  }

  addProduct(product:Product): Observable<Product>{
    return this.httpResource.post<Product>(`${this.baseUrl}/products`,product);
  }

  updateProduct(product: Product): Observable<Product> {
    return this.httpResource.put<Product>(`${this.baseUrl}/products/${product.id}`, product);
  }

  deleteProduct(id: string | number): Observable<void> {
    return this.httpResource.delete<void>(`${this.baseUrl}/products/${id}`);
  }
}
