import { Component, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
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

    constructor(private postService: PostsService) { }

    ngOnInit(): void {
        this.posts$ = this.postService.loadData();
    }

    onEdit(post: DocumentData | DocumentData & { id: string }) { }
    
    onDeleteClick(postId:string){}
}
