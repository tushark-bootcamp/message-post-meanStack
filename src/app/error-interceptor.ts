import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ErrorComponent } from './error/error.component';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(public dialog: MatDialog) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                //console.log(error);
                //alert(error.error.message);
                let errorMessage = "An unknown error occured";
                if(error.error.message) {
                    errorMessage = error.error.message;
                } else if (error.error.error.message) {
                    errorMessage = error.error.error.message;
                }
                this.dialog.open(ErrorComponent, {data: {message: errorMessage} })
                return throwError(error);
            })
        );
    }
}