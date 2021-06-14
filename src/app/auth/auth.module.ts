import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';

@NgModule({
    declarations: [
        LoginComponent,
        SignupComponent

    ],
    imports: [
        CommonModule,
        AngularMaterialModule,
        ReactiveFormsModule,
        FormsModule
    ]
})

export class AuthModule { }