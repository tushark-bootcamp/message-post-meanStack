import { AbstractControl } from "@angular/forms";
import { Observable, Observer, of } from "rxjs";

export const mimeType = (control: AbstractControl): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
    // The below line turns off the validation if the image is not of type File object and a string which 
    // is the case when we edit an existing post which has a imagepath instead of image as a file object.
    if(typeof(control.value) === 'string') {
        return of(null);
    }
    const file = control.value as File;
    const fileReader = new FileReader();
    const fileRdrObs = new Observable((observer: Observer<{ [key: string]: any }>) => {
        fileReader.addEventListener("loadend", () => {
            const arr = new Uint8Array(<ArrayBuffer>fileReader.result).subarray(0, 4);
            let header = "";
            let isValid = false;
            for (let i = 0; i < arr.length; i++) {
                // toString(16) is to convert to hexadecimal string
                header += arr[i].toString(16);
            }
            switch (header) {
                case "89504e47":
                    isValid = true;
                    break;
                case "ffd8ffe0":
                case "ffd8ffe1":
                case "ffd8ffe2":
                case "ffd8ffe3":
                case "ffd8ffe8":
                    isValid = true;
                    break;
                default:
                    isValid = false;
                    break;
            }
            if(isValid) {
                observer.next(null);
            } else {
                observer.next({invalidMimeType: true});
            }
            observer.complete();
        });
        fileReader.readAsArrayBuffer(file);
    });
    return fileRdrObs;
};