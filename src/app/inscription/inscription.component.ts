import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Importer RouterModule
import { FirebaseService } from '../firebase.service';
import { FormsModule } from '@angular/forms';
import { MainBannerComponent } from "../main-banner/main-banner.component";
import { PiedDePageComponent } from "../pied-de-page/pied-de-page.component";
import { ModifPhotoComponent } from "../modif-photo/modif-photo.component";
import { ConnexionComponent } from "../connexion/connexion.component";  // Ajouter cet import
@Component({
  selector: 'app-inscription',
  imports: [RouterModule, FormsModule, MainBannerComponent, PiedDePageComponent, ModifPhotoComponent, ConnexionComponent],
  templateUrl: './inscription.component.html',
  styleUrl: '../../assets/styles.css'
})
export class InscriptionComponent {
  user= {
    name: '',
    mail: '',
    password: '',
    photoURL: '',
    categorie: ''
  };
  constructor(private firebaseService: FirebaseService){}
  onSubmit(): void{
    this.firebaseService.addUser(this.user);
    this.user = { name: '', mail: '', password: '',photoURL: '', categorie: '' };
  }
}
