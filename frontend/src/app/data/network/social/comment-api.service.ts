import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BASE_URL } from '../constant';
import { CommentNetworkModel } from '../../models/CommentNetworkModel';
import { Comment } from '../../../view/basicModels/comment';
import { AuthHeaders } from '../auth/auth_headers';

@Injectable({
  providedIn: 'root'
})
export class CommentAPIService {

  constructor(private http: HttpClient) { }


  createComment(post_id:number, content: string): Observable<any>{
    const payload = {
      'content': content
    }
    const headers = new HttpHeaders().set(AuthHeaders.COMMENT_AUTH, AuthHeaders.COMMENT_AUTH)
    return this.http.post(`${BASE_URL}social/comments/${post_id}`, payload, {
      headers: headers
    })
  }

  deleteComment(id: number): Observable<any>{
    const headers = new HttpHeaders().set(AuthHeaders.COMMENT_AUTH, AuthHeaders.COMMENT_AUTH)
    return this.http.delete(`${BASE_URL}social/comments/detail/${id}`, {
      headers: headers
    })
  }

  updateComment(id: number, content: string): Observable<any>{
    const payload = {
      'content': content
    }
    const headers = new HttpHeaders().set(AuthHeaders.COMMENT_AUTH, AuthHeaders.COMMENT_AUTH)
    return this.http.put(`${BASE_URL}social/comments/detail/${id}`, payload, {
      headers: headers
    })
  }

  getCommentById(comm_id: number): Observable<Comment>{
    const headers = new HttpHeaders().set(AuthHeaders.COMMENT_AUTH, AuthHeaders.COMMENT_AUTH)

    return this.http.get<CommentNetworkModel>(`${BASE_URL}social/comments/detail/${comm_id}`, {
      headers: headers
    }).pipe(
      map((comm: CommentNetworkModel) => 
        ({
          id: comm.id,
          author: comm.author.username,
          post: comm.post,
          author_id: comm.author.id,
          content: comm.content,
          createdDate: new Date(comm.created_date),
          updated: comm.updated_date ? new Date(comm.updated_date) : null
        }  as Comment)
      ))
    
  }

  getAllComments(post_id: number): Observable<Comment[]>{
    return this.http.get<CommentNetworkModel[]>(`${BASE_URL}social/comments/${post_id}`).pipe(
      map((comments: CommentNetworkModel[]) => comments.map(comm=> 
        ({
          id: comm.id,
          author: comm.author.username,
          post: comm.post,
          author_id: comm.author.id,
          content: comm.content,
          createdDate: new Date(comm.created_date),
          updated: comm.updated_date ? new Date(comm.updated_date) : null
        }  as Comment)
      ))
    )
  }

}
