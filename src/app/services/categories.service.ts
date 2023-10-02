import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { EMPTY, Observable, from } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { Category } from '../interfaces';

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
