import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, filter, forkJoin, map, Observable, of, pairwise, tap } from 'rxjs';
import { Assignment } from '../assignments/assignment.model';
import { LoggingService } from './logging.service';
import { bdInitialAssignments } from './data';
import { Constante } from 'src/app/shared/constante';

@Injectable({
  providedIn: 'root'
})

export class AssignmentsService {
  assignments:Assignment[] = [];

  constructor(private loggingService:LoggingService, private http:HttpClient
  , private constante:Constante) {
    this.loggingService.setNiveauTrace(2);
   
  }


  url = this.constante.lienApi+"/api/assignments";
  //url= "https://mbdsmadagascar2022api.herokuapp.com/api/assignments";

  getAssignments(page:number, limit:number,rendu:boolean):Observable<any> {
    // en réalité, bientôt au lieu de renvoyer un tableau codé en dur,
    // on va envoyer une requête à un Web Service sur le cloud, qui mettra un
    // certain temps à répondre. On va donc préparer le terrain en renvoyant
    // non pas directement les données, mais en renvoyant un objet "Observable"
    //return of(this.assignments);
    var params = "?page=" + page + "&limit=" + limit+"&rendu="+rendu;
    if(localStorage.getItem('nom')!=null && localStorage.getItem('prenom')!=null && localStorage.getItem('status')!=null){
      params += "&nom="+localStorage.getItem('nom')+"&prenom="+localStorage.getItem('prenom')+"&status="+localStorage.getItem('status');
      console.log("misyyyyy " + params);
    }
    return this.http.get<Assignment[]>(this.url + params);
  }

  getUtilisateurs():Observable<any> {
    let urluser = this.constante.lienApi+"/api/utilisateurs";
    // en réalité, bientôt au lieu de renvoyer un tableau codé en dur,
    // on va envoyer une requête à un Web Service sur le cloud, qui mettra un
    // certain temps à répondre. On va donc préparer le terrain en renvoyant
    // non pas directement les données, mais en renvoyant un objet "Observable"
    //return of(this.assignments);
    return this.http.get<Assignment[]>(urluser);
  }

  getAssignment(id:number):Observable<Assignment|undefined> {
    //let a = this.assignments.find(a => a.id === id);
    //return of(a);
    return this.http.get<Assignment>(`${this.url}/${id}`)
    .pipe(
      map(a => {
        a.nom = a.nom ;
        return a;
      }),
      tap(a => {
        console.log("Dans le tap, pour debug, assignment recu = " + a.nom)
      }),
      catchError(this.handleError<any>('### catchError: getAssignments by id avec id=' + id))
    );
  }

  private handleError<T>(operation: any, result?: T) {
    return (error: any): Observable<T> => {
      console.log(error); // pour afficher dans la console
      console.log(operation + ' a échoué ' + error.message);

      return of(result as T);
    }
  }

  addAssignment(assignment:Assignment):Observable<any> {
   // this.assignments.push(assignment);

    this.loggingService.log(assignment.nom, "ajouté");

    return this.http.post<Assignment>(this.url, assignment);

    //return of("Assignment ajouté");
  }

  updateAssignment(assignment:Assignment):Observable<any> {
    this.loggingService.log(assignment.nom, "modifié");

    return this.http.put<Assignment>(this.url, assignment);
  }

  updateNote(assignment:Assignment):Observable<any> {
    this.loggingService.log(assignment.nom, "modifié");
    var link = this.constante.lienApi+"/api/notes";
    return this.http.put<Assignment>(link, assignment);
  }

  deleteAssignment(assignment:Assignment):Observable<any> {
    //let pos = this.assignments.indexOf(assignment);
    //this.assignments.splice(pos, 1);

    this.loggingService.log(assignment.nom, "supprimé");

    //return of("Assignment supprimé");
    return this.http.delete(this.url + "/" + assignment._id);
  }

  peuplerBD() {
    bdInitialAssignments.forEach(a => {
      let newAssignment = new Assignment();
      newAssignment.nom = a.nom;
      newAssignment.dateDeRendu = new Date(a.dateDeRendu);
      newAssignment.rendu = a.rendu;
      newAssignment.id = a.id;

      this.addAssignment(newAssignment)
      .subscribe(reponse => {
        console.log(reponse.message);
      })
    })
  }

  peuplerBDAvecForkJoin(): Observable<any> {
    const appelsVersAddAssignment:any = [];

    bdInitialAssignments.forEach((a) => {
      const nouvelAssignment:any = new Assignment();

      nouvelAssignment.id = a.id;
      nouvelAssignment.nom = a.nom;
      nouvelAssignment.dateDeRendu = new Date(a.dateDeRendu);
      nouvelAssignment.rendu = a.rendu;

      appelsVersAddAssignment.push(this.addAssignment(nouvelAssignment));
    });
    return forkJoin(appelsVersAddAssignment); // renvoie un seul Observable pour dire que c'est fini
  }

}
