import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../post.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Post } from '../post'; 

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  form!: FormGroup;
  users: any[] = []; 

  constructor(
    public postService: PostService,
    private router: Router
  ) { }

  ngOnInit(): void {
   
    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      body: new FormControl('', Validators.required),
      userId: new FormControl('', Validators.required) // Add userId to the form
    });

    // Fetch users from the API for the dropdown
    this.postService.getPostsWithUsers().subscribe((result: any) => {
      this.users = result; 
    });
  }

  // Helper to access form controls in the template
  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      alert('Το νέο Post δεν καταχωρήθηκε. Παρακαλούμε συμπληρώστε όλα τα απαραίτητα πεδία.');
      return; 
    }
    this.postService.createPost(this.form.value).subscribe((res: Post) => {
      alert(`Το νέο post με τίλτο ${res.title} καταχωρήθηκα με επιτυχία.`)
      console.log('Post created successfully!', res);
      this.router.navigateByUrl('post/index');
    });
  }
  
}
