import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainBannerComponent } from "../main-banner/main-banner.component"; // Importer RouterModule

@Component({
  selector: 'app-connexion',
  imports: [RouterModule, MainBannerComponent],
  templateUrl: './connexion.component.html',
  styleUrl: '../../assets/styles.css'
})
export class ConnexionComponent {

}
