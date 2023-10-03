import { Component, OnInit, ViewChild } from '@angular/core';
import { Firestore, doc, updateDoc, deleteDoc, DocumentData } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { CategoriesService } from '../services/categories.service';
import { Category, CategoryWithId } from '../interfaces';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: [ './categories.component.css' ]
})
export class CategoriesComponent implements OnInit {
    @ViewChild('categoryForm') categoryForm: NgForm;

    allCategories$: Observable<DocumentData[] | DocumentData & { id: string }[] | CategoryWithId[]>;

    constructor(private firestore: Firestore, private categoryService: CategoriesService) { }

    ngOnInit(): void {
        this.allCategories$ = this.categoryService.loadData();
    }

    onSubmit(form: NgForm): void {
        if (form.invalid) return;

        const categoryData: Category = {
            category: form.value.category
        };

        this.categoryService.saveData(categoryData).subscribe({
            next: () => { form.reset(); },
            error: err => { console.log(err); }
        });
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
