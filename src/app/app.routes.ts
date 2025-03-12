import { Routes } from '@angular/router';
import { InformationComponent } from './information/information.component';
import { AppComponent } from '../app/app.component';
import {PageInconnueComponent} from './page-inconnue/page-inconnue.component';
import {HomeComponent} from './home/home.component';
export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },  // Redirection vers '/home'
    { path: 'home', component: HomeComponent },  // Assure-toi que HomeComponent existe
    { path: 'information', component: InformationComponent},  // Route vers InformationComponent
    { path: '**', component: PageInconnueComponent},  // Route vers InformationComponent
];
