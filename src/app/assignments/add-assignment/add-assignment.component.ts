import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Assignment } from '../assignment.model';
import { Matiere } from 'src/app/matiere/matiere.model';
import { MatiereService } from 'src/app/shared/matiere.service';
import { Response } from 'express';
import { AuthService } from 'src/app/shared/auth.service';
import { mixinColor } from '@angular/material/core/common-behaviors/color';

@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css'],
})
export class AddAssignmentComponent implements OnInit {
  // Champ de formulaire
  nomAssignment!: string;
  dateDeRendu!: Date;
  listeMatiere:Matiere[]= [];
  matiere!:string;
  professeur!:string;
  remarque!:string;
  auteur!:string;
  indice!:number;
  imageprof!:string;
  image!:string;
  constructor(private assignmentsService:AssignmentsService, private router:Router,
  private matiereService:MatiereService,
  private authService:AuthService
) {}

  ngOnInit(): void {
    this.matiereService.getMatieres()
      .subscribe(reponse => {
        console.log("données arrivées");
        this.listeMatiere = reponse.docs;
      });
      this.auteur=this.authService.nomEtudiant();
  }

  onSubmit() {
    if(this.authService.loggedIn.value){
      if((!this.nomAssignment) || (!this.dateDeRendu)) return;
      console.log(
        'nom = ' + this.nomAssignment + ' date de rendu = ' + this.dateDeRendu
      );

      let newAssignment = new Assignment();
      newAssignment.id = Math.round(Math.random()*10000000);
      newAssignment.nom = this.nomAssignment;
      newAssignment.dateDeRendu = this.dateDeRendu;
      newAssignment.rendu = false;
      newAssignment.matiere=this.matiere;
      newAssignment.professeur=this.professeur;
      newAssignment.remarque=this.remarque;
      newAssignment.auteur=this.auteur;
      newAssignment.imageprof=this.imageprof;
      newAssignment.image=this.image;

      this.assignmentsService.addAssignment(newAssignment)
      .subscribe(reponse => {
        console.log(reponse.message);

        // il va falloir naviguer (demander au router) d'afficher à nouveau la liste
        // en gros, demander de naviguer vers /home
        this.router.navigate(["/assignment/"+newAssignment.id]);
      })
      
    }
    else{
      alert("Veiller vous connecter");
      this.router.navigate(["/login/"]);
    }
  }

  choirirMatiere(professeur:any){
    console.log(this.indice);
    this.matiere=this.listeMatiere[this.indice].matiere;
    this.professeur=this.listeMatiere[this.indice].professeur;
    this.imageprof=this.listeMatiere[this.indice].imageprof;
    this.image=this.listeMatiere[this.indice].photo;
  }
}
