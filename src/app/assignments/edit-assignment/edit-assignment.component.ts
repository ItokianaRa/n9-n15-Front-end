import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Assignment } from '../assignment.model';
import { MatiereService } from 'src/app/shared/matiere.service';
import { Matiere } from 'src/app/matiere/matiere.model';


@Component({
  selector: 'app-edit-assignment',
  templateUrl: './edit-assignment.component.html',
  styleUrls: ['./edit-assignment.component.css'],
})
export class EditAssignmentComponent implements OnInit {
  assignment!: Assignment | undefined;
  nomAssignment!: string;
  dateDeRendu!: Date;
  listeMatiere:Matiere[]= [];
  indice!:number;
  matiere!:string;
  professeur!:string;
  remarque!:string;
  auteur!:string;
  imageprof!:string;
  image!:string;


  constructor(
    private assignmentsService: AssignmentsService,
    private route: ActivatedRoute,
    private router: Router,
    private matiereService:MatiereService
  ) {}

  ngOnInit(): void {
    // ici un exemple de récupération des query params et du fragment
    let queryParams = this.route.snapshot.queryParams;
    console.log("Query params :")
    console.log(queryParams);
    console.log("Fragment :")
    console.log(this.route.snapshot.fragment);

    this.getAssignment();
    this.matiereService.getMatieres()
      .subscribe(reponse => {
        console.log("données arrivées");
        this.listeMatiere = reponse.docs;
        
      });
  }

  getAssignment() {
    // on récupère l'id dans le snapshot passé par le routeur
    // le "+" force l'id de type string en "number"
    const id = +this.route.snapshot.params['id'];

    this.assignmentsService.getAssignment(id).subscribe((assignment) => {
      if (!assignment) return;

      this.assignment = assignment;

      // Pour pré-remplir le formulaire
      this.nomAssignment = assignment.nom;
      this.dateDeRendu = assignment.dateDeRendu;
      this.auteur = assignment.auteur;
      this.remarque = assignment.remarque;
      this.imageprof = assignment.imageprof;
      this.professeur = assignment.professeur;
      this.matiere = assignment.matiere;
      var temp=0
      for(let matiereItem of this.listeMatiere ){
        if(matiereItem.matiere===assignment.matiere){
          this.indice=temp;
          break;
        }
        temp=temp+1;
      }
    });
  }

  onSaveAssignment() {
    if (!this.assignment) return;

    // on récupère les valeurs dans le formulaire
    this.assignment.nom = this.nomAssignment;
    this.assignment.dateDeRendu = this.dateDeRendu;
    this.assignment.matiere = this.matiere;
    this.assignment.remarque  = this.remarque;
    this.assignment.professeur = this.professeur;
    this.assignment.image = this.image;
    this.assignment.imageprof = this.imageprof;
    
    this.assignmentsService
      .updateAssignment(this.assignment)
      .subscribe((reponse) => {
        console.log(reponse.message);

        // navigation vers la home page
        this.router.navigate(['/home']);
      });
  }
  choirirMatiere(professeur:any){
    console.log(this.indice);
    this.matiere=this.listeMatiere[this.indice].matiere;
    this.professeur=this.listeMatiere[this.indice].professeur;
    this.imageprof=this.listeMatiere[this.indice].imageprof;
    this.image=this.listeMatiere[this.indice].photo;
  }
}
