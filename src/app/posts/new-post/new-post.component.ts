import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent {
    constructor() { }
    
    onSubmit(formData: NgForm) {
        if (formData.invalid) return;
    }
}
