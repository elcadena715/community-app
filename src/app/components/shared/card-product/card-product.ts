import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../models/product';

@Component({
  selector: 'app-card-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-product.html',
  styleUrls: ['./card-product.css'] 
})
export class CardProductComponent {
  @Input({ required: true }) producto!: Product;
  @Output() onContactar = new EventEmitter<Product>();
}