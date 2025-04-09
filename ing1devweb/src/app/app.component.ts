import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router'; // Importer RouterModule
import { FormsModule } from '@angular/forms';  // Ajouter cet import

@Component({
  selector: 'app-root',
  standalone: true,  // Ceci permet à ce composant d'être autonome
  imports: [RouterOutlet, RouterModule, FormsModule], // Déclarer les modules nécessaires
  templateUrl: './app.component.html',
  styleUrls: ['../assets/styles.css'] // Corriger le nom du fichier (styleUrls)
})
export class AppComponent {
  // Ton code pour AppComponent
}
