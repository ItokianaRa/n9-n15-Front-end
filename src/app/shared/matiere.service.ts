import { Injectable } from '@angular/core';
import { Matiere } from '../matiere/matiere.model';
import { HttpClient } from '@angular/common/http';
import { catchError, filter, forkJoin, map, Observable, of, pairwise, tap,throwError  } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MatiereService {
  matieres:Matiere[]=[];
  url="http://localhost:8010/api/matieres/";
  constructor(private http:HttpClient) { }

  public getMatieres() :Observable<any> {
    return this.http.get<Matiere[]>(this.url);
  }


}
