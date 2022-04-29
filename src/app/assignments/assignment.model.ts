export class Assignment {
  _id?:string;
  id!:number;
  nom!:string;
  dateDeRendu!:Date;
  rendu!:boolean;
  auteur?:string;
  matiere?:string;
  note?:number;
  remarque?:string;
  professeur?:string;
  image?:string;
  imageprof?:string;
}
