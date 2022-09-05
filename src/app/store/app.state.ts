import { Action, Select, Selector, State, StateContext } from '@ngxs/store';
import { DeletePost, GetPosts, PostNewPost, PutPost, SelectPost } from './app.actions';
import { Injectable } from '@angular/core';
import { PostsService } from '@app/_services/posts.service';

export interface AppStateModel {
  loading: boolean;
  postSelected: Post;
  postList: Array<Post>;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

@State<AppStateModel>({
  name: 'AppState',
  defaults: {
    loading: true,
    postSelected: {
      id: null,
      title: null,
      body: null,
      userId: null
    },
    postList: []
  }
})

@Injectable()
export class AppState {

  @Selector()
  public static postSelected(state: AppStateModel) {
    return state.postSelected;
  }

  @Selector()
  public static postList(state: AppStateModel) {
    return state.postList;
  }

  @Selector()
  public static loading(state: AppStateModel) {
    return state.loading;
  }

  constructor(
    private postsService: PostsService) {
  }

  @Action(GetPosts)
  public getPosts({ getState, patchState, dispatch }: StateContext<AppStateModel>) {
    return new Promise<void>((resolve, reject) => {
      this.postsService.getPosts().subscribe((list) => {
        patchState({
          postList: list
        })
        resolve();
      }, error => reject())
    })
  }

  @Action(PostNewPost)
  public postNewPost({ getState, patchState, dispatch }: StateContext<AppStateModel>, { post }: PostNewPost) {
    return new Promise<void>((resolve, reject) => {
      this.postsService.postPost(post).subscribe((post) => {
        resolve(post);
      }, error => reject(error))
    })
  }

  @Action(DeletePost)
  public deletePost({ getState, patchState, dispatch }: StateContext<AppStateModel>, {id}: DeletePost) {
    return new Promise<void>((resolve, reject) => {
      this.postsService.deletePost(id).subscribe((post) => {
        resolve(post);
      }, error => reject(error))
    })
  }

  @Action(PutPost)
  public putPost({ getState, patchState, dispatch }: StateContext<AppStateModel>, {id, post}: PutPost) {
    return new Promise<void>((resolve, reject) => {
      this.postsService.updatePost(id, post).subscribe((post) => {
        resolve(post);
      }, error => reject(error))
    })
  }

  @Action(SelectPost)
  public selectPost({ getState, patchState, dispatch }: StateContext<AppStateModel>, {post}: SelectPost) {
    patchState({
      postSelected: post
    })
  }


}
