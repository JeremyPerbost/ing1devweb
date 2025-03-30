import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-barre-recherche',
  standalone: true,  
  templateUrl: './barre-recherche.component.html',
  styleUrls: ['./barre-recherche.component.css'],
  imports: [FormsModule] 
})
export class BarreRechercheComponent {
  searchQuery: string = '';
  filterCategory: string = '';

  constructor(private router: Router) {}

  rechercher() {
    this.router.navigate(['/resultats-recherche'], {
      queryParams: { query: this.searchQuery, category: this.filterCategory }
    });
  }
}
