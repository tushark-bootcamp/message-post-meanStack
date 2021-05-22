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
                        id: post._id,
                        imagePath: post.imagePath
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
        return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>('http://localhost:3000/api/posts/' + id);
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
                imagePath: image
            }
        }
        this.http.put<{ message: string, imagePath: string }>('http://localhost:3000/api/posts/' + id, postData)
            .subscribe((responseData) => {
                console.log(responseData.message);
                const updatedPosts = [...this.posts];
                const updatedPostIndex: number = updatedPosts.findIndex((postIter) => {
                    postIter.id === id;
                });
                const post: Post = {
                    id: id,
                    title: title,
                    content: content,
                    imagePath: responseData.imagePath
                }
                updatedPosts[updatedPostIndex] = post;
                this.posts = updatedPosts;
                this.postsUpdated.next([...this.posts]);
                this.router.navigate(["/"]);
            });
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
                //console.log(postMongData.message);
                const post: Post = {
                    id: responseData.post.id,
                    title: title,
                    content: content,
                    imagePath: responseData.post.imagePath
                }
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