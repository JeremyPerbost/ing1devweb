import { Routes } from '@angular/router';
import { InformationComponent } from './information/information.component';
import { AppComponent } from '../app/app.component';
import {PageInconnueComponent} from './page-inconnue/page-inconnue.component';
import {HomeComponent} from './home/home.component';
import {InscriptionComponent} from './inscription/inscription.component'
import {ConnexionComponent} from './connexion/connexion.component'
import {ConfirmConnexionComponent} from './confirm-connexion/confirm-connexion.component'
import {IncorrectConnexionComponent} from './incorrect-connexion/incorrect-connexion.component'
import { MonProfilComponent } from "./mon-profil/mon-profil.component";
import { AttenteConfirmationAdminComponent } from './attente-confirmation-admin/attente-confirmation-admin.component';
import { AttenteConfirmationMailComponent } from './attente-confirmation-mail/attente-confirmation-mail.component';
import { ConfirmMailComponent } from './confirm-mail/confirm-mail.component';
import { PageObjetComponent } from './page-objet/page-objet.component';
export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },  // Redirection vers '/home'
    { path: 'home', component: HomeComponent },  // Assure-toi que HomeComponent existe
    { path: 'information', component: InformationComponent},  // Route vers InformationComponent
    { path: 'inscription', component: InscriptionComponent},  // Route vers InformationComponent
    { path: 'connexion', component: ConnexionComponent},  // Route vers InformationComponent
    { path: 'confirm-connexion', component: ConfirmConnexionComponent},
    { path: 'incorrect-connexion', component: IncorrectConnexionComponent},
    { path: 'profil', component: MonProfilComponent},
    { path: 'attente-confirmation-admin', component: AttenteConfirmationAdminComponent},
    { path: 'attente-confirmation-mail', component: AttenteConfirmationMailComponent},
    { path: 'increment-level', component: ConfirmMailComponent},
    { path : 'page-objet', component : PageObjetComponent} ,
    { path: '**', component: PageInconnueComponent},
];
