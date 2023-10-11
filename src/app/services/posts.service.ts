import { Injectable, inject } from '@angular/core';
import { Storage, ref } from '@angular/fire/storage';

@Injectable({
    providedIn: 'root'
})
export class PostsService {

    constructor(private storage: Storage) { }

    uploadImage(selectedImage) {
        const filePath = `postIMG/${Date.now()}`;

        console.log(filePath);

        
    }
}
