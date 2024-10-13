import { Component } from '@angular/core';
  
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostService } from '../post.service';
import { Post } from '../post';
  
@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent {
  
  posts: Post[] = [];
      
  constructor(public postService: PostService) { }

  ngOnInit(): void {
    this.postService.getPostsWithUsers().subscribe((data: Post[])=>{
      this.posts = data;
      console.log(this.posts);
    })  
  }
      
  deletePost(id:number){
    this.postService.deletePost(id).subscribe(res => {
         this.posts = this.posts.filter(item => item.id !== id);
         alert('ιΤο Post διαγράφηκε με επιτυχία!')
    })
  }
  
}
