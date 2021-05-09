import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

    //postsService: PostService;
    //@Input() posts: Post[] = [];
    posts: Post[] = [];
    private postSubs: Subscription;

    // constructor(postsService: PostService) {
    //     this.postsService = postsService;
    // }

    // This way of declaring postsService with a public key work is a short cut to the above method
    // of declaring constructor
    constructor(public postsService: PostService) { }

    ngOnInit() {
        this.posts = this.postsService.getPosts();
        this.postSubs = this.postsService.getPostUpdateListener().subscribe((posts: Post[]) => {
            this.posts = posts;
        });
    }

    ngOnDestroy() {
        this.postSubs.unsubscribe();
    }

}