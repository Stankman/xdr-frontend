import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { matchValidator } from './validators/confirm-password.validator';

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
      password: ['', [Validators.required, Validators.minLength(6), matchValidator('passwordConfirm', true)]],
      passwordConfirm: ['', [Validators.required, matchValidator('password')]],
      tos: [false, [Validators.required, Validators.requiredTrue]]
    });
  }

  public onSubmit() : void {
    if(this.formGroup.invalid) {
      if(this.form['email'].errors) {
        this.form['email'].markAsDirty();
      }

      if(this.form['password'].errors) {
        this.form['password'].markAsDirty();
      }

      if(this.form['passwordConfirm'].errors) {
        this.form['passwordConfirm'].markAsDirty();
      }

      if(this.form['tos'].errors) {
        this.form['tos'].markAsDirty();
      }

      console.log(this.formGroup);
    }
  }

  public get form() {
    return this.formGroup.controls;
  }

}
