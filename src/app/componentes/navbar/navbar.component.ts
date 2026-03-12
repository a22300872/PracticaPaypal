import { Component, computed, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../servicios/carrito.service';
import { ProductsService } from '../../servicios/products.service';
import { Product } from '../../modelos/product.model';
import { SearchService } from '../../servicios/search.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  searchTerm = signal('');
  products = signal<Product[]>([]);
  showResults = signal(false);

  cartCount = computed(() => this.carritoService.productos().length);

  constructor(
    private carritoService: CarritoService,
    private productsService: ProductsService,
    private searchService: SearchService
  ) {
    this.productsService.getAll().subscribe({
      next: (data) => this.products.set(data),
    });
  }

  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return [];
    return this.products()
      .filter((p) => p.name.toLowerCase().includes(term))
      .slice(0, 5);
  });

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.searchService.setSearchTerm(value);
  }

  onSearchFocus() {
    this.showResults.set(true);
  }

  onSearchBlur() {
    setTimeout(() => this.showResults.set(false), 200);
  }

  selectProduct(product: Product) {
    this.searchTerm.set(product.name);
    this.searchService.setSearchTerm(product.name);
    this.showResults.set(false);
  }
}