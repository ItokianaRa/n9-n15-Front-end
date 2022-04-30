import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AfterViewInit, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import { filter, map, pairwise, tap, throttleTime,BehaviorSubject } from 'rxjs';
import { AssignmentsService } from '../shared/assignments.service';
import { Assignment } from './assignment.model';
import { AuthService } from './../shared/auth.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import * as _ from "lodash";
import { NotationComponent } from 'src/app/notation/notation.component';
import { MatDialog } from "@angular/material/dialog";


@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css'],
})
export class AssignmentsComponent implements OnInit, AfterViewInit {
  assignments:Assignment[] = [];
  displayedColumns: string[] = ['id', 'nom', 'dateDeRendu', 'rendu'];
  devoirs= new BehaviorSubject<any>(null);
  rendus : string[] = [];
  nonrendus : string[] = [];

  // pagination
  rendu :boolean = false;
  page=1;
  limit=10;
  totalPages=0;
  pagingCounter=0;
  hasPrevPage=false;
  hasNextPage=true;
  prevPage= 1;
  nextPage= 2;

  constructor(private assignmentsService:AssignmentsService, private ngZone: NgZone, public authService: AuthService,public dialog: MatDialog) {}

  @ViewChild('scroller') scroller!: CdkVirtualScrollViewport;

  ngAfterViewInit():void{
    this.scroller.elementScrolled().pipe(
      tap(event => {
        //console.log(event);
      }),
      map(event => {
        return this.scroller.measureScrollOffset('bottom');
      }),
      tap(val => {
        //console.log("distance par rapport à la fin = " + val)
      }),
      pairwise(),
      tap(val => {
        /*
        if(val[0] < val[1]) console.log("on monte")
        else console.log("on descend")
        */
      }),
      filter(([y1, y2]) => (y2 < y1 && y2 < 140)),
      tap(val => {
        //console.log(val)
      }),
      throttleTime(200),
      tap(val => {
        //console.log(val);
      })
    ).subscribe(() => {
      // ici traitement final
      console.log("On va chercher de nouveaux assignments !")

      // on le fait en tache de fond...
      this.ngZone.run(() => {
        this.page = this.nextPage;
        this.getAssignmentsScrollInfini();
      })
    })
  }

  // appelé après le constructeur et AVANT l'affichage du composant
  ngOnInit(): void {
    console.log("Dans ngOnInit, appelé avant l'affichage");
    this.getAssignments();
    console.log("session = " + this.authService.loggedIn);
  }


  getAssignmentsNonRendu() {
  this.rendu=false;
  this.getAssignments();

    console.log("Après l'appel au service");
}


getAssignmentsRendu() {
  this.rendu=true;
  this.getAssignments();
  console.log("Après l'appel au service");
}


  getAssignments() {
      // demander les données au service de gestion des assignments...
      this.assignmentsService.getAssignments(this.page, this.limit,this.rendu)
      .subscribe(reponse => {
        
        this.assignments = reponse.docs;
        this.page = reponse.page;
        this.limit=reponse.limit;
        this.totalPages=reponse.totalPages;
        this.pagingCounter=reponse.pagingCounter;
        this.hasPrevPage=reponse.hasPrevPage;
        this.hasNextPage=reponse.hasNextPage;
        this.prevPage= reponse.prevPage;
        this.nextPage= reponse.nextPage;
        var temp = groupBy(this.assignments,'id');
        this.devoirs.next([]);
        this.devoirs.next(temp);
        if(this.rendu){
          this.nonrendus = [];
          this.rendus = this.assignments.map(
            (assignment)=>String(assignment.id)
          );
        }
        else{
          this.rendus = [];
          this.nonrendus = this.assignments.map(
            (assignment)=>String(assignment.id)
          );
        }
      });

      console.log("Après l'appel au service");
  }

  getAssignmentsScrollInfini() {
    // demander les données au service de gestion des assignments...
    this.assignmentsService.getAssignments(this.page, this.limit,this.rendu)
    .subscribe(reponse => {
      console.log("données arrivées"); 
      //this.assignments = reponse.docs;
      // au lieu de remplacer les assignments chargés par les nouveaux, on les ajoute
      this.assignments = this.assignments.concat(reponse.docs);

      this.page = reponse.page;
      this.limit=reponse.limit;
      this.totalPages=reponse.totalPages;
      this.pagingCounter=reponse.pagingCounter;
      this.hasPrevPage=reponse.hasPrevPage;
      this.hasNextPage=reponse.hasNextPage;
      this.prevPage= reponse.prevPage;
      this.nextPage= reponse.nextPage;
    });

    console.log("Après l'appel au service");
}

  pagePrecedente() {
    this.page--;
    this.getAssignments();
  }

  pageSuivante() {
    this.page++;
    this.getAssignments();
  }

  premierePage() {
    this.page = 1;
    this.getAssignments();
  }

  dernierePage() {
    this.page = this.totalPages;
    this.getAssignments();
  }

  logOut(){
    this.authService.logOut();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      console.log(event.container.data);
      const dialogRef = this.dialog.open(NotationComponent, {
        width: '250px',
        data: {id: event.container.data[0]}
      });
      
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          //ws
         
        }
        else{
          transferArrayItem(
            event.container.data,
            event.previousContainer.data,
            event.currentIndex,
            event.previousIndex,
          );
        }
      });
      
    }
  }
  noReturnPredicate() {
    return false;
  }
}
export const groupBy = (list: any, key: string) => {

  return _.mapValues(
      _.groupBy(list, key),
      (result: any) => result.map((car: any) => _.omit(car, key))
  );

};