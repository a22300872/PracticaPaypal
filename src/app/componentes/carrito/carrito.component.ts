import { Component, computed, inject, effect } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CarritoService } from '../../servicios/carrito.service';
import { CartItem } from '../../modelos/product.model';
import { Signal } from '@angular/core';
import { PaypalService } from '../../servicios/paypal.service';
import { map } from 'rxjs/operators';

declare var paypal: any;

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
})
export class CarritoComponent {
  private router = inject(Router);
  private paypalService = inject(PaypalService);
  carrito: Signal<CartItem[]>;
  total = computed(() => this.carritoService.total());
  cantidadTotal = computed(() => this.carritoService.cantidadTotal());

  constructor(private carritoService: CarritoService) {
    this.carrito = this.carritoService.productos as Signal<CartItem[]>;

    effect(() => {
      this.carrito();
      setTimeout(() => this.renderPayPalButton(), 0);
    });
  }

  renderPayPalButton() {
    const container = document.getElementById('paypal-button-container');
    if (!container) return;

    const items = this.carrito();
    if (items.length === 0) {
      container.innerHTML = '';
      return;
    }

    if (!paypal) {
      console.error('PayPal SDK no cargado');
      return;
    }

    container.innerHTML = '';

    const itemsPayload = items.map(item => ({
      nombre: item.name,
      cantidad: item.quantity,
      precio: item.price
    }));
    const totalAmount = this.total();

    paypal.Buttons({
      style: {
        layout: 'horizontal',
        color:  'gold',
        shape:  'rect',
        label:  'paypal',
        height: 45
      },
      createOrder: () => {
        return this.paypalService.createOrder({ items: itemsPayload, total: totalAmount })
          .pipe(map((res: any) => res.id))
          .toPromise();
      },
      onApprove: (data: any) => {
        this.paypalService.captureOrder(data.orderID).subscribe({
          next: (response: any) => {
            // Descargar recibo XML
            if (response.xml) {
              const blob = new Blob([response.xml], { type: 'application/xml' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `recibo_${data.orderID}.xml`;
              a.click();
              window.URL.revokeObjectURL(url);
            }
            alert('¡Pago completado con éxito! Se ha descargado tu recibo.');
            this.carritoService.vaciar();
          },
          error: (err) => {
            console.error('Error capturando orden:', err);
            alert('Error al completar el pago');
          }
        });
      },
      onError: () => alert('Error al procesar el pago con PayPal'),
      onCancel: () => alert('Pago cancelado')
    }).render(container);
  }

  aumentarCantidad(id: number) {
    this.carritoService.aumentarCantidad(id);
  }

  disminuirCantidad(id: number) {
    this.carritoService.disminuirCantidad(id);
  }

  quitar(id: number) {
    this.carritoService.quitar(id);
  }

  vaciar() {
    this.carritoService.vaciar();
  }

  exportarXML() {
    this.carritoService.exportarXML();
  }
}
