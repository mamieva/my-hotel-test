import {Params} from '@angular/router';
import { Post } from './app.state';

export class GetPosts {
    public static readonly type = '[AppStateModel] GetPosts';
    constructor() { }
}

export class PostNewPost {
    public static readonly type = '[AppStateModel] PostNewPost';
    constructor(public post: Post) { }
}

export class PutPost {
    public static readonly type = '[AppStateModel] PutPost';
    constructor(public id: number, public post: Post) { }
}

export class DeletePost {
    public static readonly type = '[AppStateModel] DeletePost';
    constructor(public id: number) { }
}

export class SelectPost {
    public static readonly type = '[AppStateModel] SelectPost';
    constructor(public post: Post) { }
}
