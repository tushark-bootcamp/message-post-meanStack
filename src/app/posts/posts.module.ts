import { NgModule } from '@angular/core';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

//** Errors with RouterLink were most deceptive. There were no traces of the errors. 
// The best way to resolve is restart the angular app (ng serve) and then restarting the browser.
@NgModule({
    declarations: [
        PostCreateComponent,
        PostListComponent
    ],
    imports: [
        CommonModule,
        AngularMaterialModule,
        ReactiveFormsModule,
        RouterModule
    ]
})

export class PostsModule { }