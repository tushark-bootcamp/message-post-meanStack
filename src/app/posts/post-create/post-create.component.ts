import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
    isLoading = false;
    formPost: FormGroup;
    //@Output() postCreated = new EventEmitter<Post>();
    private mode = 'create';
    private postId: string;


    constructor(public postsService: PostService, public route: ActivatedRoute) { }

    ngOnInit() {
        this.formPost = new FormGroup({
            'title': new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
            'content': new FormControl(null, { validators: [Validators.required, Validators.minLength(5)] }),
        });
        // **Imp note: For all builtin observables, we never need to unsubscribe in ngOnDestroy() {}
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('postId')) {
                this.isLoading = true;
                this.mode = 'edit';
                this.postId = paramMap.get('postId');
                this.postsService.getPost(this.postId)
                    .pipe(
                        map((serverPost) => {
                            const post: Post = { id: serverPost._id, title: serverPost.title, content: serverPost.content };
                            return post;
                        }))
                    .subscribe(post => {
                        this.isLoading = false;
                        this.post = post;
                        this.formPost.setValue({
                            'title': this.post.title,
                            'content': this.post.content
                        });
                    });
            } else {
                this.mode = 'create';
                this.postId = null;
                this.post = null;
            }
        });
    }

    onSavePost() {
        if (this.formPost.invalid) {
            return;
        }
        if (this.mode === 'create') {
            const postCreate: Post = {
                id: null,
                title: this.formPost.value.title,
                content: this.formPost.value.content
            };
            this.postsService.addPost(postCreate);
            // this.postsService.addPost({
            //     id: null,
            //     title: form.value.title,
            //     content: form.value.content
            // });
        } else if (this.mode === 'edit') {
            const postUpdate: Post = {
                id: this.postId,
                title: this.formPost.value.title,
                content: this.formPost.value.content
            };
            this.postsService.updatePost(postUpdate);
        }
        this.formPost.reset();

    }
}