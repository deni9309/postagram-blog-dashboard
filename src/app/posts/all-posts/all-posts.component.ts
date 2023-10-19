import { Component, OnInit, TemplateRef } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';

import { PostWithId } from 'src/app/interfaces';
import { PostsService } from 'src/app/services/posts.service';

@Component({
    selector: 'app-all-posts',
    templateUrl: './all-posts.component.html',
    styleUrls: [ './all-posts.component.css' ]
})
export class AllPostsComponent implements OnInit {

    posts$: Observable<DocumentData[] | DocumentData & { id: string }[] | PostWithId[]>

    modalRef: BsModalRef;
    config = { animated: true, class: 'modal-sm' };
    postIdToDelete: string = '';
    postImgPathToDelete: string = '';

    constructor(private postService: PostsService, private bsModal: BsModalService) { }

    ngOnInit(): void {
        this.posts$ = this.postService.loadData();
    }

    onDeleteClick(id: string, imgPath: string, template: TemplateRef<any>) {
        this.postIdToDelete = id;
        this.postImgPathToDelete = imgPath;

        this.modalRef = this.bsModal.show(template, this.config);
    }

    onDeleteConfirm() {
        this.postService.deleteImage(this.postIdToDelete, this.postImgPathToDelete);

        this.postIdToDelete = '';
        this.postImgPathToDelete = '';
        this.modalRef.hide();
    }

    onDeleteDecline() {
        this.postIdToDelete = '';
        this.postImgPathToDelete = '';
        this.modalRef.hide();
    }

    onFeatured(id: string, isFeatured: boolean) {
        this.postService.updatePostDataByField(id, { isFeatured });
    }
}
