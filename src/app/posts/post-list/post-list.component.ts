import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription, Subject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

    //postsService: PostService;
    //@Input() posts: Post[] = [];
    posts: Post[] = [];
    isLoading = false;
    totalPosts = 0;
    postsPerPage = 10;
    currentPage = 1;
    pageSizeOptions = [1, 2, 5, 10];
    private postSubs: Subscription;
    //private postPageListener = new Subject<{postsPerPage: number, currentPage: number}>();

    userId: string;

    isloggedIn = false;
    private authStatusSubs: Subscription;

    // constructor(postsService: PostService) {
    //     this.postsService = postsService;
    // }

    // This way of declaring postsService with a public key work is a shortcut to the above method
    // of declaring constructor
    constructor(public postsService: PostService, private authService: AuthService) { }

    ngOnInit() {
        this.isLoading = true;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
        this.postSubs = this.postsService.getPostUpdateListener()
            .subscribe((refreshedPosts: { postCount: number, posts: Post[] }) => {
                this.isLoading = false;
                this.totalPosts = refreshedPosts.postCount;
                // Once you update this.posts, you DON'T need to separately emit a changePosts event like you do in service file
                this.posts = refreshedPosts.posts;
            });
        this.isloggedIn = this.authService.getIsAuthenticated();
        // The userId is explicitly initialised outside the .subscribe() as this component may not have been initialised
        // at the time when login event emitted the userId. 
        this.userId = this.authService.getUserId();
        this.authStatusSubs = this.authService.getAuthStatusListener()
            .subscribe(authStatus => {
                this.isloggedIn = authStatus;
                // Re initialise the userId to update new userId if a different user logs in the same browser session 
                this.userId = this.authService.getUserId();
            });
    }

    onChangedPage(pageData: PageEvent) {
        this.isLoading = true;
        console.log(pageData);
        this.postsPerPage = pageData.pageSize;
        this.currentPage = pageData.pageIndex + 1;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
        //this.postPageListener.next({postsPerPage: this.postsPerPage, currentPage: this.currentPage});
    }

    // getPostPageListener() {
    //     return this.postPageListener.asObservable();
    // }

    ngOnDestroy() {
        this.postSubs.unsubscribe();
        this.authStatusSubs.unsubscribe();
    }

    onDelete(postId: string) {
        this.isLoading = true;
        // this.postsService.deletePost(postId)
        //     .subscribe((response: { message: string }) => {
        //         this.isLoading = false;
        //         console.log(response.message);
        //         const updatedPosts = this.posts.filter((post) => {
        //             return postId !== post.id
        //         });
        //         // Once you update this.posts, you DON'T need to separately emit a changePosts event like you do in service.ts file
        //         this.posts = updatedPosts;
        //     });

        //** A More intelligent solution is as below */
        this.postsService.deletePost(postId)
            .subscribe(() => {
                this.postsService.getPosts(this.postsPerPage, this.currentPage);
            });
        // Also no need to use .subscribe() method for getPosts(...) as the postsService.getPostUpdateListener()
        // is already being subscribed to in the ngOnInit() method.

    }

}