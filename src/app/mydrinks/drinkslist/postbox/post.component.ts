import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { PostsService } from './posts.service';
import { PostDialogue } from './postbox.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Post } from '../../../types';
import { ConfirmDeleteDialog } from '../drinkslist.component';


const shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input() id: number;
  @Input() userId: number;
  @Input() title: string;
  @Input() content: string;
  @Input() date: string;
  @Input() drinkId: number;
  username: string;

  @Output() public onDelete: EventEmitter<any> = new EventEmitter();

  constructor(public authService: AuthService,
              private postsService: PostsService,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.authService.getUsername(this.userId)
      .subscribe(res => this.username = res.username);

    const d = new Date(this.date)
    this.date = `${d.getFullYear()} ${shortMonthNames[d.getMonth()]} ${d.getDate()}`;
    
  }

  openEdit(post: Post) {
    const dRef = this.dialog.open(PostDialogue, {
      width: "600px",
      data: {post}
    });

    dRef.afterClosed().subscribe(res => {
      console.log(this.drinkId);
      if (res) {
        this.postsService.modifyPost(res)
          .subscribe(() => {
            
          })
        this.title = res.title;
        this.content = res.content;
        let d = new Date();
        this.date = `${d.getFullYear()} ${shortMonthNames[d.getMonth()]} ${d.getDate()}`;
        
      }
    })
  }

  deletePost() {
    const dRef = this.dialog.open(ConfirmDeleteDialog, {
      width: "600px"
    });

    dRef.afterClosed().subscribe(res => {
      if (res) this.postsService.deletePost(this.id).subscribe(r => console.log(r));
      this.onDelete.emit();
    });
  
  }
}
