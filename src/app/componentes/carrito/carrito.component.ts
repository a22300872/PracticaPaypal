import { Component, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../servicios/carrito.service';
import { CartItem } from '../../modelos/product.model';
import { Signal } from '@angular/core';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
})
export class CarritoComponent {
  carrito: Signal<CartItem[]>;
  total = computed(() => this.carritoService.total());
  cantidadTotal = computed(() => this.carritoService.cantidadTotal());

  constructor(private carritoService: CarritoService) {
    this.carrito = this.carritoService.productos as Signal<CartItem[]>;
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
