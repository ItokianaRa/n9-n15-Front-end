import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Utilisateur } from '../login/utilisateur.model';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient,private router : Router) { }

  loggedIn = new BehaviorSubject<boolean>(false);
  url = "http://localhost:8010/api/utilisateurs";

  logIn(login:string, password:string) {
    // normalement il faudrait envoyer une requête sur un web service, passer le login et le password
    // et recevoir un token d'authentification, etc. etc.
    let dt={
      "login":login,
      "mdp":password
    };
    this.http.post(this.url,dt).subscribe((data:any) =>{
      if(data !== null){
        let fObj: Utilisateur = <Utilisateur>data;
        localStorage.setItem('login',fObj.login);
        localStorage.setItem('status',fObj.status);
        console.log("utilisateur connecte");
        this.loggedIn.next(true);
      }
      else
      {
        this.loggedIn.next(false);
      }
    });

    // pour le moment, si on appelle cette méthode, on ne vérifie rien et on se loggue
  }

  logOut() {
    localStorage.clear();
    this.router.navigate(['login']);
    this.loggedIn.next(false);
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
