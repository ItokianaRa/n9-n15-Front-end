import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Utilisateur } from '../login/utilisateur.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient,private router : Router) { }

  loggedIn = false;
  url = "http://localhost:8010/api/utilisateurs";

  logIn(login:string, password:string) {
    // normalement il faudrait envoyer une requête sur un web service, passer le login et le password
    // et recevoir un token d'authentification, etc. etc.
    let data={
      "login":login,
      "mdp":password
    };
    this.http.post<Utilisateur>(this.url,data).subscribe(data =>{
      if(data != null){
        localStorage.setItem('login',data.login);
        localStorage.setItem('status',data.status);
        console.log("utilisateur connecte");
        this.loggedIn = true;
      }
      else
      {
        this.loggedIn = false;
      }
    });

    // pour le moment, si on appelle cette méthode, on ne vérifie rien et on se loggue
  }

  logOut() {
    localStorage.clear();
    this.router.navigate(['login']);
    this.loggedIn = false;
  }

  isAdmin() {
    let status = localStorage.getItem('status');
    let adminS = "admin";
    let isAdmin = false;
    if(status.toUpperCase() === adminS){
      isAdmin = true;
    };
    let isUserAdmin = new Promise((resolve, reject) => {
      resolve(isAdmin);
    });
    //return this.loggedIn;
    return isUserAdmin;
  }

  // isAdmin().then(admin => { if(admin) { console.log("L'utilisateur est administrateur"); }})

}
