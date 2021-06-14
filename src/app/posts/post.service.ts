import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
//import { PostSocketService } from './post-socket.service';
import { AuthService } from '../auth/auth.service';

// {providedIn: 'root'} ensures there is a single instance of PostService i.e. Singleton pattern
@Injectable({ providedIn: 'root' })
export class PostService {
    private posts: Post[] = [];
    
    private postsPerPage = 10;
    private currentPage = 1;

    private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();

    constructor(
        private http: HttpClient, 
        private router: Router, 
        private authService: AuthService
        //private postSocketService: PostSocketService
        ) { 
        // console.log("calling observePostSocket()");
        // this.observePostSocket();
    }

    getPosts(postsPerPage: number, currentPage: number) {
        this.postsPerPage = postsPerPage;
        this.currentPage = currentPage
        const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`
        this.http.get<{ message: string, posts: any, postCount: number }>("http://localhost:3000/api/posts" + queryParams)
            // the below transformation is required to transform the server side Post model
            // defined in backend/models/post.js where mongoose creates an additional _id field by default.
            .pipe(map((responseData) => {
                return {
                    postCount: responseData.postCount,
                    posts: responseData.posts.map(post => {
                        return {
                            title: post.title,
                            content: post.content,
                            id: post._id,
                            imagePath: post.imagePath,
                            creator: post.creator
                        }
                    })
                }
            }))
            .subscribe((transformedPosts) => {
                // console.log('Posts service received the Posts from server');
                // console.log(transformedPosts);
                this.posts = transformedPosts.posts;
                this.postsUpdated.next({ posts: [...this.posts], postCount: transformedPosts.postCount });
            });
        // return [...this.posts];
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    getPost(id: string) {
        //return { ...this.posts.find(p => p.id === postId) }
        return this.http.get<{ _id: string, title: string, content: string, imagePath: string, creator: string }>('http://localhost:3000/api/posts/' + id);
    }

    addPost(title: string, content: string, image: File) {
        // ** ImpNote: Using formData instead of Post JSON object as we have the image as a File object.
        // and json can't include a file.
        // @See Lecture 80 --> 0:22 timestamp
        const postData = new FormData();
        postData.append("title", title);
        postData.append("content", content);
        postData.append('image', image, title);
        this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
            // Alternate way to send the transformedPost with an id to .subscriber().    
            // .pipe(map((postMongData) => {
            //     console.log(postMongData.message);
            //     const post = postMongData.post;
            //     return {
            //         title: post.title,
            //         content: post.content,
            //         id: post._id
            //     }
            // }))
            .subscribe((responseData) => {
                console.log('response from create post');
                console.log(responseData);
                //** Imp Note: The below code to emit change post event is commented off since we navigate 
                // back to the root where we reload the posts by calling the getPosts() method from the ngOnInit() method of the post-list.component */

                //console.log(postMongData.message);
                // const post: Post = {
                //     id: responseData.post.id,
                //     title: title,
                //     content: content,
                //     imagePath: responseData.post.imagePath
                // }
                // this.posts.push(post);
                // this.postsUpdated.next([...this.posts]);
                //this.postSocketService.emitCreatePostSocket(postData);
                this.router.navigate(["/"]);
            });
    }

    // The image could either be a File object if freshly loaded from local storage
    // OR it could be a string from the server if unedited
    updatePost(id: string, title: string, content: string, image: File | string) {
        let postData: Post | FormData;
        if (typeof (image) === 'object') {
            postData = new FormData();
            postData.append("id", id);
            postData.append("title", title);
            postData.append("content", content);
            postData.append('image', image, title);
        } else {
            postData = {
                id: id,
                title: title,
                content: content,
                imagePath: image,
                creator: null
            }
        }
        this.http.put<{ message: string, imagePath: string }>('http://localhost:3000/api/posts/' + id, postData)
            .subscribe((responseData) => {
                //** Imp Note: The below code to emit change post event is commented off since we navigate 
                // back to the root where we reload the posts by calling the getPosts() method from the ngOnInit() method of the post-list.component */

                // console.log(responseData.message);
                // const updatedPosts = [...this.posts];
                // const updatedPostIndex: number = updatedPosts.findIndex((postIter) => {
                //     postIter.id === id;
                // });
                // const post: Post = {
                //     id: id,
                //     title: title,
                //     content: content,
                //     imagePath: responseData.imagePath
                // }
                // updatedPosts[updatedPostIndex] = post;
                // this.posts = updatedPosts;
                // this.postsUpdated.next([...this.posts]);
                //this.postSocketService.emitUpdatePostSocket(postData);
                this.router.navigate(["/"]);
            });
    }

    deletePost(postId: string) {
        return this.http.delete<{ message: string }>('http://localhost:3000/api/posts/' + postId);
    }

    // private observePostSocket() {
    //     this.postSocketService.receiveCreatePostSocket()
    //     .subscribe((post: any) => {
    //       console.log(`Create ${post.id} Post socket received`);
    //       this.refreshPosts(post);
    //     });
       
    //     this.postSocketService.receiveUpdatePostSocket()
    //     .subscribe((post: any) => {
    //       console.log(`Update ${post.id} Post socket received`);
    //       this.refreshPosts(post);
    //     });
       
    //     this.postSocketService.receiveDeletePostSocket()
    //     .subscribe((post: any) => {
    //       console.log(`Delete ${post.id} Post socket received`);
    //       this.refreshPosts(post);
    //     });
    //   }
       
    //   private refreshPosts(post: any) {
    //     if (post.creator != this.authService.getUserId()) {
    //         this.getPosts(this.postsPerPage, this.currentPage);
    //     }
    //   }

}