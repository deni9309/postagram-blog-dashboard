import { Injectable } from '@angular/core';
import { DocumentData, Firestore, addDoc, collection, collectionData, deleteDoc, doc, docData, getDocs, getDocsFromServer, query, updateDoc, where } from '@angular/fire/firestore';
import { ref, uploadBytesResumable, getStorage, getDownloadURL, deleteObject } from '@angular/fire/storage';
import { initializeApp } from '@firebase/app';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { environment } from 'src/environments/environment.variables';
import { Post, PostWithId } from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class PostsService {
    private readonly st = getStorage(initializeApp(environment.firebaseConfig));

    constructor(private firestore: Firestore, private toastr: ToastrService) { }

    /**
     * Uploads an image to Firebase Storage 
     * Then returned download URL of uploaded image is assigned to the post property 'postImgPath'.
     * When successfull creates/edits the post document.
     * @param selectedImage image to upload
     * @param postData post data
     * @param formStatus 'Create New' or 'Edit' - Indicates wheteher to 'create' or 'edit' the post document
     * @param id Post Id {string} or 'null'
     * @returns Promise<void>
     */
    publishPost(
        selectedImage: ArrayBuffer | Blob | Uint8Array, postData: Post, formStatus: string, id?: string
    ): Promise<void> {
        let filePath: string;
        if (id) {
            filePath = postData.refFullPath;
        } else {
            filePath = `postIMG/${Date.now()}`
        };

        const storageRef = ref(this.st, filePath);
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
        }).catch(err => console.log(err));
    }

    updatePostDataByField(id: string, fieldsToUpdate: { [ key: string ]: any }) {
        const docRef = doc(this.firestore, 'posts', id);
        updateDoc(docRef, { ...fieldsToUpdate }).then(() => {
            this.toastr.info('Post modified.');
        }).catch(err => console.log(err));
    }

    loadData(): Observable<DocumentData[] | DocumentData & { id: string }[] | PostWithId[]> {
        const collectionInstance = collection(this.firestore, 'posts');

        return collectionData(collectionInstance, { idField: 'id' });
    };

    loadDocumentById(postId: string): Observable<DocumentData | DocumentData & { id: string }> {
        const docRef = doc(this.firestore, 'posts', postId);

        return docData(docRef, { idField: 'id' });
    }

    deleteImage(postId: string, fileUrl: string) {
        const fileRef = ref(this.st, fileUrl);

        deleteObject(fileRef).then(() => {
            this.deleteDocumentData(postId);
        }).catch(err => {
            this.toastr.error('An error occured! Please try again');
        });
    }

    deleteDocumentData(id: string) {
        const docRef = doc(this.firestore, 'posts', id);

        deleteDoc(docRef).then(() => {
            this.toastr.warning('Post has been deleted.');
        });
    }

    updatePostsCategory(category: string, categoryId: string) {
        const collectionRef = collection(this.firestore, 'posts');
        const q = query(collectionRef, where('category.categoryId', '==', categoryId));

        getDocsFromServer(q).then(documents => {
            documents.docs.forEach(d => {
                let docRef = d.ref;
                updateDoc(docRef, { 'category.category': category })
                    .then(() => { }).catch(err => this.toastr.error(err))
            })
        }).catch(err => this.toastr.error(err))
    };
}
