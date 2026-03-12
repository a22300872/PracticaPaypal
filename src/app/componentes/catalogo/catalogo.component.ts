import { Component, computed, signal } from '@angular/core';
import { Product } from '../../modelos/product.model';
import { ProductsService } from '../../servicios/products.service';
import { CarritoService } from '../../servicios/carrito.service';
import { SearchService } from '../../servicios/search.service';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css'],
})
export class CatalogoComponent {
  products = signal<Product[]>([]);
  inStockCount = computed(() => this.filteredProducts().filter(p => p.inStock).length);

  filteredProducts = computed(() => {
    const searchTerm = this.searchService.searchTerm().toLowerCase().trim();
    if (!searchTerm) return this.products();
    return this.products().filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm)
    );
  });

  constructor(
    private productsService: ProductsService,
    private carritoService: CarritoService,
    private searchService: SearchService
  ) {
    this.productsService.getAll().subscribe({
      next: (data) => this.products.set(data),
      error: (err) => console.error('Error cargando XML:', err),
    });
  }

  agregar(producto: Product) {
    this.carritoService.agregar(producto);
  }
}
