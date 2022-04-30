import { Injectable } from '@angular/core';
import { Matiere } from '../matiere/matiere.model';
import { HttpClient } from '@angular/common/http';
import { catchError, filter, forkJoin, map, Observable, of, pairwise, tap,throwError  } from 'rxjs';
import { Constante } from 'src/app/shared/constante';


@Injectable({
  providedIn: 'root'
})
export class MatiereService {
  matieres:Matiere[]=[];
  url=this.constante.lienApi+"/api/matieres/";
  constructor(private http:HttpClient,
  private constante:Constante) { }

  public getMatieres() :Observable<any> {
    return this.http.get<Matiere[]>(this.url);
  }


}
