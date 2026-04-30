import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface OrderResponse {
  id: string;
  status: string;
  links?: { rel: string; href: string }[];
}

@Injectable({ providedIn: 'root' })
export class PaypalService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/paypal`;

  createOrder(payload: {items: any[]; total: number}): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.apiUrl}/create-order`, payload);
  }

  captureOrder(orderId: string) {
    return this.http.post<any>(`${this.apiUrl}/capture-order`, { orderId });
  }
}