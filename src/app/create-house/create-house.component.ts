import { Component } from '@angular/core';
import { MainBannerComponent } from "../main-banner/main-banner.component";
import { PiedDePageComponent } from "../pied-de-page/pied-de-page.component";

@Component({
  selector: 'app-create-house',
  imports: [MainBannerComponent, PiedDePageComponent],
  templateUrl: './create-house.component.html',
  styleUrls: ['./create-house.component.css', '../../assets/styles.css']
})
export class CreateHouseComponent {

}
