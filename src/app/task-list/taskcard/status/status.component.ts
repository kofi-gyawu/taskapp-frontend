import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon'
import { Task } from '../../task.model';
import { ACCESS_KEY_ID, API, REGION, SECRET_KEY, SERVICE, SESSION_TOKEN } from '../../../app.const';
import { getHeadersWithAuthorization } from '@acusti/aws-signature-v4';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-status',
  imports: [CommonModule,MatIconModule],
  providers:[ToastrService],
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss'
})
export class StatusComponent implements OnInit{
  constructor(
    private toastr: ToastrService,
  ) {
  }

  @Input() task!: Task;
  @Input() isAdmin!: boolean;
  isExpired: boolean = true;
  isComplete:boolean = true;

  ngOnInit(): void {
    this.isExpired = this.task.status === "expired";
    this.isComplete = this.task.status === "complete";
    console.log(this.isExpired);
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
        this.isExpired=false;
      }
    }
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
        this.toastr.error("Couldnt Complete");
        this.isComplete = true;
      } else {
        this.task = await response.json();
      }
    }
  }

}
