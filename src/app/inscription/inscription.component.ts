import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Importer RouterModule
import { FirebaseService } from '../firebase.service';
import { FormsModule } from '@angular/forms';
import { MainBannerComponent } from "../main-banner/main-banner.component";  // Ajouter cet import
@Component({
  selector: 'app-inscription',
  imports: [RouterModule, FormsModule, MainBannerComponent],
  templateUrl: './inscription.component.html',
  styleUrl: '../../assets/styles.css'
})
export class InscriptionComponent {
  user= {
    name: '',
    mail: '',
    password: '',
    categorie: ''
  };
  constructor(private firebaseService: FirebaseService){}
  onSubmit(): void{
    this.firebaseService.addUser(this.user);
    this.user = { name: '', mail: '', password: '', categorie: '' };
  }
}
