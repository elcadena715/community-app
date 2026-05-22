import { Component, ElementRef, inject, OnInit, signal, ViewChild, AfterViewInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../models/product';
import { ServMarketJson } from '../../../services/market/serv-market-json';
import { TableReporteCrud } from '../../shared/table-crud/table-crud';
import { AppDialogComponent } from '../../shared/app-dialog/app-dialog';

declare const bootstrap: any;

@Component({
  selector: 'app-market-crud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TableReporteCrud, AppDialogComponent],
  templateUrl: './market-crud.html',
  styleUrls: ['../market-list/market-list.css']
})
export class MarketCrud implements OnInit, AfterViewInit {
  todosLosProductos = signal<Product[]>([]);
  formProducto!: FormGroup;
  editingId: number | null = null;

  estados = ['Disponible', 'Separado', 'Agotado'];
  condiciones = ['Nuevo', 'Buen estado', 'Usado'];

  listaEmojis = [
    { icono: '📦', etiqueta: 'Paquete / General' },
    { icono: '🍰', etiqueta: 'Postres / Dulces' },
    { icono: '🍔', etiqueta: 'Comida Rápida' },
    { icono: '🥤', etiqueta: 'Bebidas' },
    { icono: '👕', etiqueta: 'Ropa / Moda' },
    { icono: '👟', etiqueta: 'Calzado' },
    { icono: '💻', etiqueta: 'Tecnología' },
    { icono: '📱', etiqueta: 'Celulares' },
    { icono: '🚲', etiqueta: 'Deportes' },
    { icono: '📚', etiqueta: 'Libros / Estudios' },
    { icono: '🏠', etiqueta: 'Hogar / Decoración' },
    { icono: '🛠️', etiqueta: 'Herramientas' }
  ];

  isModalOpen = signal<boolean>(false);
  isSuccessModalOpen = signal<boolean>(false);
  isDialogPropsOpen = signal<boolean>(false);
  dialogConfig = signal<any>(null);
  exitoConfig = signal<any>(null);
  productoAEliminar: Product | null = null;

  @ViewChild('modalElement') modalElement!: ElementRef;
  modalInstance: any;

  private fb = inject(FormBuilder);
  private marketService = inject(ServMarketJson);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  
  misProductos = computed(() => {
    return this.todosLosProductos().filter(p => p.owner === 'Abel Mora');
  });

  ngOnInit(): void {
    this.cargarProductos();
    this.initForm();
    const configGuardada = localStorage.getItem('ultimoExitoConfigMarket');
    if (configGuardada) {
      this.exitoConfig.set(JSON.parse(configGuardada));
      this.isSuccessModalOpen.set(true);
    }
  }

  ngAfterViewInit(): void {
    if (this.modalElement && this.modalElement.nativeElement) {
      this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement);
    } else {
      const el = document.getElementById('modalProducto');
      if (el) {
        this.modalInstance = new bootstrap.Modal(el);
      }
    }
  }

  initForm(): void {
    this.formProducto = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      emoji: ['', Validators.required],
      status: ['', Validators.required],
      condition: ['', Validators.required], 
      owner: ['Abel Mora'] 
    });
  }

  cargarProductos(): void {
    this.marketService.getMisProductos().subscribe((data: Product[]) => {
      this.todosLosProductos.set(data);
    });
  }

  openNew(): void {
    localStorage.clear();
    this.editingId = null;
    this.formProducto.reset({ 
      status: '', 
      condition: '', 
      emoji: '', 
      price: 0, 
      owner: 'Abel Mora' 
    });
    this.isModalOpen.set(true);
  }

  openEdit(producto: Product): void {
    localStorage.clear();
    this.editingId = producto.id!;
    this.formProducto.patchValue(producto);
    this.isModalOpen.set(true);
  }

  cerrarModal(): void {
    this.isModalOpen.set(false);
    this.router.navigate([], { relativeTo: this.route, queryParams: {} });
  }

  volverAVitrina(): void {
    this.router.navigate(['/comunity/market']);
  }

  save(): void {
    if (this.formProducto.invalid) {
      this.formProducto.markAllAsTouched();
      return;
    }

    const data: Product = this.formProducto.value;

    if (this.editingId) {
      this.marketService.updateProductoPropio({ ...data, id: this.editingId }).subscribe(() => {
        this.cargarProductos();
        this.cerrarModal();
        this.mostrarFeedback('¡Cambios Guardados!', 'El producto ha sido modificado exitosamente.', data, 'SUCCESS');
      });
    } else {
      this.marketService.addProductoPropio(data).subscribe(() => {
        this.cargarProductos(); 
        this.cerrarModal();
        this.mostrarFeedback('¡Producto Publicado!', 'Tu artículo ya se encuentra disponible en la vitrina comunitaria.', data, 'SUCCESS');
      });
    }
  }

  deleteProductConfirm(producto: Product) {
    this.productoAEliminar = producto;
    this.mostrarFeedback(
      '¿Estás seguro?', 
      `¿Deseas eliminar permanentemente el artículo "${producto.name}"?`, 
      producto, 
      'CONFIRM'
    );
  }

  manejarConfirmacionDialog(): void {
    const config = this.exitoConfig();
    if (config?.tipoAccion === 'CONFIRM') {
      this.confirmarAccionDialog();
    } else {
      this.cerrarModalExito();
    }
  }

  cerrarModalExito() {
    this.isSuccessModalOpen.set(false);
    localStorage.removeItem('mostrarExitoMarket');
    localStorage.removeItem('ultimoReporteMarket');
    localStorage.removeItem('ultimoExitoConfigMarket');
    this.productoAEliminar = null;
  }

  confirmarAccionDialog(): void {
    if (this.productoAEliminar && this.productoAEliminar.id) {
      this.marketService.deleteProduct(this.productoAEliminar.id).subscribe(() => {
        this.todosLosProductos.update(list => list.filter(p => p.id !== this.productoAEliminar?.id));
        this.cerrarModalExito();
      });
    } else {
      this.cerrarModalExito();
    }
  }

  private mostrarFeedback(tituloParam: string, subtituloParam: string, prodParam: any, type: 'SUCCESS' | 'CONFIRM') {
    this.cerrarModal();
    const isConfirm = type === 'CONFIRM';

    const config = {
      titulo: tituloParam,            
      subtitulo: subtituloParam,      
      nombreItem: 'Producto',
      reporte: { id: prodParam.id || this.editingId || 'Nuevo', titulo: prodParam.name, fecha: new Date().toISOString().split('T')[0], estado: prodParam.status },          
      footerText: isConfirm ? 'Esta acción no se puede deshacer' : 'Gracias por colaborar en la comunidad.',
      iconFooter: isConfirm ? '⚠️' : '🤝',
      confirmText: isConfirm ? 'Sí, Eliminar' : 'Entendido',
      showCancel: isConfirm, 
      btnClass: isConfirm ? 'btn-danger' : 'btn-secondary-custom',
      cancelText: 'Volver',
      tipoAccion: type,
    };
    if (!isConfirm) {
      localStorage.setItem('ultimoExitoConfigMarket', JSON.stringify(config));
    }
    
    this.exitoConfig.set(config);
    this.isSuccessModalOpen.set(true);
  }
}