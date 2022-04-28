import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  niveauDeLog = 0;

  constructor() { }

  log(nomAssignment:string, action:string) {
    if(this.niveauDeLog > 1)
      console.log(`loggin service: ${nomAssignment} ${action}`)
  }

  setNiveauTrace(val:number) {
    this.niveauDeLog = val;
  }
}
