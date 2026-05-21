import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../../models/product';

@Injectable({
  providedIn: 'root',
})
export class ServMarketJson {
  private vitrinaUrl = 'http://127.0.0.1:3000/productos';
  private misProductosUrl = 'http://127.0.0.1:3000/mis-productos';
  
  private http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.vitrinaUrl);
  }

  getMisProductos(): Observable<Product[]> {
    return this.http.get<Product[]>(this.misProductosUrl);
  }

  addProductoPropio(product: Product): Observable<Product> {
    return this.http.post<Product>(this.misProductosUrl, product);
  }

  updateProductoPropio(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.misProductosUrl}/${product.id}`, product);
  }

  deleteProduct(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.misProductosUrl}/${id}`);
  }
}
