import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

// {providedIn: 'root'} ensures there is a single instance of PostService i.e. Singleton pattern
@Injectable({ providedIn: 'root' })
export class PostService {
    private posts: Post[] = []
    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient, private router: Router) { }

    getPosts() {
        this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
            // the below transformation is required to transform the server side Post model
            // defined in backend/models/post.js where mongoose creates an additional _id field by default.
            .pipe(map((responseData) => {
                return responseData.posts.map(post => {
                    return {
                        title: post.title,
                        content: post.content,
                        id: post._id
                    }
                });
            }))
            .subscribe((transformedPosts) => {
                // console.log('Posts service received the Posts from server');
                // console.log(transformedPosts);
                this.posts = transformedPosts;
                this.postsUpdated.next([...this.posts]);
            });
        // return [...this.posts];
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    getPost(id: string) {
        //return { ...this.posts.find(p => p.id === postId) }
        return this.http.get<{_id: string, title: string, content: string}>('http://localhost:3000/api/posts/' + id);
    }

    updatePost(post: Post) {
        this.http.put<{ message: string }>('http://localhost:3000/api/posts/' + post.id, post)
        .subscribe((responseData) => {
            console.log(responseData.message);
            const updatedPosts = [...this.posts];
            const updatedPostIndex: number = updatedPosts.findIndex((postIter) => {
                postIter.id === post.id;
            });
            updatedPosts[updatedPostIndex] = post;
            this.posts = updatedPosts;
            this.postsUpdated.next([...this.posts]);
            this.router.navigate(["/"]);
        });
    }

    addPost(post: Post) {
        this.http.post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)
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
                //console.log(postMongData.message);
                post.id = responseData.postId;
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
                this.router.navigate(["/"]);
            });

    }

    deletePost(postId: string) {
        this.http.delete<{ message: string }>('http://localhost:3000/api/posts/' + postId)
            .subscribe((responseData) => {
                console.log(responseData.message);
                const updatedPosts = this.posts.filter((post) => {
                    return postId !== post.id
                });
                this.posts = updatedPosts;
                this.postsUpdated.next([...this.posts]);
            });
    }

}