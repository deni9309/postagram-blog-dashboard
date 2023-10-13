import { Injectable } from '@angular/core';
import { DocumentData, Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { ref, uploadBytesResumable, getStorage, getDownloadURL } from '@angular/fire/storage';
import { initializeApp } from '@firebase/app';
import { ToastrService } from 'ngx-toastr';

import { environment } from 'src/environments/environment.variables';
import { Post, PostWithId } from '../interfaces';
import { Observable, map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PostsService {

    constructor(private firestore: Firestore, private toastr: ToastrService) { }

    /**
    * Uploads an image to Firebase Storage and creates new post document with returned download URL of uploaded img.
    * @param selectedImage
    * @param postData
    * @returns {Promise<void>}
    */
    publishPost(selectedImage: ArrayBuffer | Blob | Uint8Array, postData: Post): Promise<void> {
        const filePath = `postIMG/${Date.now()}`;
        const st = getStorage(initializeApp(environment.firebaseConfig));
        const storageRef = ref(st, filePath);

        const uploaded = uploadBytesResumable(storageRef, selectedImage).then(() => {
            getDownloadURL(storageRef).then(url => {
                postData.postImgPath = url;
                this.savePostData(postData);
            }).catch(err => {
                console.log(err);
                this.toastr.error('An error occured! Please try again');
            })
        });

        return uploaded as Promise<void>;
    }

    private savePostData(post: Post) {
        const collectionInstance = collection(this.firestore, 'posts');
        addDoc(collectionInstance, post).then(() => {
            this.toastr.success('Post published successfully!');
        });
    }

    loadData(): Observable<DocumentData[] | DocumentData & { id: string }[] | PostWithId[]> {
        const collectionInstance = collection(this.firestore, 'posts');

        return collectionData(collectionInstance, { idField: 'id' });      
    };
}
