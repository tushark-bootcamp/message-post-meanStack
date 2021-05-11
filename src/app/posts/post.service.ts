import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// {providedIn: 'root'} ensures there is a single instance of PostService i.e. Singleton pattern
@Injectable({ providedIn: 'root' })
export class PostService {
    private posts: Post[] = []
    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient) { }

    getPosts() {
        this.http.get<{ message: string, posts: Post[] }>('http://localhost:3000/api/posts')
            .subscribe((postData) => {
                // console.log('Posts service received the Posts from server');
                // console.log(postData.posts);
                this.posts = postData.posts;
                this.postsUpdated.next([...this.posts]);
            });
        // return [...this.posts];
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    addPost(post: Post) {
        this.http.post<{ message: string }>('http://localhost:3000/api/posts', post)
            .subscribe((responseData) => {
                console.log(responseData.message);
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
            });

    }

}