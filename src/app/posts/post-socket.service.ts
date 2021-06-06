import { Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { Injectable } from '@angular/core';

//@Injectable({ providedIn: 'root' })
export class PostSocketService {
    constructor(private socket: Socket) {}

    emitCreatePostSocket(post: any) {
        console.log("Emmiting create post");
        console.log(post);
        this.socket.emit('createPost', post);
    }

    receiveCreatePostSocket() {
        return new Observable((observer: any) => {
            this.socket.on('createPost', (post: any) => {
                observer.next(post);
            });
        });
    }

    emitUpdatePostSocket(post: any) {
        this.socket.emit('updatePost', post);
    }

    receiveUpdatePostSocket() {
        return new Observable((observer: any) => {
            this.socket.on('updatePost', (post: any) => {
                observer.next(post);
            });
        });
    }

    emitDeletePostSocket(post: any) {
        this.socket.emit('deletePost', post);
    }

    receiveDeletePostSocket() {
        return new Observable((observer: any) => {
            this.socket.on('deletePost', (post: any) => {
                observer.next(post);
            });
        });
    }
}