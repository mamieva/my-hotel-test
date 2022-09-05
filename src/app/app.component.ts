import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

import { emailValidator } from './email-validator.directive';
import { DeletePost, GetPosts, PostNewPost, PutPost, SelectPost } from './store/app.actions';
import { AppState, Post } from './store/app.state';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  reactiveForm!: FormGroup;
  post: Post;
  newPost: boolean = false;
  @Select(AppState.postList)
  postList$: Observable<Array<Post>>;

  constructor(
    private store: Store,
    private toastr: ToastrService
  ) {
    this.post = {
      id: null,
      title: null,
      body: null,
      userId: null
    } as Post;
  }

  ngOnInit(): void {
    this.store.dispatch(new GetPosts())
    this.reactiveForm = new FormGroup({
      title: new FormControl(this.post.title, [
        Validators.required,
        Validators.maxLength(30),
      ]),
      body: new FormControl(this.post.body, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(250),
      ]),
      id: new FormControl(this.post.id, [
      ]),
      userId: new FormControl(this.post.userId, [
        Validators.required,
        Validators.minLength(5),
        emailValidator(),
      ]),
    });
  }

  get title() {
    return this.reactiveForm.get('title')!;
  }

  get body() {
    return this.reactiveForm.get('body')!;
  }

  get userId() {
    return this.reactiveForm.get('userId')!;
  }

  get id() {
    return this.reactiveForm.get('id')!;
  }

  public validate(): void {
    if (this.reactiveForm.invalid) {
      for (const control of Object.keys(this.reactiveForm.controls)) {
        this.reactiveForm.controls[control].markAsTouched();
      }
      return;
    }
    this.post = this.reactiveForm.value;
    const action = !this.post.id ? new PostNewPost(this.post) : new PutPost(this.post.id, this.post);
    this.store.dispatch(action).toPromise()
      .then(result => {
        this.toastr.success('Action completed successfully');
      });
  }

  deletePost(id: number) {
    this.store.dispatch(new DeletePost(id)).toPromise()
      .then((result) => {
        this.store.dispatch(new GetPosts());
      })
  }

  addNewPost() {
    this.newPost = true;
    this.reactiveForm.reset();
  }

  showNewPost() {
    return !!this.newPost;
  }

  updatePost(post: Post) {
    this.store.dispatch(new SelectPost(post));
    this.reactiveForm.setValue(post);
    this.newPost = true;
  }

}
