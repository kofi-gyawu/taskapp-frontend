import { Component, OnInit } from '@angular/core';
import { TaskcardComponent } from "./taskcard/taskcard.component";
import { CommonModule } from '@angular/common';
import { Task } from './task.model';
import { getHeadersWithAuthorization } from '@acusti/aws-signature-v4';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-task-list',
  imports: [TaskcardComponent,CommonModule,HttpClientModule],
  providers: [HttpClient],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit{
  tasks: Task[] = [];

  constructor(private http: HttpClient){}
  ngOnInit(): void {
    this.getTasks();
  }
  async getTasks(){
    const id_token = localStorage.getItem("id_token");
    const accessKeyId = localStorage.getItem("accessKeyId");
    const secretAccessKey = localStorage.getItem("secretKey");
    const sessionToken = localStorage.getItem("sessionToken");
    console.log(id_token,accessKeyId,secretAccessKey,sessionToken);
    if( accessKeyId != null && secretAccessKey != null && sessionToken != null) {
      const body = JSON.stringify({
        id: id_token
      })
      const headers = await getHeadersWithAuthorization(
        'https://momiq1uwd9.execute-api.eu-central-1.amazonaws.com/task',
        {  body,method: 'POST'},
        {
          accessKeyId: accessKeyId,
          secretAccessKey: secretAccessKey,
          sessionToken: sessionToken,
          service: "execute-api",
          region: "eu-central-1"
        }
      );
      const response = await fetch('https://momiq1uwd9.execute-api.eu-central-1.amazonaws.com/tasks',{body, headers,method:'POST'});
    }
  }
}

