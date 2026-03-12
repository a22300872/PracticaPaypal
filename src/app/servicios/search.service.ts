import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private searchTermSignal = signal('');
  
  searchTerm = this.searchTermSignal.asReadonly();

  setSearchTerm(term: string) {
    this.searchTermSignal.set(term);
  }

  clearSearch() {
    this.searchTermSignal.set('');
  }
}