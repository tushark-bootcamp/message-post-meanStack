import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';

// {providedIn: 'root'} ensures there is a single instance of PostService i.e. Singleton pattern
@Injectable({providedIn: 'root'})
export class PostService {
    private posts: Post[] = []
    private postsUpdated = new Subject<Post[]>();

    getPosts() {
        return [...this.posts];
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    addPost(post: Post) {
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
    }

}