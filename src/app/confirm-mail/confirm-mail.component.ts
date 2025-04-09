import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Importer RouterModule
import { FirebaseService } from '../services/firebase.service';
import { FormsModule } from '@angular/forms';
import { PiedDePageComponent } from "../pied-de-page/pied-de-page.component";
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-confirm-mail',
  imports: [RouterModule, FormsModule],
  templateUrl: './confirm-mail.component.html',
  styleUrls: ['../../assets/styles.css', 'confirm-mail.component.css']
})
export class ConfirmMailComponent {
  private token: string | null = null;
  message='';
  constructor(private route: ActivatedRoute, private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];  // Récupérer le token dans l'URL
      if (this.token) {
        this.incrementLevel(this.token);  // Appeler la méthode pour incrémenter le niveau
      }
    });
  }

  /**
   * Augmenter le niveau de l'utilisateur en utilisant le token
   * @param token - Le token unique dans l'URL
   */
  async incrementLevel(token: string) {
    try {
      // Appel à Firebase pour vérifier le token et augmenter le niveau
      const success = await this.firebaseService.incrementLevelByToken(token);
      if (success) {
        this.message='Votre Mail est confirmé 😃';
      } else {
        this.message='Ce Mail a déja été confirmé';
      }
    } catch (error) {
      console.error('Erreur lors de l\'incrémentation du niveau:', error);
      this.message='ERREUR INATTENDUE';
    }
  }
}
