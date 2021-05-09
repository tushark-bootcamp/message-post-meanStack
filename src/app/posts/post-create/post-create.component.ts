import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from '../post.model';
import { PostService } from '../post.service';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {

    enteredTitle = '';
    enteredContent = '';
    //@Output() postCreated = new EventEmitter<Post>();

    constructor(public postsService: PostService) { }

    onAddPost(form: NgForm) {
        if(form.invalid) {
            return;
        }
        const post: Post = {
            title: form.value.title, 
            content: form.value.content
        };
        this.postsService.addPost(post);
        //this.postCreated.emit(post);
        form.resetForm();
    }
}