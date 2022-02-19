import { Component, OnInit } from '@angular/core';
import {LoginPageService} from "./service/login-page.service";
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validator, Validators} from "@angular/forms";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  username: string = '';
  password: string = '';

  constructor(private loginService: LoginPageService) { }

  ngOnInit(): void {
  }

  login() {
    this.loginService.login(this.username, this.password).subscribe(data => {

    }, error => {
      // this.invalidLogin = true;
      this.username = error.message;
      console.log(this.username);
    });

  }
}
