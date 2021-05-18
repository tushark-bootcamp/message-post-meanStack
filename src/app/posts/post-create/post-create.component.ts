import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

    enteredTitle = '';
    enteredContent = '';
    post: Post;
    //@Output() postCreated = new EventEmitter<Post>();
    private mode = 'create';
    private postId: string;


    constructor(public postsService: PostService, public route: ActivatedRoute) { }

    ngOnInit() {
        // **Imp note: For all builtin observables, we never need to unsubscribe in ngOnDestroy() {}
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('postId')) {
                this.mode = 'edit';
                this.postId = paramMap.get('postId');
                this.postsService.getPost(this.postId)
                    .pipe(
                        map((serverPost) => {
                            const post: Post = { id: serverPost._id, title: serverPost.title, content: serverPost.content };
                            return post;
                        }))
                    .subscribe(post => this.post = post);
            } else {
                this.mode = 'create';
                this.postId = null;
                this.post = null;
            }
        });
    }

    onSavePost(form: NgForm) {
        if (form.invalid) {
            return;
        }
        if (this.mode === 'create') {
            const postCreate: Post = {
                id: null,
                title: form.value.title,
                content: form.value.content
            };
            this.postsService.addPost(postCreate);
            form.resetForm();
            // this.postsService.addPost({
            //     id: null,
            //     title: form.value.title,
            //     content: form.value.content
            // });
        } else if (this.mode === 'edit') {
            const postUpdate: Post = {
                id: this.postId,
                title: form.value.title,
                content: form.value.content
            };
            this.postsService.updatePost(postUpdate);
        }
        
    }
}