import { Routes } from '@angular/router';
import { InformationComponent } from './information/information.component';
import { AppComponent } from '../app/app.component';
import {PageInconnueComponent} from './page-inconnue/page-inconnue.component';
import {HomeComponent} from './home/home.component';
import {InscriptionComponent} from './inscription/inscription.component'
import {ConnexionComponent} from './connexion/connexion.component'
import {ConfirmConnexionComponent} from './confirm-connexion/confirm-connexion.component'
import {IncorrectConnexionComponent} from './incorrect-connexion/incorrect-connexion.component'
import {CreateHouseComponent} from './create-house/create-house.component'

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },  // Redirection vers '/home'
    { path: 'home', component: HomeComponent },  // Assure-toi que HomeComponent existe
    { path: 'information', component: InformationComponent},  // Route vers InformationComponent
    { path: 'inscription', component: InscriptionComponent},  // Route vers InformationComponent
    { path: 'connexion', component: ConnexionComponent},  // Route vers InformationComponent
    { path: 'confirm-connexion', component: ConfirmConnexionComponent},
    { path: 'incorrect-connexion', component: IncorrectConnexionComponent},
    { path: 'create-house', component: CreateHouseComponent},
    { path: '**', component: PageInconnueComponent},  // Route vers InformationComponent
];
