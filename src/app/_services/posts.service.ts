import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { map, timeout } from 'rxjs/operators';
import { Params } from '@angular/router';
import { Store } from '@ngxs/store';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})

export class PostsService {

  constructor(
    private api: ApiService,
  ) {
  }

  getPosts(): Observable<any> {
    return this.api.get(`posts`)
      .pipe(map((res: any) => res));
  }
  postPost(params: Params): Observable<any> {
    return this.api.post(`posts`, params)
      .pipe(map((res: any) => res));
  }
  updatePost(id: number, params: Params): Observable<any> {
    return this.api.put(`posts/${id}`, params)
      .pipe(map((res: any) => res));
  }
  deletePost(id: number): Observable<any> {
    return this.api.remove(`posts/${id}`)
      .pipe(map((res: any) => res));
  }
}
