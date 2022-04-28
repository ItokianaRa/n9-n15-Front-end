import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AssignmentsService } from './shared/assignments.service';
import { AuthService } from './shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  titre = 'Application de gestion des assignments...';

  constructor(
    private authService: AuthService,
    private router: Router,
    private assignmentsService: AssignmentsService
  ) {}

  onLoginLogout() {
    if (this.authService.loggedIn) {
      console.log('je me deloggue');
      this.authService.logOut();
      // et je navigue vers la page d'accueil
      this.router.navigate(['/home']);
    } else {
      console.log('je me loggue');
      this.authService.logIn('michel', 'monpassword');
    }
  }

  isLogged() {
    return this.authService.loggedIn;
  }

  genererDonneesDeTest() {
    //this.assignmentsService.peuplerBD();
    this.assignmentsService.peuplerBDAvecForkJoin().subscribe(() => {
      console.log(
        'TOUS LES AJOUTS ONT ETE FAITS, ON PEUT RE-AFFICHER LA LISTE'
      );
      // replaceUrl = true = force le refresh, même si
      // on est déjà sur la page d’accueil
      // Marche plus avec la dernière version d’angular
      this.router.navigate(['/home'], { replaceUrl: true });
    });
  }
}
