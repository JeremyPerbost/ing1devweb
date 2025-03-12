import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router'; // Importer RouterModule
import { routes } from '../app.routes';
@Component({
  selector: 'app-information',
  imports: [RouterModule],
  templateUrl: './information.component.html',
  styleUrl: '../../assets/styles.css'
})
export class InformationComponent {

}
