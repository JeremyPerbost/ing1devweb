import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router'; // Importer RouterModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports:[RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: '../assets/styles.css'
})
export class AppComponent {

}
