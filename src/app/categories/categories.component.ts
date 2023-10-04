import { Component, OnInit, ViewChild } from '@angular/core';
import { Firestore, doc, deleteDoc, DocumentData } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { CategoriesService } from '../services/categories.service';
import { Category, CategoryWithId } from '../interfaces';
import { ToastrService } from 'ngx-toastr';

export interface EditMode {
    value: boolean;
    categoryId: string | ''
}

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: [ './categories.component.css' ]
})
export class CategoriesComponent implements OnInit {
    @ViewChild('categoryEditForm') categoryEditForm: NgForm;

    allCategories$: Observable<DocumentData[] | DocumentData & { id: string }[] | CategoryWithId[]>;

    isInEditMode: EditMode = { value: false, categoryId: '' };

    constructor(
        private firestore: Firestore,
        private categoryService: CategoriesService,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.allCategories$ = this.categoryService.loadData();
    }

    leaveEditMode() {
        this.isInEditMode = {
            value: false,
            categoryId: ''
        }
    }

    enterEditMode(categoryDoc: DocumentData): void {
        this.isInEditMode = {
            value: true,
            categoryId: categoryDoc[ 'id' ]
        }

        setTimeout(() => {
            this.categoryEditForm.form.patchValue({
                id: categoryDoc[ 'id' ],
                category: categoryDoc[ 'category' ]
            });
        });
    }

    onEditSubmit(form: NgForm) {
        if (form.invalid) return;

        const data: CategoryWithId = {
            id: form.value.id,
            category: form.value.category,
        };

        this.categoryService.updateData(data).subscribe({
            next: () => {
                this.leaveEditMode();
                form.reset();
            },
            error: err => { console.log(err); }
        });
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

    onDelete(id: string) {

    }

    deleteData(id: string) {
        const docInstance = doc(this.firestore, 'categories', id);
        deleteDoc(docInstance)
            .then(() => console.log('Deleted!'))
            .catch((err) => { console.log(err) });
    }
}
