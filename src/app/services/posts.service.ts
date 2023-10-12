import { Injectable } from '@angular/core';
import { ref, uploadBytesResumable, getStorage, getDownloadURL } from '@angular/fire/storage';
import { initializeApp } from '@firebase/app';

import { environment } from 'src/environments/environment.variables';

@Injectable({
    providedIn: 'root'
})
export class PostsService {

    constructor() { }

    /**
    * Uploads an image to Firebase Storage and returns it's download URL.
    * @param selectedImage 
    * @returns {Promise<string>}
    * Download URL of the newly uploaded image.
    */
    uploadImage(selectedImage: ArrayBuffer | Blob | Uint8Array): Promise<string> {
        const filePath = `postIMG/${Date.now()}`;
        const st = getStorage(initializeApp(environment.firebaseConfig));
        const storageRef = ref(st, filePath);

        const uploaded = uploadBytesResumable(storageRef, selectedImage).then(() => {
            return getDownloadURL(storageRef);
        });
        return uploaded as Promise<string>;
    }

}
