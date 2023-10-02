import { Component, ViewChild } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../interfaces';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: [ './categories.component.css' ]
})
export class CategoriesComponent {
    @ViewChild('categoryForm') categoryForm: NgForm;

    allCategories: any[] = [];
    allCategories$: Observable<any>;
    constructor(private firestore: Firestore, private categoryService: CategoriesService) {
    }

    onSubmit(form: NgForm) {
        if (form.invalid) return;

        const categoryData: Category = {
            category: form.value.category
        };

        this.categoryService.saveData(categoryData).subscribe({
            next: () => {
                console.log('added');
            },
            error: err => {
                console.log(err);
            }
        });

        // const collectionInstance = collection(this.firestore, 'categories');
        // addDoc(collectionInstance, form.value).then((data) => {
        //     addDoc(collection(this.firestore, 'categories', data.id, 'salads'), {
        //         name: 'cesar salad'
        //     }).then(() => { });
        // })
        //     .catch((err) => {
        //         console.log(err);
        //     });

        // this.firestore.collection('categories').add(categoryData).then(docRef => 
        //     console.log(docRef))
        //     .catch(err => 
        //         console.log(err));
    }

    getData() {
        const collectionInstance = collection(this.firestore, 'categories');
        collectionData(collectionInstance).subscribe({
            next: (data) => {
                this.allCategories = data;
            },
            error: (err) => {
                console.log(err);
            }
        });

        this.allCategories$ = collectionData(collectionInstance, { idField: 'id' });
    }

    updateData(id: string) {
        const docInstance = doc(this.firestore, 'categories', id);
        const updateData = {
            category: 'This is updated category'
        };

        updateDoc(docInstance, updateData)
            .then(() => {
                console.log('updated!!!');
            })
            .catch((err) => {
                console.log(err);
            });
    }

    deleteData(id: string) {
        const docInstance = doc(this.firestore, 'categories', id);
        deleteDoc(docInstance)
            .then(() => console.log('Deleted!'))
            .catch((err) => { console.log(err) });
    }
}
