import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, NgControl, NgForm, NgModel } from '@angular/forms';
import { Observable, combineLatest, debounceTime, distinctUntilChanged, distinctUntilKeyChanged, of, startWith, switchMap, tap, withLatestFrom } from 'rxjs';

@Component({
    selector: 'app-new-post',
    templateUrl: './new-post.component.html',
    styleUrls: [ './new-post.component.css' ]
})
export class NewPostComponent implements OnInit {
    @ViewChild('title', { static: true }) title: FormControl;
    permalinkTitle: string = '';
    
    imgSrc: string | ArrayBuffer | DataView | URL = 'assets/image-not-uploaded.png';
    selectedImg: string | ArrayBuffer | DataView | URL | File;
    
    constructor() { }

    ngOnInit(): void {
        combineLatest([ this.title.valueChanges.pipe(
            debounceTime(1000)
        )
        ]).pipe(switchMap(([ textInput ]) => {
            textInput = textInput.replace(/\s/g, '-');
            return of(textInput)
        }))
            .subscribe((output) => {
                this.permalinkTitle = output;
            });
    }

    showImagePreview($event) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.imgSrc = e.target.result;
        }

        reader.readAsDataURL($event.target.files[ 0 ]);
        this.selectedImg = $event.target.files[ 0 ];
    }

    onSubmit(formData: NgForm) {
        if (formData.invalid) return;
    }
}
