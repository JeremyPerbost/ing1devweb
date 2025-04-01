import { Component,OnInit } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { PiedDePageComponent } from '../pied-de-page/pied-de-page.component';
@Component({
  selector: 'app-page-objet',
  standalone: true,
  imports: [CommonModule, RouterModule, PiedDePageComponent],
  templateUrl: './page-objet.component.html',
  styleUrl: './page-objet.component.css'
})
export class PageObjetComponent implements OnInit {
  objets$: Observable<any[]> = new Observable(); // Initialisation avec une valeur par défaut

  constructor(private firestore: Firestore) { }

  ngOnInit(): void {
    const objetsCollection = collection(this.firestore, 'objet');
    this.objets$ = collectionData(objetsCollection) as Observable<any[]>;
  }
}