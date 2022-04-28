import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn = false;

  logIn(login:string, password:string) {
    // normalement il faudrait envoyer une requête sur un web service, passer le login et le password
    // et recevoir un token d'authentification, etc. etc.

    // pour le moment, si on appelle cette méthode, on ne vérifie rien et on se loggue
    this.loggedIn = true;
  }

  logOut() {
    this.loggedIn = false;
  }

  isAdmin() {
    let isUserAdmin = new Promise((resolve, reject) => {
      resolve(this.loggedIn);
    });
    //return this.loggedIn;
    return isUserAdmin;
  }

  // isAdmin().then(admin => { if(admin) { console.log("L'utilisateur est administrateur"); }})

  constructor() { }
}
