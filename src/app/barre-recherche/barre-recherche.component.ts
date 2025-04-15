import { Component, EventEmitter, Output } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-barre-recherche',
  imports: [FormsModule, CommonModule],
  templateUrl: './barre-recherche.component.html',
  styleUrls: ['./barre-recherche.component.css']
})
export class BarreRechercheComponent {
  searchQuery: string = '';  // Texte de recherche
  selectedCategories: string[] = [];  // Catégories sélectionnées
  categories = ['Domotique', 'Securité', 'Lumière', 'Energie', 'Confort'];  // Liste des catégories disponibles

  filtersVisible: boolean = false;  // Contrôle la visibilité des filtres
  objets: any[] = [];  // Liste des objets récupérés de Firebase

  @Output() searchEvent = new EventEmitter<{ searchQuery: string, selectedCategories: string[] }>();

  constructor(private firebaseService: FirebaseService) {}

  // Méthode pour gérer les changements de sélection des catégories (filtrage en temps réel)
  onCategoryChange(event: any): void {
    const category = event.target.value;

    if (event.target.checked) {
      this.selectedCategories.push(category);
    } else {
      const index = this.selectedCategories.indexOf(category);
      if (index > -1) {
        this.selectedCategories.splice(index, 1);
      }
    }
    this.search();  // Lance une nouvelle recherche avec les nouveaux filtres
  }

  // Méthode pour émettre l'événement de recherche uniquement au clic du bouton
  onSearchButtonClick(): void {
    this.search();  // Lance une recherche lorsque l'utilisateur clique sur "Rechercher"
  }

  // Méthode pour effectuer la recherche avec les critères
  search(): void {
    const prefix = this.searchQuery.trim(); // Supprimer les espaces inutiles
    if (!prefix && this.selectedCategories.length === 0) {
      this.objets = []; // Si aucun critère n'est défini, réinitialiser les résultats
      return;
    }

    this.firebaseService.getObjetsByNomPrefix(prefix).then((data) => {
      console.log('Objets trouvés :', data); // Affiche les résultats dans la console

      // Filtrer les objets par catégorie
      this.objets = data.filter((objet: any) => {
        const matchesCategory =
          this.selectedCategories.length === 0 || // Si aucune catégorie n'est sélectionnée, tout est accepté
          this.selectedCategories.includes(objet.Categorie);

        return matchesCategory;
      });
    }).catch((error) => {
      console.error('Erreur lors de la recherche :', error);
      this.objets = [];
    });
  }

  // Méthode privée pour émettre l'événement de recherche
  private emitSearchEvent(): void {
    this.searchEvent.emit({
      searchQuery: this.searchQuery,
      selectedCategories: this.selectedCategories
    });
  }

  // Méthode pour basculer l'affichage des filtres
  toggleFilters(): void {
    this.filtersVisible = !this.filtersVisible;
  }
}
