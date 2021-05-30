import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { map } from 'rxjs/operators';
import { mimeType } from './mime-type.validator';

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
    postForm: FormGroup;
    imagePreview = "";
    //@Output() postCreated = new EventEmitter<Post>();
    private mode = 'create';
    private postId: string;


    constructor(public postsService: PostService, public route: ActivatedRoute) { }

    ngOnInit() {
        this.postForm = new FormGroup({
            'title': new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
            'content': new FormControl(null, { validators: [Validators.required, Validators.minLength(5)] }),
            'image': new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] })
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
                            const post: Post = { id: serverPost._id, title: serverPost.title, content: serverPost.content, imagePath: serverPost.imagePath };
                            return post;
                        }))
                    .subscribe(post => {
                        this.isLoading = false;
                        this.post = post;
                        this.postForm.setValue({
                            'title': this.post.title,
                            'content': this.post.content,
                            'image': this.post.imagePath
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
        if (this.postForm.invalid) {
            return;
        }
        console.log('mode === create');
        if (this.mode === 'create') {
            // const postCreate: Post = {
            //     id: null,
            //     title: this.postForm.value.title,
            //     content: this.postForm.value.content
            // };
            this.postsService.addPost(this.postForm.value.title, this.postForm.value.content, this.postForm.value.image);
            // this.postsService.addPost({
            //     id: null,
            //     title: form.value.title,
            //     content: form.value.content
            // });
        } else if (this.mode === 'edit') {
            // const postUpdate: Post = {
            //     id: this.postId,
            //     title: this.postForm.value.title,
            //     content: this.postForm.value.content,
            //     imagePath: null
            // };
            this.postsService.updatePost(this.postId,
                this.postForm.value.title,
                this.postForm.value.content,
                this.postForm.value.image);
        }
        this.postForm.reset();

    }

    onImagePicked(event: Event) {
        const file = (event.target as HTMLInputElement).files[0];
        // OR alternative syntax
        //const file = (<HTMLInputElement>event.target).files[0];
        this.postForm.patchValue({ image: file });
        this.postForm.get('image').updateValueAndValidity();
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = <string>reader.result;

            // OR alternative syntax
            // this.imagePreview = reader.result as string;

            // ** Imp Note: JavaScript doesn't have a concept of type casting because variables have dynamic types. 
            // However, every variable in TypeScript has a type. 
            // Type castings allow you to convert a variable from one type to another. 
            // In TypeScript, you can use the as keyword or <> operator for type castings.
        };
        reader.readAsDataURL(file);
    }
}