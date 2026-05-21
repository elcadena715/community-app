import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { Product } from '../../../models/product';
import { ServMarketJson } from '../../../services/market/serv-market-json';
import { FilterPipe } from '../../shared/pipes/pipes';
import { CardProductComponent } from '../../shared/card-product/card-product';
import { AppDialogComponent } from '../../shared/app-dialog/app-dialog';
import { filter } from 'rxjs/internal/operators/filter';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';

@Component({
  selector: 'app-market-list',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterPipe,CardProductComponent,AppDialogComponent],
  templateUrl: './market-list.html',
  styleUrls: ['./market-list.css']
})
export class MarketList implements OnInit {
  productos = signal<Product[]>([]);
  searchQuery: string = '';

  isSuccessModalOpen = signal<boolean>(false); 
  exitoConfig = signal<any>(null);

  private marketService = inject(ServMarketJson);
  private router = inject(Router);

  ngOnInit(): void {
    this.cargarProductosDeLaComunidad();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.cargarProductosDeLaComunidad();
    });
  }
  cargarProductosDeLaComunidad(): void {
    forkJoin({
      comunidad: this.marketService.getProducts(),
      mios: this.marketService.getMisProductos()
    }).subscribe(({ comunidad, mios }) => {
      this.productos.set([...comunidad, ...mios]);
    });
  }

  redireccionarAlCrud(): void {
    this.router.navigate(['/comunity/market-crud']);
  }

  contactarVecino(producto: Product): void {
    const mensajeWhatsApp = `¡Hola! Estoy interesado en tu producto "${producto.name}" que publicaste en el Mercado Comunitario de Palmas Reales. ¿Sigue disponible?`;

    const config = {
      titulo: 'Contactar al Vecino',
      subtitulo: `¿Deseas iniciar una conversación por WhatsApp con el propietario de este artículo?`,
      nombreItem: 'Market',
      
      reporte: {
        titulo: `${producto.name} — Prop: ${producto.owner || 'Vecino'}`, 
        fecha: new Date().toLocaleDateString(),                         
        estado: producto.condition || 'Disponible'                      
      },
      
      footerText: 'Al confirmar, serás redirigido a WhatsApp Web o la App.',
      iconFooter: '💬',
      confirmText: 'Abrir WhatsApp',
      showCancel: true,
      btnClass: 'btn-secondary-custom',
      cancelText: 'Volver',
      mensajeOriginal: mensajeWhatsApp 
    };

    this.exitoConfig.set(config);
    this.isSuccessModalOpen.set(true);
  }

  confirmarAccionDialog(): void {
    const configActual = this.exitoConfig();
    const message = configActual?.mensajeOriginal || '¡Hola! Estoy interesado en tu producto del Mercado Comunitario.';
    window.open(
      `https://wa.me/593999999999?text=${encodeURIComponent(message)}`,
      '_blank'
    );
    this.cerrarModalExito();
  }

  cerrarModalExito(): void {
    this.isSuccessModalOpen.set(false);
  }
}