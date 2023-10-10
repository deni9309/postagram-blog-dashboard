import { Component, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { FormBuilder, NgModel, Validators } from '@angular/forms';

import { Category, CategoryWithId } from 'src/app/interfaces';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
    selector: 'app-new-post',
    templateUrl: './new-post.component.html',
    styleUrls: [ './new-post.component.css' ]
})
export class NewPostComponent implements OnInit {
    permalink: string = '';

    imgSrc: string | ArrayBuffer | DataView | URL = 'assets/image-not-uploaded.png';
    selectedImg: string | ArrayBuffer | DataView | URL | File;

    postForm = this.fb.group({
        title: [ '', [ Validators.required, Validators.minLength(6) ] ],
        permalink: [ { value: '', disabled: true }, [ Validators.required ] ],
        excerpt: [ '', [ Validators.required, Validators.minLength(20) ] ],
        category: [ '', [ Validators.required ] ],
        postImg: [ '', [ Validators.required ] ],
        content: [ '', [ Validators.required ] ]
    });

    content: NgModel;
    contentPlaceholder: string = 'Write your post here...';

    categories: DocumentData[] | DocumentData & { id: string }[] | CategoryWithId[] | Category[];

    constructor(private fb: FormBuilder, private categoryService: CategoriesService) { }

    ngOnInit(): void {
        this.categoryService.loadData()
            .subscribe({
                next: (data) => {
                    this.categories = data;
                }
            });
    }

    get fc() {
        return this.postForm.controls;
    }

    onTitleChanged($event) {
        const title = $event.target.value;
        this.permalink = title.replace(/\s/g, '-');
    }

    showImagePreview($event) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.imgSrc = e.target.result;
        }

        reader.readAsDataURL($event.target.files[ 0 ]);
        this.selectedImg = $event.target.files[ 0 ];
    }

    onSubmit() {
        if (this.postForm.invalid) return;
    }
}
