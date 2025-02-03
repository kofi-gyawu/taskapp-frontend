import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../task.model';
import { CommonModule } from '@angular/common';
import { ACCESS_KEY_ID, API, REGION, SECRET_KEY, SERVICE, SESSION_TOKEN } from '../../app.const';
import { getHeadersWithAuthorization } from '@acusti/aws-signature-v4';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';

@Component({
  selector: 'app-taskcard',
  imports: [CommonModule, FormsModule],
  providers: [ToastrService],
  templateUrl: './taskcard.component.html',
  styleUrl: './taskcard.component.scss'
})
export class TaskcardComponent implements OnInit{
  constructor(
    private toastr: ToastrService,
  ) {
  }

  ngOnInit(): void {
    this.editComment.next(this.isCommenting);
    this.isntExpired = this.task.status !== "expired";
    console.log(this.task.status === "expired")
    console.log("##########################33");
    console.log(this.task.comment);
    if(this.task.comment) {
      this.comment = this.task.comment;
    }
    
  }

  @Input() task!: Task;
  @Input() isAdmin!: boolean;
  editComment = new Subject<boolean>();
  editComment$ = this.editComment.asObservable();
  isntExpired: boolean = false;
  isCommenting: boolean = false;
  isReassigning: boolean = false;
  comment: string = 'No Comment';

  setEditComment(){
    this.isCommenting = !this.isCommenting;
    this.editComment.next(this.isCommenting)
  }

  toggleIsReassigning() {
    this.isReassigning = !this.isReassigning;
  }

  async completeTask() {
    const accessKeyId = localStorage.getItem(ACCESS_KEY_ID);
    const secretAccessKey = localStorage.getItem(SECRET_KEY);
    const sessionToken = localStorage.getItem(SESSION_TOKEN);
    if( accessKeyId != null && secretAccessKey != null && sessionToken != null) {
      const body = JSON.stringify(this.task)
      const headers = await getHeadersWithAuthorization(
        API+'task/complete',
        {body, method: 'PATCH'},
          {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            sessionToken: sessionToken,
            service: SERVICE,
            region: REGION
          }
      );
      const response = await fetch(API+'task/complete',{body,headers,method: 'PATCH'});
      if(!response.ok) {
        this.toastr.error("Couldnt fetch list");
      } else {
        this.task = await response.json();
      }
    }
  }

  async makeComment(){
    const accessKeyId = localStorage.getItem(ACCESS_KEY_ID);
    const secretAccessKey = localStorage.getItem(SECRET_KEY);
    const sessionToken = localStorage.getItem(SESSION_TOKEN);
    if( this.comment != "No Comment" && accessKeyId != null && secretAccessKey != null && sessionToken != null) {
      this.task.comment = this.comment;
      const body = JSON.stringify(this.task)
      console.log("set task comment")
      const headers = await getHeadersWithAuthorization(
        API+'task/comment',
        {body, method: 'POST'},
          {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            sessionToken: sessionToken,
            service: SERVICE,
            region: REGION
          }
      );
      console.log("done signing");
      const response = await fetch(API+'task/comment',{body,headers,method: 'POST'});
      console.log("sent");
      if(!response.ok) {
        this.toastr.error("Couldnt Send");
      } else {
        this.toastr.success("Sent");
        this.task = await response.json();
      }
    }
    this.setEditComment()
  }
  
  async reopenTask(){
    const accessKeyId = localStorage.getItem(ACCESS_KEY_ID);
    const secretAccessKey = localStorage.getItem(SECRET_KEY);
    const sessionToken = localStorage.getItem(SESSION_TOKEN);
    if( accessKeyId != null && secretAccessKey != null && sessionToken != null) {
      const body = JSON.stringify(this.task)
      const headers = await getHeadersWithAuthorization(
        API+'task/reopen',
        {body, method: 'PATCH'},
          {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            sessionToken: sessionToken,
            service: SERVICE,
            region: REGION
          }
      );
      const response = await fetch(API+'task/reopen',{body,headers,method: 'PATCH'});
      if(!response.ok) {
        this.toastr.error("Couldnt reopen");
      } else {
        this.toastr.success("Task Reopend");
        this.task = await response.json();
      }
    }
  }
}
