import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  erreur: any;

  constructor(private router : Router,private formBuilder: FormBuilder, public authService: AuthService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.loginForm=this.formBuilder.group({
      login: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      mdp: new FormControl('', Validators.compose([
        Validators.minLength(8),
        Validators.required
      ]))
    });
  }

  validation_messages = {
    'login': [
      { type: 'required', message: 'Login obligatoire.' }
    ],
    'mdp': [
      { type: 'required', message: 'Mot de passe obligatoire.' }/*,
      { type: 'minlength', message: 'Le mot de passe doit au moins contenir 8 caracteres.' }*/
    ]
  };

  onSignIn(){
    const formValue=this.loginForm.value;
    this.authService.logIn(formValue['login'], formValue['mdp']);
  }

}
