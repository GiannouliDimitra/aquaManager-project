import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Post } from './post';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private postsUrl = 'https://jsonplaceholder.typicode.com/posts';
  private usersUrl = 'https://jsonplaceholder.typicode.com/users';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient: HttpClient) {}

  getAllPosts(): Observable<Post[]> {
    return this.httpClient.get<Post[]>(this.postsUrl).pipe(catchError(this.errorHandler));
  }

  getPostsWithUsers(): Observable<Post[]> {
    return forkJoin({
      posts: this.httpClient.get<Post[]>(this.postsUrl),
      users: this.httpClient.get<any[]>(this.usersUrl)
    }).pipe(
      map(({ posts, users }) => {
        return posts.map(post => {
          const user = users.find(u => u.id === post.userId);
          return {
            ...post,
            username: user ? user.username : 'Unknown User'
          };
        });
      }),
      catchError(this.errorHandler)
    );
  }

  findPostById(id: number): Observable<Post> {
    return this.httpClient.get<Post>(`${this.postsUrl}/${id}`).pipe(
      catchError(this.errorHandler)
    );
  }


  createPost(post: Post): Observable<Post> {
    return this.httpClient.post<Post>(this.postsUrl, post, this.httpOptions).pipe(
      catchError(this.errorHandler)
    );
  }

  deletePost(id: number): Observable<any> {
    return this.httpClient.delete(`${this.postsUrl}/${id}`, this.httpOptions).pipe(
      catchError(this.errorHandler)
    );
  }

  updatePost(id: number, post: Post): Observable<Post> {
    return this.httpClient.put<Post>(`${this.postsUrl}/${id}`, post, this.httpOptions).pipe(
      catchError(this.errorHandler)
    );
  }

  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
