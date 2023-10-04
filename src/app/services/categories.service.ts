import { Injectable } from '@angular/core';
import { DocumentData, Firestore, addDoc, collection, collectionData, doc, updateDoc } from '@angular/fire/firestore';
import { EMPTY, Observable, from } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { Category, CategoryWithId } from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class CategoriesService {

    constructor(private firestore: Firestore, private toastr: ToastrService) { }

    saveData(data: Category): Observable<void> {
        const collectionInstance = collection(this.firestore, 'categories');
        const onAdd = addDoc(collectionInstance, data)
            .then(docRef => {
                this.toastr.success('Category added successfully!');
            })
            .catch((err) => {
                this.toastr.error(err);
            });

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
            .catch(err => { console.log(err); this.toastr.error(err); });

        return from(updatedDoc);
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
