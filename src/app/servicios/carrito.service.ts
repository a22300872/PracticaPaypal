import { Injectable, signal } from '@angular/core';
import { Product, CartItem } from '../modelos/product.model';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  // Lista reactiva del carrito
  private productosSignal = signal<CartItem[]>([]);

  // Exponer como readonly
  productos = this.productosSignal.asReadonly();

  agregar(producto: Product) {
    this.productosSignal.update(lista => {
      const existente = lista.find(p => p.id === producto.id);
      if (existente) {
        // Si existe, incrementar cantidad
        return lista.map(p => 
          p.id === producto.id 
            ? { ...p, quantity: p.quantity + 1 } 
            : p
        );
      } else {
        // Si no existe, agregar nuevo
        return [...lista, { ...producto, quantity: 1 } as CartItem];
      }
    });
  }

  aumentarCantidad(id: number) {
    this.productosSignal.update(lista =>
      lista.map(p => 
        p.id === id 
          ? { ...p, quantity: p.quantity + 1 } 
          : p
      )
    );
  }

  disminuirCantidad(id: number) {
    this.productosSignal.update(lista => {
      const producto = lista.find(p => p.id === id);
      if (producto && producto.quantity > 1) {
        return lista.map(p => 
          p.id === id 
            ? { ...p, quantity: p.quantity - 1 } 
            : p
        );
      } else {
        // Si quantity es 1, remover el producto
        return lista.filter(p => p.id !== id);
      }
    });
  }

  quitar(id: number) {
    this.productosSignal.update(lista => lista.filter(p => p.id !== id));
  }

  vaciar() {
    this.productosSignal.set([]);
  }

  total(): number {
    return this.productosSignal().reduce((acc, p) => acc + (p.price * p.quantity), 0);
  }

  cantidadTotal(): number {
    return this.productosSignal().reduce((acc, p) => acc + p.quantity, 0);
  }

  exportarXML() {
    const productos = this.productosSignal();

    // Estructura XML manual
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<recibo>\n`;

    for (const p of productos) {
      xml += `  <producto>\n`;
      xml += `    <id>${p.id}</id>\n`;
      xml += `    <nombre>${this.escapeXml(p.name)}</nombre>\n`;
      xml += `    <precio>${p.price}</precio>\n`;
      xml += `    <cantidad>${p.quantity}</cantidad>\n`;
      xml += `    <subtotal>${p.price * p.quantity}</subtotal>\n`;
      if (p.description) {
        xml += `    <descripcion>${this.escapeXml(p.description)}</descripcion>\n`;
      }
      xml += `  </producto>\n`;
    }

    xml += `  <total>${this.total()}</total>\n`;
    xml += `</recibo>`;

    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'recibo.xml';
    a.click();

    URL.revokeObjectURL(url);
  }

  private escapeXml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
