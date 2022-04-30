import { Component, OnInit,Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AssignmentsService } from '../shared/assignments.service';
import { Assignment } from '../assignments/assignment.model';

@Component({
  selector: 'app-notation',
  templateUrl: './notation.component.html',
  styleUrls: ['./notation.component.css']
})
export class NotationComponent implements OnInit {

  notationForm: FormGroup;

  constructor(private formBuilder: FormBuilder,@Inject(MAT_DIALOG_DATA) public data: any,private dialogRef: MatDialogRef<NotationComponent>, private assignmentsService:AssignmentsService) { console.log(data);}

  ngOnInit(): void {
    this.initForm();
  }

  onNotation(){
    this.notationForm.markAllAsTouched();
    if(this.notationForm.valid){
      const formData = this.notationForm.value;
      Object.assign(formData, {id: this.data.id});
      this.dialogRef.close(formData);
      console.log("id = " + this.data.id);
      var assignment:Assignment = new Assignment();
      assignment.id = this.data.id;
      assignment.note = formData['note'];
      assignment.rendu = true;
      this.assignmentsService.updateNote(assignment).subscribe();
    }
  }

  initForm(){
    this.notationForm=this.formBuilder.group({
      note: ['0',Validators.required]
    });
  }

}
