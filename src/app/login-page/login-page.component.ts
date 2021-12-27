import { Component, OnInit } from '@angular/core';
import {LoginPageService} from "./service/login-page.service";
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validator, Validators} from "@angular/forms";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  // invalidLogin: boolean = false;
  username: string = '';
  password: string = '';
  // submitted: boolean = false;
  // loginForm: FormGroup = new FormGroup({
  //   username: new FormControl(''),
  //   password: new FormControl('')
  // });
  constructor(private loginService: LoginPageService) { }

  ngOnInit(): void {
  }

  // get f(): { [key: string]: AbstractControl } {
  //   return this.loginForm.controls;
  // }
  login() {
    // this.submitted = true;
    // if (this.loginForm.invalid) {
    //   return;
    // }
    console.log("login user")
    this.loginService.login(this.username, this.password).subscribe(data => {

    }, error => {
      // this.invalidLogin = true;
      this.username = error.message;
      console.log(this.username);
    });

  }
}
