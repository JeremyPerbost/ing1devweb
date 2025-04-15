import { Component } from '@angular/core';
import { MainBannerComponent } from "../main-banner/main-banner.component";
import { PiedDePageComponent } from "../pied-de-page/pied-de-page.component";

@Component({
  selector: 'app-incorrect-connexion',
  imports: [MainBannerComponent, PiedDePageComponent],
  templateUrl: './incorrect-connexion.component.html',
  styleUrls: ['./incorrect-connexion.component.css', '../../assets/styles.css']
})
export class IncorrectConnexionComponent {

}
