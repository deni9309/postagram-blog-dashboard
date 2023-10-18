import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { CategoriesService } from '../services/categories.service';
import { Category, CategoryWithId } from '../interfaces';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

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

    modalRef: BsModalRef;
    config = { animated: true, class: 'modal-sm' };
    categoryIdToDelete: string = '';

    constructor(
        private categoryService: CategoriesService,
        private toastr: ToastrService,
        private modalService: BsModalService,
    ) { }

    ngOnInit(): void {
        this.allCategories$ = this.categoryService.loadData();
    }

    leaveEditMode(): void {
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

        this.categoryService.updateData(data).subscribe(() => {
            form.reset();
            this.leaveEditMode();
        });
    }

    onSubmit(form: NgForm): void {
        if (form.invalid) return;
        const categoryData: Category = {
            category: form.value.category
        };

        this.categoryService.saveData(categoryData).subscribe({
            next: () => {
                this.toastr.success('Category created successfully!');
                form.reset();
            },
            error: (err) => {
                this.toastr.error('Category hasn\'t been created!', 'Something went wrong!');
                form.reset();
                console.log(err);
            }
        });
    }

    onDeleteClick(id: string, template: TemplateRef<any>) {
        this.categoryIdToDelete = id;

        this.modalRef = this.modalService.show(template, this.config);
    }

    onDeleteConfirm() {
        this.categoryService.deleteData(this.categoryIdToDelete).subscribe({
            next: () => {
                this.categoryIdToDelete = '';
            }
        });

        this.modalRef.hide();
    }

    onDeleteDecline() {
        this.categoryIdToDelete = '';
        this.modalRef.hide();
    }
}
