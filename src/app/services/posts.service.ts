import { Injectable } from '@angular/core';
import { DocumentData, Firestore, addDoc, collection, collectionData, doc, docData, updateDoc } from '@angular/fire/firestore';
import { ref, uploadBytesResumable, getStorage, getDownloadURL, getBytes, getBlob, uploadBytes } from '@angular/fire/storage';
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
    publishPost(
        selectedImage: ArrayBuffer | Blob | Uint8Array,
        postData: Post,
        formStatus: string,
        id?: string
    ): Promise<void> {
        let filePath: string;
        if (id) {
            filePath = postData.refFullPath;
        } else {
            filePath = `postIMG/${Date.now()}`
        };

        const st = getStorage(initializeApp(environment.firebaseConfig));
        const storageRef = ref(st, filePath);

        const uploaded = uploadBytesResumable(storageRef, selectedImage).then((blob) => {
            postData.refFullPath = blob.ref.fullPath;
        
            getDownloadURL(storageRef).then(url => {
                postData.postImgPath = url;

                if (formStatus == 'Edit') {
                    this.updatePostData(id, postData);
                } else {
                    this.savePostData(postData);
                }
            }).catch(err => {
                this.toastr.error('An error occured! Please try again');
            })
        });

        return uploaded as Promise<void>;
    }

    private savePostData(post: Post) {
        const collectionInstance = collection(this.firestore, 'posts');

        post.createdAt = new Date();
        post.status = 'new';
        post.updatedAt = post.createdAt;

        addDoc(collectionInstance, post).then(() => {
            this.toastr.success('Post published successfully!');
        });
    }

    private updatePostData(id: string, postData: Post) {
        const docRef = doc(this.firestore, 'posts', id);

        postData.updatedAt = new Date();
        postData.status = 'updated';
        
        updateDoc(docRef, { ...postData }).then(() => {
            this.toastr.success('Post updated successfully!');
        });
    }

    loadData(): Observable<DocumentData[] | DocumentData & { id: string }[] | PostWithId[]> {
        const collectionInstance = collection(this.firestore, 'posts');

        return collectionData(collectionInstance, { idField: 'id' });
    };

    loadDocumentById(postId: string): Observable<DocumentData | DocumentData & { id: string }> {
        const docRef = doc(this.firestore, 'posts', postId);

        return docData(docRef, { idField: 'id' });
    }
}
