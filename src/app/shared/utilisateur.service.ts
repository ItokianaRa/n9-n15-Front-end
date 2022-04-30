import { Injectable } from '@angular/core';
import { Utilisateur } from 'src/app/utilisateur/utisateur.model';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  utilisateurs:Utilisateur[]=[];
  constructor() { }

  getUtilisateur(){
    this.utilisateurs.push(
      {
        "nom":"Michel",
        "prenom":"Buffa"
      }
    );
    this.utilisateurs.push(
      {
        "nom":"Richard",
        "prenom":"Grin"
      }
    );
    return this.utilisateurs;
  }
}
