import { Component, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, mergeMap, of } from 'rxjs';

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
    categories: DocumentData[] | DocumentData & { id: string }[] | CategoryWithId[] | Category[];
    editedPost?: DocumentData | DocumentData & { id: string } = null;
    postId?: string = null;
    refFullPath: string = null;   
    formStatus = 'Create New';

    postForm = this.fb.group({
        title: [ '', [ Validators.required, Validators.minLength(6) ] ],
        permalink: [ { value: '', disabled: true }, [ Validators.required ] ],
        excerpt: [ '', [ Validators.required, Validators.minLength(20) ] ],
        category: [ '', [ Validators.required ] ],
        postImg: [ '', [ Validators.required ] ],
        content: [ '', [ Validators.required ] ]
    });

    constructor(
        private fb: FormBuilder,
        private categoryService: CategoriesService,
        private postService: PostsService,
        private toastr: ToastrService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        combineLatest([
            this.activatedRoute.queryParams.pipe(
                mergeMap(params => {
                    this.postId = params[ 'id' ];
                    if (this.postId) {
                        return this.postService.loadDocumentById(this.postId);
                    } else {
                        return of(null);
                    }
                })
            ),
            this.categoryService.loadData()
        ]).subscribe({
            next: ([ post, categories ]) => {
                if (post) {
                    this.formStatus = 'Edit';
                    this.editedPost = post;
                    this.refFullPath = post[ 'refFullPath' ];
                    this.permalink = post[ 'permalink' ];
                    setTimeout(() => {
                        this.postForm.patchValue({
                            title: post[ 'title' ],
                            permalink: post[ 'permalink' ],
                            excerpt: post[ 'excerpt' ],
                            category: `${post[ 'category' ][ 'categoryId' ]}-${post[ 'category' ][ 'category' ]}`,
                            content: post[ 'content' ]
                        });
                    });
                    this.imgSrc = post[ 'postImgPath' ];
                }
                this.categories = categories;
            },
            error: err => {
                console.log(err);
                this.router.navigate([ '/page-not-found' ]);
            }
        })
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
        reader.onload = (e) => { this.imgSrc = e.target.result; }

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
            refFullPath: this.refFullPath,
            excerpt: this.postForm.value.excerpt,
            content: this.postForm.value.content,
            isFeatured: false,
            views: 0,
        }

        this.postService.publishPost(this.selectedImg, postData, this.formStatus, this.postId).then(() => {           
            this.router.navigate([ '/posts' ]);
        }).catch(err => {
            this.router.navigate([ '/page-not-found' ]);
        }).finally(() => {
            this.formStatus = 'Create New';
            this.editedPost = null;
            this.postId = null;
            this.refFullPath = null;
        });
    }
}
