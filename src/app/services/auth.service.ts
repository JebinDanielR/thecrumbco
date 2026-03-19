import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of, map } from 'rxjs';
import { Customer } from '../models/customer.model';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/customers`;
  private loggedInUserKey = 'currentUser';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<boolean> {
    return this.http.get<Customer[]>(`${this.baseUrl}?email=${email}&password=${password}`).pipe(
      map(users => {
        if (users.length > 0) {
          localStorage.setItem(this.loggedInUserKey, JSON.stringify(users[0]));
          return true;
        }
        return false;
      })
    );
  }

  signup(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.baseUrl, customer).pipe(
      tap(newCustomer => {
        localStorage.setItem(this.loggedInUserKey, JSON.stringify(newCustomer));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.loggedInUserKey);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.loggedInUserKey) !== null;
  }

  getCurrentUser(): Customer | null {
    const userJson = localStorage.getItem(this.loggedInUserKey);
    return userJson ? JSON.parse(userJson) : null;
  }
}
