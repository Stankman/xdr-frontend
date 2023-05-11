import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public formGroup : FormGroup;

  constructor(
    private readonly formBuilder : FormBuilder
  ) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required]],
      tos: [[false], [Validators.required]]
    });
  }

  public onSubmit() : void {
    console.log(this.form);
  }

  public get form() {
    return this.formGroup.controls;
  }

}
