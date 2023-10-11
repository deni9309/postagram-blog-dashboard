import { Injectable, inject } from '@angular/core';
import { Storage } from '@angular/fire/storage';

@Injectable({
    providedIn: 'root'
})
export class PostsService {



    uploadImage(selectedImage) {
        const filePath = `postIMG/${Date.now()}`;

        console.log(filePath);

        // const storageRef=ref(this.storage, )
    }
}
