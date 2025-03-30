import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router'; // Importer RouterModule
import { routes } from '../app.routes';
import { MainBannerComponent } from "../main-banner/main-banner.component";
import { PiedDePageComponent } from "../pied-de-page/pied-de-page.component";
import { BarreRechercheComponent } from "../barre-recherche/barre-recherche.component";


@Component({
  selector: 'app-information',
  imports: [RouterModule, MainBannerComponent, PiedDePageComponent,BarreRechercheComponent],
  templateUrl: './information.component.html',
  styleUrl: '../../assets/styles.css'
})
export class InformationComponent {

}
