import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainBannerComponent } from "../main-banner/main-banner.component";
import { PiedDePageComponent } from "../pied-de-page/pied-de-page.component";
import { AdminComponent } from "../admin/admin.component"; // Importer RouterModule
import { BarreRechercheComponent } from "../barre-recherche/barre-recherche.component";
@Component({
  selector: 'app-home',
  imports: [RouterModule, MainBannerComponent, PiedDePageComponent, AdminComponent,AdminComponent,BarreRechercheComponent],
  templateUrl: './home.component.html',
  styleUrl: '../../assets/styles.css'
})
export class HomeComponent {
}
