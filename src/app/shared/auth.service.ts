import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Utilisateur } from '../login/utilisateur.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  loggedIn = false;
  url = "http://localhost:8010/api/utilisateur";

  logIn(login:string, password:string) {
    // normalement il faudrait envoyer une requête sur un web service, passer le login et le password
    // et recevoir un token d'authentification, etc. etc.
    let data={
      "login":login,
      "mdp":password
    };
    this.http.post<Utilisateur>(this.url,data).subscribe(data =>{
      /*if(data['status']==='success'){
        localStorage.setItem('token',data['data']);
        console.log("utilisateur connecte");
        
      }
      else
      {
      
      }*/
      console.log("utilisateur " + data);
    });

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

}
