import { Injectable } from '@angular/core';
import { DocumentData, DocumentReference, Firestore, addDoc, collection, collectionData, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';

import { Category, CategoryWithId } from '../interfaces';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class CategoriesService {

    constructor(private firestore: Firestore, private toastr: ToastrService) { }

    saveData(data: Category): Observable<DocumentData | DocumentReference<DocumentData> | void> {
        const collectionInstance = collection(this.firestore, 'categories');
        const onAdd = addDoc(collectionInstance, data);

        return from(onAdd);
    }

    loadData(): Observable<DocumentData[] | DocumentData & { id: string }[] | CategoryWithId[]> {
        const collectionInstance = collection(this.firestore, 'categories');

        return collectionData(collectionInstance, { idField: 'id' });
    }

    updateData(data: DocumentData | CategoryWithId): Observable<void> {
        const docInstance = doc(this.firestore, 'categories', data.id);
        const updatedDoc = updateDoc(docInstance, { category: data[ 'category' ] })
            .then(() => {
                this.toastr.info('Category updated successfully!');
            })
            .catch(err => {
                this.toastr.error('Category hasn\'t been updated!', 'Something went wrong!');   
            });

        return from(updatedDoc);
    }

    deleteData(id: string): Observable<void> {
        const docInstance = doc(this.firestore, 'categories', id);

        const onDelete = deleteDoc(docInstance)
            .then(() => {
                this.toastr.warning('Category has been deleted.')
            })
            .catch(err => {
                this.toastr.error('Category hasn\'t been deleted!', 'Something went wrong!');
            });

        return from(onDelete);
    }

    // saveDataWithSubCollection(data: string) {
    //     const collectionInstance = collection(this.firestore, 'categories');
    //     addDoc(collectionInstance, form.value).then((data) => {
    //         addDoc(collection(this.firestore, 'categories', data.id, 'salads'), {
    //             name: 'cesar salad'
    //         }).then(() => { });
    //     })
    //         .catch((err) => {
    //             console.log(err);
    //         });

    //     // this.firestore.collection('categories').add(categoryData).then(docRef => 
    //     //     console.log(docRef))
    //     //     .catch(err =>
    //     //         console.log(err));
    // }
}
