import { Component, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { FormBuilder, NgModel, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Category, CategoryWithId, Post } from 'src/app/interfaces';
import { CategoriesService } from 'src/app/services/categories.service';
import { PostsService } from 'src/app/services/posts.service';

@Component({
    selector: 'app-new-post',
    templateUrl: './new-post.component.html',
    styleUrls: [ './new-post.component.css' ]
})
export class NewPostComponent implements OnInit {
    permalink: string = '';

    imgSrc: string | ArrayBuffer | DataView | URL = 'assets/image-not-uploaded.png';
    selectedImg: ArrayBuffer | Blob | Uint8Array;

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

    constructor(
        private fb: FormBuilder,
        private categoryService: CategoriesService,
        private postService: PostsService,
        private toastr: ToastrService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.categoryService.loadData()
            .subscribe({
                next: (data) => { this.categories = data; }
            });
    }

    get fc() {
        return this.postForm.controls;
    }

    onTitleChanged($event) {
        let title = $event.target.value;
        title = title.replace(/\s/g, '-');
        title = title.replace(/'/g, '');
        this.permalink = title.toLowerCase();
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

        let postData: Post = {
            title: this.postForm.value.title,
            permalink: this.permalink,
            category: {
                categoryId: this.postForm.value.category.split('-').at(0),
                category: this.postForm.value.category.split('-').at(1)
            },
            postImgPath: '',
            excerpt: this.postForm.value.excerpt,
            content: this.postForm.value.content,
            isFeatured: false,
            views: 0,
            status: 'new',
            createdAt: new Date()
        }

        this.postService.publishPost(this.selectedImg, postData).then(() => {
            this.postForm.reset;
            this.imgSrc = 'assets/image-not-uploaded.png';
            this.router.navigate([ '/posts' ]);
        }).catch(err => {
            this.postForm.reset();
            this.imgSrc = 'assets/image-not-uploaded.png'
        });
    }
}
